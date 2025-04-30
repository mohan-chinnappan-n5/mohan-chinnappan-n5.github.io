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
import subprocess
import json
import re

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

# Store Salesforce credentials (in-memory, temporary for session)
salesforce_credentials = {}

# Function to extract text from PDF
def extract_pdf_text(file):
    pdf_reader = PyPDF2.PdfReader(BytesIO(file.read()))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
    return text

# Function to extract text from URL
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
        models = ollama.list()['models']
        model_names = [
            model['name'] for model in models
            if 'embed' not in model['name'].lower() and model['name'] != 'nomic-embed-text:latest'
        ]
        return jsonify(model_names)
    except Exception as e:
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

# Route to handle Salesforce authentication
@app.route('/salesforce-auth', methods=['POST'])
def salesforce_auth():
    start_time = time.time()
    try:
        username = request.form.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400

        # Run sf force org display command to get instanceUrl, accessToken, apiVersion
        cmd = ['sf', 'force', 'org', 'display', '-u', username, '--json']
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            return jsonify({"error": f"Failed to authenticate: {result.stderr}"}), 400

        # Parse JSON output
        sf_data = json.loads(result.stdout)
        credentials = {
            'instanceUrl': sf_data['result']['instanceUrl'],
            'accessToken': sf_data['result']['accessToken'],
            'apiVersion': sf_data['result']['apiVersion']
        }

        # Query User object to get User.Id based on Username
        headers = {
            'Authorization': f"Bearer {credentials['accessToken']}",
            'Content-Type': 'application/json'
        }
        # URL-encode the username to handle special characters
        encoded_username = requests.utils.quote(username)
        user_query = f"SELECT Id FROM User WHERE Username = '{username}'"
        print(f"Executing SOQL query: {user_query}")
        encoded_query = requests.utils.quote(user_query)
        url = f"{credentials['instanceUrl']}/services/data/v{credentials['apiVersion']}/query?q={encoded_query}"
        print(f"Query URL: {url}")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        user_data = response.json()
        print(f"User data: {user_data}")
        if not user_data['records']:
            return jsonify({"error": f"No user found with username: {username}"}), 400
        
        credentials['userId'] = user_data['records'][0]['Id']
        print(f"User ID: {credentials['userId']}")
        
        # Store credentials in memory
        salesforce_credentials[username] = credentials
        
        time_taken = time.time() - start_time
        return jsonify({
            "message": "Salesforce authentication successful",
            "time_taken": f"{time_taken:.2f} seconds"
        })
    except Exception as e:
        time_taken = time.time() - start_time
        return jsonify({
            "error": f"Failed to authenticate: {str(e)}",
            "time_taken": f"{time_taken:.2f} seconds"
        }), 500

# Route to handle Salesforce query
@app.route('/salesforce-query', methods=['POST'])
def salesforce_query():
    start_time = time.time()
    try:
        query = request.form['query']
        print(f"Received query: {query}")
        # Check if the user is authenticated
        llm_model = request.form.get('llm_model', 'gemma3:latest')
        username = request.form.get('username')

        if not username or username not in salesforce_credentials:
            return jsonify({"error": "Please authenticate with Salesforce first"}), 400

        # Get raw SOQL query from LLM
        prompt = (
            f"Convert this natural language question into a valid Salesforce SOQL query for use in the REST API. "
            f"Return only the SOQL query itself, without markdown, explanations, or extra text. "
            f"For queries about the current user, use the placeholder CURRENT_USER_ID for OwnerId or similar fields. "
            f"Do not use bind variables like :UserInfo.getUserId() as they are not allowed in REST API queries. "
            f"Example question: 'How many contacts are owned by me?' "
            f"Example SOQL: SELECT COUNT(Id) FROM Contact WHERE OwnerId = CURRENT_USER_ID "
            f"Example question: 'How many opportunities are in Proposal stage?' "
            f"Example SOQL: SELECT COUNT(Id) FROM Opportunity WHERE StageName = 'Proposal' "
            f"Question: '{query}'"
        )
        response = ollama.chat(
            model=llm_model,
            messages=[{'role': 'user', 'content': prompt}]
        )
        soql_query = response['message']['content'].strip()

        print(f"Generated SOQL query: {soql_query}")

        # Clean up any markdown or unwanted text
        soql_query = re.sub(r'```(?:sql)?\n?', '', soql_query)  # Remove ```sql or ```
        soql_query = re.sub(r'Generated SOQL query:.*?\n', '', soql_query, flags=re.IGNORECASE)  # Remove prefix
        soql_query = soql_query.strip()

        # Replace CURRENT_USER_ID with actual user ID
        user_id = salesforce_credentials[username]['userId']
        soql_query = soql_query.replace('CURRENT_USER_ID', f"'{user_id}'")

        # Validate SOQL query (basic check for SELECT)
        if not soql_query.upper().startswith('SELECT'):
            return jsonify({"error": "Generated query is not a valid SOQL query"}), 400

        # Execute SOQL query via Salesforce REST API
        creds = salesforce_credentials[username]
        headers = {
            'Authorization': f"Bearer {creds['accessToken']}",
            'Content-Type': 'application/json'
        }
        # URL-encode the SOQL query to handle spaces and special characters
        encoded_query = requests.utils.quote(soql_query)
        url = f"{creds['instanceUrl']}/services/data/v{creds['apiVersion']}/query?q={encoded_query}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        results = response.json()['records']
        
        time_taken = time.time() - start_time
        return jsonify({
            "soql_query": soql_query,
            "results": results,
            "time_taken": f"{time_taken:.2f} seconds"
        })
    except Exception as e:
        time_taken = time.time() - start_time
        return jsonify({
            "error": f"Failed to execute query: {str(e)}",
            "time_taken": f"{time_taken:.2f} seconds"
        }), 500

# Route to handle PDF/URL upload
@app.route('/upload', methods=['POST'])
def upload():
    start_time = time.time()
    try:
        cursor.execute("TRUNCATE TABLE documents;")  # Clear previous data
        if 'file' in request.files:
            file = request.files['file']
            text = extract_pdf_text(file)
        elif 'url' in request.form:
            url = request.form['url']
            text = extract_url_text(url)
        else:
            return jsonify({"error": "No file or URL provided"}), 400

        # Chunk text and store embeddings
        chunks = chunk_text(text)
        for chunk in chunks:
            embedding = generate_embedding(chunk)
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

# Route to handle RAG search
@app.route('/search', methods=['POST'])
def search():
    start_time = time.time()
    try:
        query = request.form['query']
        llm_model = request.form.get('llm_model', 'gemma3:latest')
        query_embedding = generate_embedding(query)
        
        # Search for top 3 similar documents
        cursor.execute("""
            SELECT content, embedding <=> %s::vector AS distance
            FROM documents
            ORDER BY embedding <=> %s::vector
            LIMIT 3;
        """, (query_embedding, query_embedding))
        results = cursor.fetchall()
        
        # Prepare context for Ollama
        context = "\n".join([row[0] for row in results])
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