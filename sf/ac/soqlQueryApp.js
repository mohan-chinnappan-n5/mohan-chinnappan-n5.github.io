//-
// soqlQueryApp.js
// Description: This file contains the code for the soqlQueryApp module.
// The soqlQueryApp module is responsible for handling the SOQL query form and
// results display.

// author: Mohan Chinnappan
//------------------------------------------------------------------------

// Script to show the pre element when hovering on the (i) icon

    const infoIcon = document.getElementById('info-icon');
    const infoText = document.getElementById('info-text');

    // Show the <pre> element when hovering over the (i) icon
    infoIcon.addEventListener('mouseover', () => {
        infoText.classList.remove('hidden');
    });

    // Hide the <pre> element when the mouse leaves the (i) icon
    infoIcon.addEventListener('mouseleave', () => {
        infoText.classList.add('hidden');
    });


function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log("Text copied to clipboard successfully!");
        // window.location.href = "https://mohan-chinnappan-n5.github.io/viz/datatable/dt.html?c";
        // Open the URL in a new tab
        window.open("https://mohan-chinnappan-n5.github.io/viz/datatable/dt.html?c", "_blank");

    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}


require.config({
    paths: {
        'vs': 'https://unpkg.com/monaco-editor@0.34.0/min/vs',
    }
    
});

require(['vs/editor/editor.main'], function(monaco, $) {
    // Initialize SOQL Editor
    const soqlEditor = monaco.editor.create(document.getElementById('soqlEditor'), {
        value: `SELECT Id, 
Name FROM Account`,
        language: 'sql',
        theme: 'vs-dark'
    });

    // Initialize Result Editor (read-only)
    const resultEditor = monaco.editor.create(document.getElementById('resultEditor'), {
        value: ' {msg: "Query results will appear here as JSON"}',
        language: 'json',
        theme: 'vs-dark',
        
        readOnly: true,
        minimap: { enabled: false }
    });

    // Load saved config from localStorage
    const loadConfig = () => {
        document.getElementById('accessToken').value = localStorage.getItem('accessToken') || '';
        document.getElementById('instanceUrl').value = localStorage.getItem('instanceUrl') || '';
        soqlEditor.setValue(localStorage.getItem('query') || 'SELECT Id, Name FROM Account');

        document.getElementById('backendUrl').value = localStorage.getItem('backendUrl') || ' https://mc-sf-backend-c67d573c563d.herokuapp.com';
    };

    // Save config to localStorage on input change
    const saveConfig = () => {
        localStorage.setItem('accessToken', document.getElementById('accessToken').value);
        localStorage.setItem('instanceUrl', document.getElementById('instanceUrl').value);
        localStorage.setItem('query', soqlEditor.getValue());
        localStorage.setItem('backendUrl', document.getElementById('backendUrl').value);
    };

    // Get configuration
    const getConfig = () => ({
        accessToken: document.getElementById('accessToken').value,
        instanceUrl: document.getElementById('instanceUrl').value,
        backendUrl: document.getElementById('backendUrl').value,
        query: soqlEditor.getValue(),
        apiVersion: 'v60.0'
    });

    // Add input listeners to save config
    document.getElementById('accessToken').addEventListener('input', saveConfig);
    document.getElementById('instanceUrl').addEventListener('input', saveConfig);
    document.getElementById('backendUrl').addEventListener('input', saveConfig);

    // Load initial config
    loadConfig();

    // Fetch SObject fields for autocompletion
    async function fetchSObjectFields(sObjectName) {
        const config = getConfig();
        const tooling = document.getElementById('tooling').checked;

        try {
            const response = await fetch(`${config.backendUrl}/fetch_fields`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sobject_name: sObjectName,
                    access_token: config.accessToken,
                    instance_url: config.instanceUrl,
                    api_version: config.apiVersion,
                    tooling
                    
                })
            });
            const data = await response.json();
            return data.error ? [] : data.fields;
        } catch (error) {
            console.error(`Error fetching fields for ${sObjectName}:`, error);
            return [];
        }
    }

    // Query SOQL data
    async function queryData(soqlQuery) {
        const tooling = document.getElementById('tooling').checked;
        const config = getConfig();
        try {
            const response = await fetch(`${config.backendUrl}/query_data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    soql_query: soqlQuery,
                    access_token: config.accessToken,
                    instance_url: config.instanceUrl,
                    api_version: config.apiVersion,
                    tooling
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.result;
        } catch (error) {
            console.error('Error querying data:', error);
            return { error: error.message };
        }
    }
// Autocompletion for SOQL Editor
monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: [' ', ',', '\n', '.'], // Add newline and period for better support
    provideCompletionItems: async function(model, position) {
        // Get the content of the entire query up to the current position
        const lines = model.getLinesContent();
        let currentLine = lines[position.lineNumber - 1]; // current line content
        let fullQuery = lines.join(" "); // Join lines into a single string for full query

        // Match the 'FROM' clause in the full query (allowing for multi-line queries)
        const sObjectMatch = fullQuery.match(/FROM\s+(\w+)/i);
        
        if (!sObjectMatch) return { suggestions: [] };

        const sObjectName = sObjectMatch[1];
        
        // Fetch fields for the matched object
        const fields = await fetchSObjectFields(sObjectName);
        
        return {
            suggestions: fields.map(field => ({
                label: field,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: field,
                detail: `${field} (Field of ${sObjectName})`
            }))
        };
    }
});

    document.getElementById('show-in-datatable').addEventListener('click', function() {
        const result = JSON.parse(resultEditor.getValue());
        for (let i = 0; i < result.records.length; i++) {
            // delete attributes
            delete result.records[i].attributes;
        } 
        copyToClipboard(JSON.stringify( result.records));

    });

    let currentPage = 1;
    const rowsPerPage = 10; // Set number of rows per page
    let tableRows = []; // Store all rows for pagination



    function applyStriping() {
        const rows = document.querySelectorAll("#queryResultsTable tbody tr");
        rows.forEach((row, index) => {
            row.classList.toggle("bg-gray-100", index % 2 === 0);
            row.classList.toggle("bg-white", index % 2 !== 0);
        });
    }
    
    // Run Query Button
    document.getElementById('queryButton').addEventListener('click', async () => {
        const soqlQuery = soqlEditor.getValue();
        localStorage.setItem('query', soqlQuery);
        const result = await queryData(soqlQuery);
        // Update JSON Editor
        resultEditor.setValue(JSON.stringify(result, null, 2));
        document.getElementById('show-in-datatable').disabled = false; // Enable the button

        if (result.records && result.records.length > 0) {
            populateDataTable(result.records);
        }   applyStriping();
    });

    


    function populateDataTable(records) {
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');

        // Clear existing content
        tableHeader.innerHTML = '';
        tableBody.innerHTML = '';

        // Create table headers
        const headers = Object.keys(records[0]);
        // ignore attributes
        const index = headers.indexOf('attributes');
        if (index > -1) {
            headers.splice(index, 1);
        }
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tableHeader.appendChild(th);
        });

        // Create table rows
        records.forEach(record => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = record[header] || '';
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });

    }

         
});