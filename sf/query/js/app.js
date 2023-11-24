// app.js
// mohan chinnappan

const getEle = (id) => document.getElementById(id);

// Load previous input from localStorage
const savedData = JSON.parse(localStorage.getItem('orgData'));
// console.log(savedData);
if (savedData) {
    getEle('accessTokenInput').value = savedData.accessToken;
    getEle('instanceUrlInput').value = savedData.instanceUrl;
}

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('o')) {
    const input = urlParams.get('o');
    const inputObj = JSON.parse(atob(input));
    const accessToken = decodeURIComponent(inputObj[0].split('=')[1]);
    const instanceUrl = decodeURIComponent(inputObj[1].split('=')[1]);
    getEle('accessTokenInput').value = accessToken;
    getEle('instanceUrlInput').value = instanceUrl;
}


let queryEditor;
let resultEditor;


require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
    },
});
require(['vs/editor/editor.main'], function () {
    
    // Initialize Monaco Editor for query input
    queryEditor = monaco.editor.create(getEle('queryEditor'), {
        value: 'SELECT Id, Name FROM Account LIMIT 5',
        language: 'sql',
        theme: 'vs-dark',
        automaticLayout: true
    });

    // Initialize Monaco Editor for result display
    resultEditor = monaco.editor.create(getEle('resultEditor'), {
        value: '',
        language: 'json',
        theme: 'vs-dark',
        readOnly: true,
        automaticLayout: true
    });
});

// Function to save access token and instance URL to local storage
function saveCredentials() {
    const accessToken = getEle('accessTokenInput').value;
    const instanceUrl = getEle('instanceUrlInput').value;

    // Store input in localStorage
    const data = { accessToken, instanceUrl };
    console.log(data);
    //console.log(data);
    localStorage.setItem('orgData', JSON.stringify(data));

}

// Function to query Salesforce using the saved credentials and query
function querySalesforce() {
   const accessToken = getEle('accessTokenInput').value
   const instanceUrl = getEle('instanceUrlInput').value 


    if (!accessToken || !instanceUrl) {
        alert('Please enter the access token and instance URL in the left pane.');
        return;
    }

    var query = queryEditor.getValue();

    // Salesforce REST API endpoint for querying records
    var apiEndpoint = `${instanceUrl}/services/data/v58.0/query?q=${encodeURIComponent(query)}`;

    // Make a GET request to the Salesforce REST API with 'no-cors' mode
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };
    fetch(apiEndpoint, {
        method: 'GET',
        headers, 
        // mode: 'no-cors'
    })
        .then(response => {
            // Check if the request was successful (status code 2xx)
            if (!response.ok) {
                throw new Error(`Salesforce API request failed: ${response.status} - ${response.statusText}`);
            }
            // Parse the JSON response
            return response.json();
        })
        .then(data => {
            // Return the query results
            resultEditor.setValue(JSON.stringify(data, null, 2));
        })
        .catch(error => {
            resultEditor.setValue('Error: ' + error.message + "\nDid you set up CORS in your Org?");
        });
}