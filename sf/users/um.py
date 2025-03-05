from flask import Flask, request, jsonify
import requests
import sys
import logging

app = Flask(__name__)

# Configure logging to print to both file and terminal
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('salesforce_user_backend.log'),  # File logging
        logging.StreamHandler(sys.stdout)  # Terminal logging
    ]
)

@app.route('/fetch_users', methods=['POST'])
def fetch_users():
    try:
        data = request.json
        print(request.json)
        access_token = data.get('access_token')
        instance_url = data.get('instance_url')
        api_version = data.get('api_version', 'v60.0')

        if not access_token or not instance_url:
            return jsonify({'error': 'Access Token and Instance URL are required'}), 400

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        # Query all users
        query_url = f'{instance_url}/services/data/{api_version}/query?q=SELECT+Id,+Name,+Email+FROM+User'
        print(query_url)
        response = requests.get(query_url, headers=headers)
        print(response)
        response.raise_for_status()
        users = response.json().get('records', [])

        logging.info(f'Fetched {len(users)} users from Salesforce')
        return jsonify({'users': users})

    except requests.exceptions.RequestException as e:
        logging.error(f'Error fetching users: {str(e)}')
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        logging.error(f'Unexpected error fetching users: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/fetch_user', methods=['POST'])
def fetch_user():
    try:
        data = request.json
        access_token = data.get('access_token')
        instance_url = data.get('instance_url')
        user_id = data.get('user_id')
        api_version = data.get('api_version', 'v60.0')

        if not access_token or not instance_url or not user_id:
            return jsonify({'error': 'Access Token, Instance URL, and User ID are required'}), 400

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        # Fetch user details
        user_url = f'{instance_url}/services/data/{api_version}/sobjects/User/{user_id}'
        response = requests.get(user_url, headers=headers)
        response.raise_for_status()
        user = response.json()

        logging.info(f'Fetched details for user {user_id} from Salesforce')
        return jsonify({'user': user})

    except requests.exceptions.RequestException as e:
        logging.error(f'Error fetching user details: {str(e)}')
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        logging.error(f'Unexpected error fetching user details: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/fetch_permissions', methods=['POST'])
def fetch_permissions():
    try:
        data = request.json
        access_token = data.get('access_token')
        instance_url = data.get('instance_url')
        user_id = data.get('user_id')
        api_version = data.get('api_version', 'v60.0')

        if not access_token or not instance_url or not user_id:
            return jsonify({'error': 'Access Token, Instance URL, and User ID are required'}), 400

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        # Fetch permission sets assigned to the user
        perms_url = f'{instance_url}/services/data/{api_version}/sobjects/User/{user_id}/PermissionSetAssignments'
        response = requests.get(perms_url, headers=headers)
        response.raise_for_status()
        permissions = response.json().get('records', [])

        logging.info(f'Fetched {len(permissions)} permission sets for user {user_id} from Salesforce')
        return jsonify({'permissions': permissions})

    except requests.exceptions.RequestException as e:
        logging.error(f'Error fetching permissions: {str(e)}')
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        logging.error(f'Unexpected error fetching permissions: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Enable Werkzeug's debug logging to see more output in terminal
    import logging
    logging.getLogger('werkzeug').setLevel(logging.INFO)
    app.run(debug=True, host='0.0.0.0', port=7000)