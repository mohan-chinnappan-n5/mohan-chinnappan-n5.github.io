from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import logging
from datetime import datetime
import re


#-------------
# Backend API server    
# supports two endpoints:
# 1. /fetch_fields: Fetches fields for an SObject
# 2. /query_data: Queries data using SOQL
# The server is CORS-enabled to allow requests from the frontend
# The server runs on port 5000
# To run the server, execute the following command:
# python backend.py
# author: mohan chinnappan
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

# Initialize Flask app and enable CORS for frontend requests
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='soql_backend.log'
)
logger = logging.getLogger(__name__)

# Validate Salesforce REST URL
def validate_salesforce_rest_url(url):
    if not url:
        return True
    # Regex for Salesforce REST/Tooling API URLs (starts with /services/data/ or /services/tooling/)
    pattern = r'^/services/(data|tooling)/v\d+\.\d+/'
    return bool(re.match(pattern, url))

# Fetch SObject fields (REST or Tooling API)
@app.route('/fetch_fields', methods=['POST'])
def fetch_fields():
    """
    Fetch field names for a given Salesforce SObject using REST or Tooling API, or a custom REST URL.
    
    Request Body (JSON):
    - sobject_name: Name of the Salesforce SObject (e.g., 'Account') or null if using custom_url
    - access_token: Salesforce OAuth access token
    - instance_url: Salesforce instance URL (e.g., 'https://your-domain.my.salesforce.com')
    - api_version: Salesforce API version (default: 'v60.0')
    - tooling: Boolean to use Tooling API instead of REST API (default: False)
    - custom_url: Optional custom REST URL (e.g., '/services/data/v60.0/sobjects/Account/describe')
    
    Returns:
    - JSON: List of field names or error message
    """
    try:
        data = request.get_json()
        sobject_name = data.get('sobject_name')
        access_token = data.get('access_token')
        instance_url = data.get('instance_url')
        api_version = data.get('api_version', 'v60.0')
        tooling = data.get('tooling', False)
        custom_url = data.get('custom_url')

        # Validate required parameters
        if not all([access_token, instance_url]):
            logger.error("Missing required parameters for fetching fields")
            return jsonify({
                'error': 'Missing required parameters: access_token or instance_url'
            }), 400

        if custom_url and not validate_salesforce_rest_url(custom_url):
            logger.error(f"Invalid REST URL format: {custom_url}")
            return jsonify({
                'error': 'Invalid REST URL format. Must start with /services/data/ or /services/tooling/.'
            }), 400

        # Use custom URL if provided, otherwise construct default
        url = f"{instance_url}{custom_url}" if custom_url else f"{instance_url}/services/data/{api_version}/sobjects/{sobject_name}/describe"
        if tooling and not custom_url:
            url = f"{instance_url}/services/data/{api_version}/tooling/sobjects/{sobject_name}/describe"

        logger.info(f"Fetching fields using {'custom URL' if custom_url else 'default endpoint'} at {url}")

        # Make API request to Salesforce
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(url, headers=headers, timeout=10)  # 10-second timeout

        # Check for non-2xx responses
        response.raise_for_status()
        fields_data = response.json()
        fields = [field['name'] for field in fields_data['fields']] if 'fields' in fields_data else []

        logger.info(f"Successfully fetched {len(fields)} fields")
        return jsonify({'fields': fields}), 200

    except requests.exceptions.RequestException as e:
        error_msg = f"Network or request failed: {str(e)}"
        logger.error(error_msg)
        return jsonify({
            'error': 'Network or request failed',
            'message': str(e)
        }), 500
    except KeyError:
        logger.error("Invalid response format from Salesforce for fields")
        return jsonify({
            'error': 'Invalid response format from Salesforce'
        }), 500
    except Exception as e:
        error_msg = f"Server error while fetching fields: {str(e)}"
        logger.error(error_msg)
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

# Query SOQL data (REST or Tooling API)
@app.route('/query_data', methods=['POST'])
def query_data():
    """
    Execute a SOQL query or custom REST request using REST or Tooling API to retrieve data from Salesforce.
    
    Request Body (JSON):
    - soql_query: SOQL query string (e.g., 'SELECT Id, Name FROM Account') or null if using custom_url
    - access_token: Salesforce OAuth access token
    - instance_url: Salesforce instance URL (e.g., 'https://your-domain.my.salesforce.com')
    - api_version: Salesforce API version (default: 'v60.0')
    - tooling: Boolean to use Tooling API instead of REST API (default: False)
    - custom_url: Optional custom REST URL (e.g., '/services/data/v60.0/query?q=SELECT+Id,+Name+FROM+Account')
    
    Returns:
    - JSON: Query results or error message
    """
    try:
        data = request.get_json()
        soql_query = data.get('soql_query')
        access_token = data.get('access_token')
        instance_url = data.get('instance_url')
        api_version = data.get('api_version', 'v60.0')
        tooling = data.get('tooling', False)
        custom_url = data.get('custom_url')

        # Validate required parameters
        if not all([access_token, instance_url]):
            logger.error("Missing required parameters for querying data")
            return jsonify({
                'error': 'Missing required parameters: access_token or instance_url'
            }), 400

        if custom_url and not validate_salesforce_rest_url(custom_url):
            logger.error(f"Invalid REST URL format: {custom_url}")
            return jsonify({
                'error': 'Invalid REST URL format. Must start with /services/data/ or /services/tooling/.'
            }), 400

        # Use custom URL if provided, otherwise construct default SOQL query
        url = f"{instance_url}{custom_url}" if custom_url else f"{instance_url}/services/data/{api_version}/query?q={requests.utils.quote(soql_query)}"
        if tooling and not custom_url:
            url = f"{instance_url}/services/data/{api_version}/tooling/query?q={requests.utils.quote(soql_query)}"

        logger.info(f"Executing query using {'custom URL' if custom_url else 'default endpoint'} at {url}")

        # Make API request to Salesforce
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(url, headers=headers, timeout=30)  # 30-second timeout for queries

        # Check for non-2xx responses
        if response.status_code != 200:
            return jsonify({
                'error': f"Failed to query data: {response.text}",
                'status_code': response.status_code
            }), response.status_code
        #response.raise_for_status()
        query_result = response.json()

        logger.info(f"Successfully queried {query_result.get('totalSize', 0)} records")
        return jsonify({'result': query_result}), 200

    except requests.exceptions.RequestException as e:
        error_msg = f"Network or request failed during SOQL query: {str(e)}"
        logger.error(error_msg)
        return jsonify({
            'error': 'Network or request failed during SOQL query',
            'message': str(e)
        }), 500
    except KeyError as e:
        logger.error(f"Missing expected field in response: {str(e)}")
        return jsonify({
            'error': f'Missing expected field in the response: {str(e)}'
        }), 500
    except ValueError as e:
        logger.error(f"Invalid JSON in response or request body: {str(e)}")
        return jsonify({
            'error': 'Invalid JSON in response or request body',
            'message': str(e)
        }), 400
    except Exception as e:
        error_msg = f"Server error during SOQL query: {str(e)}"
        logger.error(error_msg)
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Starting SOQL Backend Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)