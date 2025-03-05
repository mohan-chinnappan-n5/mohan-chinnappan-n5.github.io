// soqlQueryApp.js - Enhanced SOQL Editor with REST URL Support, REST/Tooling API, and Improved Error Handling
// Author: Mohan Chinnappan (Updated)


// Show/hide info text on hover
const infoIcon = document.getElementById('info-icon');
const infoText = document.getElementById('info-text');

infoIcon.addEventListener('mouseover', () => {
    infoText.classList.remove('hidden');
});

infoIcon.addEventListener('mouseleave', () => {
    infoText.classList.add('hidden');
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log("Text copied to clipboard successfully!");
        window.open("https://mohan-chinnappan-n5.github.io/viz/datatable/dt.html?c", "_blank");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
        showError('copyError', 'Failed to copy to clipboard. Please check permissions.');
    });
}

require.config({
    paths: {
        'vs': 'https://unpkg.com/monaco-editor@0.34.0/min/vs'
    }
});

require(['vs/editor/editor.main'], function (monaco, $) {
    // Initialize Editors
    const soqlEditor = monaco.editor.create(document.getElementById('soqlEditor'), {
        value: `SELECT Id, Name FROM Account`,
        language: 'sql',
        theme: 'vs-dark',
            // Disable outline by making focus border invisible
        automaticLayout: true,
        minimap: { enabled: false },

    });

    const resultEditor = monaco.editor.create(document.getElementById('resultEditor'), {
        value: '{ "msg": "Query results will appear here as JSON" }',
        language: 'json',
        theme: 'vs-dark',
        readOnly: true,
        automaticLayout: true,
        minimap: { enabled: false }
    });

    // Load and save config to/from localStorage
    const loadConfig = () => {
        document.getElementById('accessToken').value = localStorage.getItem('accessToken') || '';
        document.getElementById('instanceUrl').value = localStorage.getItem('instanceUrl') || '';
        document.getElementById('restUrl').value = localStorage.getItem('restUrl') || '';
        soqlEditor.setValue(localStorage.getItem('query') || 'SELECT Id, Name FROM Account');
        document.getElementById('backendUrl').value = localStorage.getItem('backendUrl') || 'https://mc-sf-backend-c67d573c563d.herokuapp.com';
    };

    const saveConfig = () => {
        localStorage.setItem('accessToken', document.getElementById('accessToken').value);
        localStorage.setItem('instanceUrl', document.getElementById('instanceUrl').value);
        localStorage.setItem('restUrl', document.getElementById('restUrl').value);
        localStorage.setItem('query', soqlEditor.getValue());
        localStorage.setItem('backendUrl', document.getElementById('backendUrl').value);
    };

    // Get configuration
    const getConfig = () => ({
        accessToken: document.getElementById('accessToken').value,
        instanceUrl: document.getElementById('instanceUrl').value,
        restUrl: document.getElementById('restUrl').value,
        backendUrl: document.getElementById('backendUrl').value,
        query: soqlEditor.getValue(),
        apiVersion: 'v60.0'
    });

    // Add input listeners to save config
    document.querySelectorAll('#accessToken, #instanceUrl, #restUrl, #backendUrl').forEach(input => {
        input.addEventListener('input', saveConfig);
    });

    // Load initial config
    loadConfig();

    // Show/hide error messages
    function showError(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => errorElement.style.display = 'none', 10000); // Increased to 10 seconds for visibility
    }

    function showLoading(id, show) {
        const loadingElement = document.getElementById(id) || document.createElement('div');
        if (!loadingElement.id) {
            loadingElement.id = id;
            loadingElement.className = 'loading';
            document.querySelector('.editor-container').appendChild(loadingElement);
        }
        loadingElement.style.display = show ? 'block' : 'none';
    }

    // Validate REST URL
    function validateRestUrl(restUrl) {
        if (!restUrl) return true; // Empty is valid (use default)
        const isValid = restUrl.startsWith('/services/data/') || restUrl.startsWith('/services/tooling/');
        if (!isValid) {
            showError('restUrlError', 'REST URL must start with /services/data/ or /services/tooling/.');
        }
        return isValid;
    }

    // Validate SOQL Query
    function validateSoqlQuery(query) {
        if (!query.trim()) {
            showError('queryError', 'Please enter a valid SOQL query.');
            return false;
        }
        // Basic SOQL syntax check (simplified)
        const soqlPattern = /^\s*SELECT\s+.*\s+FROM\s+\w+/i;
        if (!soqlPattern.test(query)) {
            showError('queryError', 'Invalid SOQL query format. Ensure it starts with SELECT and includes FROM.');
            return false;
        }
        return true;
    }

    // Fetch SObject fields for autocompletion (REST and Tooling API support)
    async function fetchSObjectFields(sObjectName) {
        const config = getConfig();
        const tooling = document.getElementById('tooling').checked;

        if (!config.accessToken || !config.instanceUrl) {
            showError('accessTokenError', 'Access Token and Instance URL are required to fetch fields.');
            return [];
        }

        if (!validateRestUrl(config.restUrl)) return [];

        showLoading('fieldsLoading', true);
        try {
            // Use REST URL if provided, otherwise construct default
            let url = config.restUrl ? `${config.instanceUrl}${config.restUrl}` :
                `${config.instanceUrl}/services/data/${config.apiVersion}/sobjects/${sObjectName}/describe`;
            if (tooling && !config.restUrl) {
                url = `${config.instanceUrl}/services/data/${config.apiVersion}/tooling/sobjects/${sObjectName}/describe`;
            }

            const response = await fetch(`${config.backendUrl}/fetch_fields`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sobject_name: sObjectName,
                    access_token: config.accessToken,
                    instance_url: config.instanceUrl,
                    api_version: config.apiVersion,
                    tooling,
                    custom_url: config.restUrl || null
                })
            });
            if (!response.ok) {
                const errorText = await response.text(); // Get raw response text for detailed error
                let errorMsg = `HTTP error! status: ${response.status}, message: ${response.statusText}`;
                if (errorText) {
                    try {
                        const errorData = JSON.parse(errorText);
                        if (errorData.error && errorData.error.includes('INVALID_FIELD')) {
                            errorMsg = `Invalid field for object '${sObjectName}': Check field names in your Salesforce org. Ensure the object and fields exist and are accessible.`;
                        } else if (errorData.message) {
                            errorMsg = `Failed to fetch fields: ${errorData.message}`;
                        }
                    } catch (parseError) {
                        errorMsg += ` - Raw response: ${errorText}`;
                    }
                }
                throw new Error(errorMsg);
            }
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.fields || [];
        } catch (error) {
            console.error(`Error fetching fields for ${sObjectName}:`, error);
            let errorMsg = `Failed to fetch fields: ${error.message}`;
            if (error.message.includes('INVALID_FIELD')) {
                errorMsg = `Invalid field for object '${sObjectName}': Check field names in your Salesforce org. Ensure the object and fields exist and are accessible.`;
            } else if (error.message.includes('500') || error.message.includes('INTERNAL SERVER ERROR')) {
                errorMsg = `Internal Server Error: Contact administrator or check Salesforce API logs for details. Raw error: ${error.message}`;
            }
            showError('queryError', errorMsg);
            return [];
        } finally {
            showLoading('fieldsLoading', false);
        }
    }

    // Query SOQL data (REST and Tooling API support)
    async function queryData(soqlQuery) {
        const config = getConfig();
        const tooling = document.getElementById('tooling').checked;

        if (!config.accessToken || !config.instanceUrl || (!config.restUrl && !soqlQuery.trim())) {
            showError('accessTokenError', 'Access Token, Instance URL, and SOQL Query (or REST URL) are required.');
            showError('queryError', 'Please enter a valid SOQL query or REST URL.');
            return { error: 'Missing required configuration or query' };
        }

        if (!validateRestUrl(config.restUrl)) return { error: 'Invalid REST URL format' };
        if (!validateSoqlQuery(soqlQuery) && !config.restUrl) return { error: 'Invalid SOQL query format' };

        showLoading('queryLoading', true);
        try {
            // Use REST URL if provided, otherwise construct default SOQL query
            let url = config.restUrl ? `${config.instanceUrl}${config.restUrl}` :
                `${config.instanceUrl}/services/data/${config.apiVersion}/query?q=${encodeURIComponent(soqlQuery)}`;
            if (tooling && !config.restUrl) {
                url = `${config.instanceUrl}/services/data/${config.apiVersion}/tooling/query?q=${encodeURIComponent(soqlQuery)}`;
            }

            const response = await fetch(`${config.backendUrl}/query_data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    soql_query: soqlQuery,
                    access_token: config.accessToken,
                    instance_url: config.instanceUrl,
                    api_version: config.apiVersion,
                    tooling,
                    custom_url: config.restUrl || null
                })
            });
            if (!response.ok) {
                const errorText = await response.text(); // Get raw response text for detailed error
                let errorMsg = `HTTP error! status: ${response.status}, message: ${response.statusText}`;
                if (errorText) {
                    try {
                        const errorData = JSON.parse(errorText);
                        if (errorData.error && errorData.error.includes('INVALID_FIELD')) {
                            errorMsg = `Invalid field in query: Check fields like 'CleanStatus' or 'AnnualRevenue' in your Salesforce org. Ensure they exist and are accessible.`;
                        } else if (errorData.message) {
                            errorMsg = `Query failed: ${errorData.message}`;
                        }
                    } catch (parseError) {
                        errorMsg += ` - Raw response: ${errorText}`;
                    }
                }
                throw new Error(errorMsg);
            }
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.result || { error: 'No results returned' };
        } catch (error) {
            console.error('Error querying data:', error);
            let errorMsg = `Query failed: ${error.message}`;
            if (error.message.includes('INVALID_FIELD')) {
                errorMsg = `Invalid field in query: Check fields like 'CleanStatus' or 'AnnualRevenue' in your Salesforce org. Ensure they exist and are accessible.`;
            } else if (error.message.includes('500') || error.message.includes('INTERNAL SERVER ERROR')) {
                errorMsg = `Internal Server Error: Contact administrator or check Salesforce API logs for details. Raw error: ${error.message}`;
            }
            showError('resultError', errorMsg);
            return { error: errorMsg };
        } finally {
            showLoading('queryLoading', false);
        }
    }

    // Autocompletion for SOQL Editor
    monaco.languages.registerCompletionItemProvider('sql', {
        triggerCharacters: [' ', ',', '\n', '.'],
        provideCompletionItems: async function (model, position) {
            const lines = model.getLinesContent();
            let currentLine = lines[position.lineNumber - 1];
            let fullQuery = lines.join(' ');

            const sObjectMatch = fullQuery.match(/FROM\s+(\w+)/i);
            if (!sObjectMatch) return { suggestions: [] };

            const sObjectName = sObjectMatch[1];
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

    // Handle "Show in Datatable" button
    document.getElementById('show-in-datatable').addEventListener('click', function () {
        try {
            const result = JSON.parse(resultEditor.getValue());
            if (result.records && result.records.length > 0) {
                const cleanRecords = result.records.map(record => {
                    delete record.attributes;
                    return record;
                });
                copyToClipboard(JSON.stringify(cleanRecords));
                document.getElementById('datatableError').style.display = 'none';
            } else {
                showError('datatableError', 'No valid records to display in datatable.');
            }
        } catch (error) {
            showError('datatableError', 'Invalid JSON in results or no records available.');
        }
    });

    // Populate DataTable
    function populateDataTable(records) {
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');
        const table = document.getElementById('queryResultsTable');

        // Clear existing content
        tableHeader.innerHTML = '';
        tableBody.innerHTML = '';

        if (!records || records.length === 0) {
            table.classList.add('hidden');
            document.getElementById('tableStatus').textContent = 'No results available. Run a query to display data.';
            return;
        }

        table.classList.remove('hidden');
        document.getElementById('tableStatus').textContent = '';

        // Create table headers (excluding attributes)
        const headers = Object.keys(records[0]).filter(key => key !== 'attributes');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.className = 'p-2 text-left';
            tableHeader.appendChild(th);
        });

        // Create table rows
        records.forEach(record => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = record[header] || '';
                cell.className = 'p-2';
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });

        // Apply striping
        applyStriping();
    }

    function applyStriping() {
        const rows = document.querySelectorAll("#queryResultsTable tbody tr");
        rows.forEach((row, index) => {
            row.classList.toggle("bg-gray-100", index % 2 === 0);
            row.classList.toggle("bg-white", index % 2 !== 0);
        });
    }

    // Run Query Button
    document.getElementById('queryButton').addEventListener('click', async () => {
        const soqlQuery = soqlEditor.getValue().trim();
        saveConfig(); // Save query before running
        const result = await queryData(soqlQuery);

        if (result.error) {
            showError('resultError', result.error);
            resultEditor.setValue(JSON.stringify({ error: result.error }, null, 2));
            document.getElementById('show-in-datatable').disabled = true;
            populateDataTable([]);
        } else {
            resultEditor.setValue(JSON.stringify(result, null, 2));
            document.getElementById('show-in-datatable').disabled = false;
            populateDataTable(result.records || []);
        }
    });


    
});