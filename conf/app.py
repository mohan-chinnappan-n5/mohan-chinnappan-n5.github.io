import streamlit as st
import streamlit.components.v1 as components
import uuid

# Streamlit page configuration
st.set_page_config(page_title="Video Conferencing App", layout="wide")

# Custom HTML/JavaScript for WebRTC
html_code = """
<div class="flex flex-col min-h-screen bg-gray-100">
    <!-- Sticky Navbar -->
    <nav class="sticky top-0 bg-blue-600 text-white p-4 shadow-md z-10">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold">Video Conference</h1>
            <div class="space-x-4">
                <button id="muteBtn" class="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded">Mute</button>
                <button id="videoBtn" class="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded">Stop Video</button>
                <button id="leaveBtn" class="bg-red-500 hover:bg-red-700 px-3 py-1 rounded">Leave</button>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto p-4">
        <div id="videoGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </main>

    <!-- Sticky Footer -->
    <footer class="sticky bottom-0 bg-gray-800 text-white p-4 shadow-md z-10">
        <div class="container mx-auto flex justify-between items-center">
            <p>© 2025 Video Conferencing App</p>
            <div>
                <span id="participantCount">Participants: 1</span>
            </div>
        </div>
    </footer>
</div>

<script>
    const roomId = "room1";
    const clientId = "user_" + Math.random().toString(36).substr(2, 9);
    const socket = new WebSocket(`ws://localhost:8000/ws/${roomId}/${clientId}`);
    const videoGrid = document.getElementById('videoGrid');
    const participantCount = document.getElementById('participantCount');
    const peers = {};

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            addVideoStream(clientId, stream);

            socket.onmessage = async (event) => {
                const message = JSON.parse(event.data);
                if (message.type === "participants") {
                    participantCount.textContent = `Participants: ${message.participants.length}`;
                    message.participants.forEach(peerId => {
                        if (peerId !== clientId && !peers[peerId]) {
                            createPeerConnection(peerId, stream, true);
                        }
                    });
                } else if (message.type === "offer") {
                    const peer = createPeerConnection(message.from, stream, false);
                    await peer.setRemoteDescription(new RTCSessionDescription(message.offer));
                    const answer = await peer.createAnswer();
                    await peer.setLocalDescription(answer);
                    socket.send(JSON.stringify({
                        type: "answer",
                        answer: peer.localDescription,
                        to: message.from
                    }));
                } else if (message.type === "answer") {
                    await peers[message.from].setRemoteDescription(new RTCSessionDescription(message.answer));
                } else if (message.type === "candidate") {
                    await peers[message.from].addIceCandidate(new RTCIceCandidate(message.candidate));
                }
            };
        });

    function createPeerConnection(peerId, stream, initiator) {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        peers[peerId] = peer;

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.ontrack = (event) => addVideoStream(peerId, event.streams[0]);
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.send(JSON.stringify({
                    type: "candidate",
                    candidate: event.candidate,
                    to: peerId
                }));
            }
        };

        if (initiator) {
            peer.createOffer()
                .then(offer => peer.setLocalDescription(offer))
                .then(() => {
                    socket.send(JSON.stringify({
                        type: "offer",
                        offer: peer.localDescription,
                        to: peerId
                    }));
                });
        }
        return peer;
    }

    function addVideoStream(userId, stream) {
        const existingVideo = document.getElementById(userId);
        if (!existingVideo) {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'relative bg-gray-800 rounded-lg overflow-hidden';
            videoContainer.id = userId;

            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.muted = userId === clientId;
            video.className = 'w-full h-64 object-cover';

            const label = document.createElement('div');
            label.className = 'absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded';
            label.textContent = userId;

            videoContainer.appendChild(video);
            videoContainer.appendChild(label);
            videoGrid.appendChild(videoContainer);
        }
    }

    document.getElementById('muteBtn').addEventListener('click', () => {
        const stream = peers[clientId]?.localStream;
        if (stream) stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    });

    document.getElementById('videoBtn').addEventListener('click', () => {
        const stream = peers[clientId]?.localStream;
        if (stream) stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    });

    document.getElementById('leaveBtn').addEventListener('click', () => {
        socket.close();
        window.location.reload();
    });
</script>
"""

# Streamlit UI
def main():
    st.title("Video Conferencing App")
    
    # Embed the HTML/JavaScript component
    components.html(html_code, height=800)

if __name__ == "__main__":
    main()