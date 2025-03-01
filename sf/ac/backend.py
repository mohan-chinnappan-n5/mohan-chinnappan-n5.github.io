from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

#-------------
# Backend API server    
# supports two endpoints:
# 1. /fetch_fields: Fetches fields for an SObject
# 2. /query_data: Queries data using SOQL
# The server is CORS-enabled to allow requests from the frontend
# The server runs on port 5000
# To run the server, execute the following command:
# python backend.py
# author: mohan chinnappa
# ------------

# The server will be accessible at http://localhost:5000
# The server is in debug mode, so it will automatically reload on code changes
# The server will also print debug logs to the console
# The server requires the requests and Flask libraries
# To install the required libraries, run the following command:
# pip install requests Flask flask-cors
# The server requires a valid Salesforce access token to make requests to Salesforce APIs
# The access token should be passed in the Authorization header of the request
# The server also requires the Salesforce instance URL to make requests to Salesforce APIs
# The instance URL should be passed in the request body
# The server supports both REST and Tooling APIs
# To use the Tooling API, set the tooling parameter to true in the request body
# The server returns JSON responses with the queried data or error messages
# The server handles errors and exceptions and returns appropriate error responses
# The server is a simple Flask application that listens on all interfaces
# The server can be deployed to a production environment using a WSGI server
# The server can be customized to add more endpoints or functionality
# The server can be secured using HTTPS and authentication mechanisms
# The server can be optimized for performance and scalability
# The server can be extended to support more Salesforce APIs and operations
# The server can be integrated with databases, caches, and other services
# The server can be monitored and logged for debugging and analysis
# The server can be tested using unit tests, integration tests, and load tests
# The server can be containerized using Docker and deployed to cloud platforms
# The server can be managed and maintained using CI/CD pipelines and DevOps practices
# The server can be documented and shared with other developers and teams
# The server can be improved based on feedback and requirements
#-------------


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Fetch SObject fields
@app.route('/fetch_fields', methods=['POST'])
def fetch_fields():
    try:
        data = request.get_json()
        sobject_name = data.get('sobject_name')
        access_token = data.get('access_token')
        instance_url = data.get('instance_url')
        api_version = data.get('api_version', 'v60.0')
        tooling = data.get('tooling', False)

        if not all([sobject_name, access_token, instance_url]):
            return jsonify({'error': 'Missing required parameters: sobject_name, access_token, or instance_url'}), 400

        url = f"{instance_url}/services/data/{api_version}/sobjects/{sobject_name}/describe"
        if tooling:
            url = f"{instance_url}/services/data/{api_version}/tooling/sobjects/{sobject_name}/describe"

        print(url)
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(url, headers=headers)

        # Check for non-2xx responses
        if response.status_code != 200:
            return jsonify({
                'error': f"Failed to fetch fields: {response.text}",
                'status_code': response.status_code
            }), response.status_code

        fields_data = response.json()
        fields = [field['name'] for field in fields_data['fields']]
        return jsonify({'fields': fields}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Network or request failed',
            'message': str(e)
        }), 500
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

# Query SOQL data
@app.route('/query_data', methods=['POST'])
def query_data():
    try:
        data = request.get_json()
        soql_query = data.get('soql_query')
        access_token = data.get('access_token')
        instance_url = data.get('instance_url')
        api_version = data.get('api_version', 'v60.0')
        tooling = data.get('tooling', False)

        if not all([soql_query, access_token, instance_url]):
            return jsonify({
                'error': 'Missing required parameters: soql_query, access_token, or instance_url'
            }), 400

        url = f"{instance_url}/services/data/{api_version}/query?q={soql_query}"
        if tooling:
            url = f"{instance_url}/services/data/{api_version}/tooling/query?q={soql_query}"
        print(url)

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(url, headers=headers)

        # Check for non-2xx responses
        if response.status_code != 200:
            return jsonify({
                'error': f"Failed to query data: {response.text}",
                'status_code': response.status_code
            }), response.status_code

        query_result = response.json()
        return jsonify({'result': query_result}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Network or request failed during SOQL query',
            'message': str(e)
        }), 500
    except KeyError as e:
        return jsonify({
            'error': f'Missing expected field in the response: {str(e)}'
        }), 500
    except ValueError as e:
        return jsonify({
            'error': 'Invalid JSON in response or request body',
            'message': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)