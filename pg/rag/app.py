from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import psycopg2
from pgvector.psycopg2 import register_vector
import PyPDF2
import requests
from bs4 import BeautifulSoup
import numpy as np
import ollama
from io import BytesIO
import time

# The following are required libraries
# ollama, psycopg2, pgvector, PyPDF2, requests, beautifulsoup4



# --------------------------------------
# Author: Mohan Chinnappan

# RAG (Retrieval-Augmented Generation) with Ollama and pgvector
# This code is a Flask application that allows users to upload PDF files or provide URLs,
# extracts text from them, generates embeddings using Ollama, and stores them in a PostgreSQL database.
# It also provides a search functionality to retrieve relevant documents based on user queries.
# --------------------------------------

# Flask app setup
app = Flask(__name__)

# Enable CORS for requests from http://localhost:9000
CORS(app, resources={r"/*": {"origins": "http://localhost:9000"}})

# PostgreSQL connection
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="postgres",
    host="localhost",
    port="5432"
)
register_vector(conn)  # Register vector type for psycopg2
cursor = conn.cursor()

# Initialize pgvector table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        content TEXT,
        embedding VECTOR(768)
    );
""")
conn.commit()

# Function to extract text from PDF
# This function reads a PDF file and extracts text from each page.
# It uses PyPDF2 to read the PDF and extract text.
# If no text is found, it returns an empty string.

def extract_pdf_text(file):
    pdf_reader = PyPDF2.PdfReader(BytesIO(file.read()))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
    return text

# Function to extract text from URL
# This function fetches the content of a URL and extracts text using BeautifulSoup.
# It handles exceptions and returns the extracted text or an error message.
# It uses requests to fetch the URL content and BeautifulSoup to parse the HTML.

def extract_url_text(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        text = soup.get_text(separator=' ', strip=True)
        return text
    except Exception as e:
        return str(e)

# Function to generate embeddings using Ollama
def generate_embedding(text):
    response = ollama.embeddings(model='nomic-embed-text', prompt=text)
    return response['embedding']

# Function to chunk text
# This function splits the input text into smaller chunks based on a maximum length.
# It ensures that each chunk does not exceed the specified maximum length.
# It uses a simple word-based approach to split the text into manageable pieces.
# The default maximum length is set to 500 characters.
# The function returns a list of text chunks.
# The function uses a greedy approach to split the text into chunks.
# It iterates through the words in the text and keeps adding them to the current chunk
# until the maximum length is exceeded.
def chunk_text(text, max_length=500):
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    for word in words:
        current_length += len(word) + 1
        if current_length > max_length:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word) + 1
        else:
            current_chunk.append(word)
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

# Route to get available Ollama models
@app.route('/models', methods=['GET'])
def get_models():
    try:
        # Fetch models using ollama.list()
        models = ollama.list()['models']
        # Extract model names and filter out embedding models
        model_names = [
            model['name'] for model in models
            if 'embed' not in model['name'].lower() and model['name'] != 'nomic-embed-text:latest'
        ]
        return jsonify(model_names)
    except Exception as e:
        # Fallback: Direct HTTP request to Ollama API
        try:
            response = requests.get('http://localhost:11434/api/tags')
            response.raise_for_status()
            models = response.json()['models']
            model_names = [
                model['name'] for model in models
                if 'embed' not in model['name'].lower() and model['name'] != 'nomic-embed-text:latest'
            ]
            return jsonify(model_names)
        except Exception as fallback_e:
            return jsonify({"error": f"Failed to fetch models: {str(fallback_e)}"}), 500

# Route to serve the frontend (optional, if not using static server)
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle PDF/URL upload
@app.route('/upload', methods=['POST'])
def upload():
    start_time = time.time()
    try:
        
        cursor.execute("TRUNCATE TABLE documents;")  # Clear previous data
        # Check if file or URL is provided
        if 'file' in request.files:
            file = request.files['file']
            # extract text from PDF file
            text = extract_pdf_text(file)
        # Check if URL is provided
        elif 'url' in request.form:
            url = request.form['url']
            # extract text from URL
            text = extract_url_text(url)
        else:
            return jsonify({"error": "No file or URL provided"}), 400

        # Chunk text and store embeddings
        chunks = chunk_text(text)

        for chunk in chunks:
            embedding = generate_embedding(chunk)
            # Store chunk and embedding in PostgreSQL
            cursor.execute(
                "INSERT INTO documents (content, embedding) VALUES (%s, %s)",
                (chunk, embedding)
            )
        conn.commit()
        time_taken = time.time() - start_time
        return jsonify({"message": "Document processed successfully", "time_taken": f"{time_taken:.2f} seconds"})
    except Exception as e:
        time_taken = time.time() - start_time
        return jsonify({"error": str(e), "time_taken": f"{time_taken:.2f} seconds"}), 500

# Route to handle search and RAG query
# This route handles the search functionality.
# It takes a query from the user, generates an embedding for the query,
# and retrieves the top 3 most similar documents from the database.
# It then constructs a prompt for the Ollama model using the retrieved documents
# and the user's query.
# Finally, it queries the Ollama model and returns the answer along with the context.
# The search function uses the pgvector extension to perform similarity search
# on the embeddings stored in the PostgreSQL database.
@app.route('/search', methods=['POST'])
def search():
    start_time = time.time()
    try:
        query = request.form['query']
        llm_model = request.form.get('llm_model', 'llama3.2')  # Default to llama3.2 if not provided
        query_embedding = generate_embedding(query)
        
        # Search for top 3 similar (cosine) documents
        cursor.execute("""
            SELECT content, embedding <=> %s::vector AS distance
            FROM documents
            ORDER BY embedding <=> %s::vector
            LIMIT 3;
        """, (query_embedding, query_embedding))
        results = cursor.fetchall()
        
        # Prepare context for Ollama
        # Concatenate the content of the top 3 documents
        context = "\n".join([row[0] for row in results])
        # Construct prompt for Ollama
        # The prompt includes the context and the user's query
        # The prompt is formatted as a string with the context and question.
        prompt = f"Context: {context}\n\nQuestion: {query}\nAnswer:"
        
        # Query Ollama model
        response = ollama.chat(
            model=llm_model,
            messages=[{'role': 'user', 'content': prompt}]
        )
        answer = response['message']['content']
        
        time_taken = time.time() - start_time
        return jsonify({
            "answer": answer,
            "context": context,
            "time_taken": f"{time_taken:.2f} seconds"
        })
    except Exception as e:
        time_taken = time.time() - start_time
        return jsonify({
            "error": str(e),
            "time_taken": f"{time_taken:.2f} seconds"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Backend runs on port 5000