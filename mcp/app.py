from flask import Flask, request, jsonify, render_template
import requests
import json

app = Flask(__name__)

# Ollama API endpoint
OLLAMA_API = "http://localhost:11434/api"

# Helper to estimate tokens (rough approximation: 1 word ≈ 1.5 tokens)
def estimate_tokens(text):
    return len(text.split()) * 1.5

# Trim context to fit within token limit (e.g., 2048 tokens)
def trim_context(messages, max_tokens=2048):
    total_tokens = sum(estimate_tokens(msg["content"]) for msg in messages)
    while total_tokens > max_tokens and messages:
        messages.pop(0)  # Remove oldest message
        total_tokens = sum(estimate_tokens(msg["content"]) for msg in messages)
    return messages

# Route to get available Ollama models
@app.route('/models', methods=['GET'])
def get_models():
    try:
        response = requests.get(f"{OLLAMA_API}/tags")
        response.raise_for_status()
        models = response.json()['models']
        model_names = [model['name'] for model in models]
        return jsonify(model_names)
    except Exception as e:
        return jsonify({"error": f"Failed to fetch models: {str(e)}"}), 500

# Route to handle chat requests
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        model = data.get('model', 'gemma2:2b')
        context = data.get('context', [])  # List of {role, content} objects

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Add user message to context
        context.append({"role": "user", "content": user_message})

        # Trim context to avoid exceeding token limit
        context = trim_context(context)

        # Prepare payload for Ollama chat API
        payload = {
            "model": model,
            "messages": context,
            "stream": False
        }

        # Call Ollama chat API
        response = requests.post(f"{OLLAMA_API}/chat", json=payload)
        response.raise_for_status()
        result = response.json()

        # Extract assistant response
        assistant_message = result['message']['content']

        # Add assistant response to context
        context.append({"role": "assistant", "content": assistant_message})

        return jsonify({
            "response": assistant_message,
            "context": context
        })
    except Exception as e:
        return jsonify({"error": f"Failed to process chat: {str(e)}"}), 500

# Route to serve the frontend
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)