from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
import uvicorn

app = FastAPI()

# Configuration
MAX_USERS = 10  # Set 'n' as the maximum number of users allowed
connected_clients: Dict[str, WebSocket] = {}  # Store client WebSocket connections
rooms: Dict[str, List[str]] = {}  # Store room-to-client mapping

@app.websocket("/ws/{room_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, client_id: str):
    await websocket.accept()
    
    # Check if room has space
    if room_id not in rooms:
        rooms[room_id] = []
    
    if len(rooms[room_id]) >= MAX_USERS:
        await websocket.send_json({"type": "error", "message": "Room is full"})
        await websocket.close()
        return

    # Add client to room and connected_clients
    connected_clients[client_id] = websocket
    rooms[room_id].append(client_id)
    await broadcast_room_status(room_id)

    try:
        while True:
            # Receive messages from the client
            data = await websocket.receive_text()
            message = json.loads(data)

            # Handle different message types
            if message["type"] == "offer":
                await send_to_client(message["to"], {
                    "type": "offer",
                    "offer": message["offer"],
                    "from": client_id
                })
            elif message["type"] == "answer":
                await send_to_client(message["to"], {
                    "type": "answer",
                    "answer": message["answer"],
                    "from": client_id
                })
            elif message["type"] == "candidate":
                await send_to_client(message["to"], {
                    "type": "candidate",
                    "candidate": message["candidate"],
                    "from": client_id
                })

    except WebSocketDisconnect:
        # Handle client disconnection
        connected_clients.pop(client_id, None)
        if room_id in rooms and client_id in rooms[room_id]:
            rooms[room_id].remove(client_id)
            if not rooms[room_id]:
                del rooms[room_id]  # Clean up empty rooms
            await broadcast_room_status(room_id)

async def send_to_client(client_id: str, message: dict):
    """Send a message to a specific client."""
    if client_id in connected_clients:
        await connected_clients[client_id].send_json(message)

async def broadcast_room_status(room_id: str):
    """Broadcast the list of participants to all clients in the room."""
    if room_id in rooms:
        participants = rooms[room_id]
        message = {"type": "participants", "participants": participants}
        for client_id in participants:
            await send_to_client(client_id, message)

# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)