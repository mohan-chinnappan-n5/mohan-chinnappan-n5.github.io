import os
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

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
    # Read port from environment variable, default to 5000 if not found
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)