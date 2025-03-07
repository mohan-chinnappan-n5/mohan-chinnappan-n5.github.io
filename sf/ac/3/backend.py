from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import logging
import re
from datetime import datetime

#-------------
# Backend API server    
# supports two endpoints:
# 1. /fetch_fields: Fetches fields for an SObject
# 2. /query_data: Queries data or executes custom REST requests (GET, POST, PATCH, DELETE)
# The server is CORS-enabled to allow requests from the frontend
# The server runs on port 5000
# To run the server, execute: python backend.py
# author: mohan chinnappan
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
    pattern = r'^/services/(data|tooling)/v\d+\.\d+/'
    return bool(re.match(pattern, url))

# Validate HTTP method against URL
def validate_method_for_url(method, url):
    if not url:
        return False
    # Define supported methods for common Salesforce endpoints
    method_map = {
        r'/services/data/v\d+\.\d+/query': ['GET'],
        r'/services/data/v\d+\.\d+/tooling/runTestsAsynchronous': ['POST'],
        r'/services/data/v\d+\.\d+/sobjects/': ['GET', 'POST', 'PATCH', 'DELETE'],
    }
    for pattern, allowed_methods in method_map.items():
        if re.match(pattern, url):
            return method in allowed_methods
    return True  # Allow if no specific pattern matches (fallback)

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

        url = f"{instance_url}{custom_url}" if custom_url else f"{instance_url}/services/data/{api_version}/sobjects/{sobject_name}/describe"
        if tooling and not custom_url:
            url = f"{instance_url}/services/data/{api_version}/tooling/sobjects/{sobject_name}/describe"

        logger.info(f"Fetching fields using {'custom URL' if custom_url else 'default endpoint'} at {url}")

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(url, headers=headers, timeout=10)

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

# Query SOQL data or execute custom REST request (GET, POST, PATCH, DELETE)
@app.route('/query_data', methods=['POST'])
def query_data():
    """
    Execute a SOQL query or custom REST request (GET, POST, PATCH, DELETE) using REST or Tooling API.
    
    Request Body (JSON):
    - soql_query: SOQL query string or null if using custom_url
    - access_token: Salesforce OAuth access token
    - instance_url: Salesforce instance URL
    - api_version: Salesforce API version (default: 'v60.0')
    - tooling: Boolean to use Tooling API (default: False)
    - custom_url: Optional custom REST URL
    - method: HTTP method (GET, POST, PATCH, DELETE, default: 'GET')
    - payload: Optional JSON payload for non-GET requests
    
    Returns:
    - JSON: Query results, test run ID, or error message
    """
    try:
        data = request.get_json()
        soql_query = data.get('soql_query')
        access_token = data.get('access_token')
        instance_url = data.get('instance_url')
        api_version = data.get('api_version', 'v60.0')
        tooling = data.get('tooling', False)
        custom_url = data.get('custom_url')
        method = data.get('method', 'GET').upper()
        payload = data.get('payload')

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

        if custom_url and not validate_method_for_url(method, custom_url):
            logger.error(f"Method {method} not allowed for URL {custom_url}")
            return jsonify({
                'error': f'Method {method} not allowed for URL {custom_url}. Check supported methods.'
            }), 405

        url = f"{instance_url}{custom_url}" if custom_url else \
            f"{instance_url}/services/data/{api_version}/query?q={requests.utils.quote(soql_query)}"
        if tooling and not custom_url and soql_query:
            url = f"{instance_url}/services/data/{api_version}/tooling/query?q={requests.utils.quote(soql_query)}"

        logger.info(f"Executing {method} request at {url}")

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        if method == 'POST':
            response = requests.post(url, headers=headers, data=payload, timeout=30)
        elif method == 'PATCH':
            response = requests.patch(url, headers=headers, data=payload, timeout=30)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=30)
        else:  # GET
            response = requests.get(url, headers=headers, timeout=30)

        if response.status_code != 200:
            return jsonify({'error': f"Failed to query data: {response.text}", 'status_code': response.status_code}), response.status_code

        logging.info(response.json())
        # Check Content-Type to determine response format
        content_type = response.headers.get('Content-Type', '')
        logging.info(content_type)
        
        if 'application/json' in content_type:
            query_result = response.json()
            logger.info(f"Successfully queried {query_result.get('totalSize', 'N/A')} records or completed request")
        else:
            # Handle plain text response (e.g., testRunId from runTestsAsynchronous)
            query_result = response.text
            logger.info(f"Successfully completed request, returned testRunId: {query_result}")

        return jsonify({'result': query_result}), 200

    except requests.exceptions.RequestException as e:
        error_msg = f"Network or request failed during request: {str(e)}"
        logger.error(error_msg)
        return jsonify({
            'error': 'Network or request failed during request',
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
        error_msg = f"Server error during request: {str(e)}"
        logger.error(error_msg)
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Starting SOQL Backend Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)