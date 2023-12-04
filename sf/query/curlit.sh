#!/bin/bash

# Replace these variables with your actual values
VERSION="58.0"
ACCESS_TOKEN=$1
INSTANCE_URL=$2
SOQL_QUERY=$3

# Salesforce REST API endpoint for querying records
API_ENDPOINT="${INSTANCE_URL}/services/data/v${VERSION}/query?q=$(echo ${SOQL_QUERY} | jq -s -R -r @uri)"
echo $API_ENDPOINT

# Make cURL request to Salesforce REST API
curl -X GET "${API_ENDPOINT}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "Content-Type: application/json"  | jq
00D4x000007rxoG!AQkAQNnYPnhWh7hvWMftGTpedjx8q9e2GLenJRjUbGyPOfoHiXANnYMz0hivmbXz8o15YfyOl0rlYrR8aV6ZksDfCzP4OqSW