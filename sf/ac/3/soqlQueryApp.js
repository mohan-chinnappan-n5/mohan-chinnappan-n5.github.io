// soqlQueryApp.js - Enhanced SOQL Editor with REST URL Support, REST Methods (GET, POST, PATCH, DELETE), Improved Error Handling, and SOQL Query Autocomplete
// Author: Mohan Chinnappan (Updated)

const queriesURL = 'https://raw.githubusercontent.com/mohan-chinnappan-n5/soql/main/commonQueries.json';
const MAX_LIMIT_Q = 200;

// Toggle password visibility
const togglePasswordBtn = document.getElementById('togglePassword');
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        const passwordInput = document.getElementById('accessToken');
        const isPasswordVisible = passwordInput.type === 'text';
        passwordInput.type = isPasswordVisible ? 'password' : 'text';
        togglePasswordBtn.innerHTML = isPasswordVisible
            ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>'
            : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>';
    });
}

// Show/hide info text on hover
const infoIcon = document.getElementById('info-icon');
const infoText = document.getElementById('info-text');

// Spinner and Overlay elements
const spinner = document.getElementById('spinner');
const overlay = document.getElementById('overlay');
const executionTime = document.getElementById('executionTime');

// Verify spinner and overlay elements exist
if (!spinner || !overlay) {
    console.error('Spinner or overlay element not found in the DOM.');
}

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

// Load common SOQL queries from JSON file synchronously on page load
let commonQueries = {};
async function loadCommonQueries2() {
    commonQueries = {
        "Accounts": `SELECT Id, Name, Industry, AnnualRevenue, Phone 
        FROM Account ORDER BY AnnualRevenue
         DESC NULLS LAST LIMIT 10`,

        "Contacts": `SELECT Id, Name, Email, Phone, Account.Name 
        FROM Contact 
        WHERE AccountId != NULL ORDER BY Name`,

        "Opportunities": `SELECT Id, Name, StageName, Amount, CloseDate, Account.Name 
            FROM Opportunity 
            WHERE IsClosed = FALSE ORDER BY CloseDate`,

        "Leads": `SELECT Id, Name, Email, Status, Company, LeadSource 
        FROM Lead WHERE Status != 'Closed - Converted' 
        ORDER BY CreatedDate DESC LIMIT 10`,

        "Cases": `SELECT Id, CaseNumber, Subject, Status, Priority, Contact.Name, Account.Name 
           FROM Case WHERE IsClosed = FALSE ORDER BY Priority`,

        "Users": `SELECT Id, Name, Email, Profile.Name, IsActive 
        FROM User ORDER BY Name`,

        "Campaigns": `SELECT Id, Name, Status, Type, StartDate, EndDate, NumberOfLeads, NumberOfContacts 
           FROM Campaign 
           WHERE IsActive = TRUE ORDER BY StartDate`,

        "Tasks": `SELECT Id, Subject, Status, Priority, Who.Name, What.Name, ActivityDate
           FROM Task 
           WHERE IsClosed = FALSE ORDER BY ActivityDate`,

        "Events": `SELECT Id, Subject, StartDateTime, EndDateTime, Who.Name, What.Name 
             FROM Event WHERE IsRecurrence = FALSE 
             ORDER BY StartDateTime`,

        "File Storage": `SELECT CreatedBy.Name, ContentDocumentId, ContentSize, ContentDocument.FileType
         FROM ContentVersion 
         ORDER BY ContentSize DESC`
    };
}

async function loadCommonQueries() {
    try {
        const response = await fetch(queriesURL, {
            mode: 'cors', // Explicitly set CORS mode
            cache: 'no-cache' // Ensure fresh fetch
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
        const result = await response.json();
        commonQueries = result['commonQueries'];
        console.log('Common queries loaded:', result['commonQueries']);
    } catch (error) {
        console.error('Error loading common queries:', error);
        showError('queryError', 'Failed to load common SOQL queries. Check the JSON file or network. Using default queries.');
        commonQueries = { // Fallback default queries
            "Accounts": "SELECT Id, Name FROM Account",
            "Contacts": "SELECT Id, Name, Email FROM Contact",
            "File Storage": "SELECT CreatedBy.Name, ContentDocumentId, ContentSize, ContentDocument.FileType FROM ContentVersion ORDER BY ContentSize DESC"
        };
    }
}

// Call loadCommonQueries immediately and wait for it before initializing Monaco
document.addEventListener('DOMContentLoaded', () => {
    loadCommonQueries().then(() => {
        require.config({
            paths: {
                'vs': 'https://unpkg.com/monaco-editor@0.34.0/min/vs'
            }
        });
        require(['vs/editor/editor.main'], function (monaco) {
            // Initialize Editors
            const soqlEditor = monaco.editor.create(document.getElementById('soqlEditor'), {
                value: `SELECT Id, Name FROM Account`,
                language: 'sql',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false },
                suggest: {
                    filterGraceful: true,
                    showIcons: true,
                    showStatusBar: true
                }
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
                document.getElementById('restUrl').value = localStorage.getItem('restUrl') || '/services/data/v60.0/sobjects/Account';
                document.getElementById('restMethod').value = localStorage.getItem('restMethod') || 'GET';
                soqlEditor.setValue(localStorage.getItem('query') || 'SELECT Id, Name FROM Account');
                document.getElementById('backendUrl').value = localStorage.getItem('backendUrl') || 'https://mc-sf-backend-c67d573c563d.herokuapp.com';
            };

            const saveConfig = () => {
                localStorage.setItem('accessToken', document.getElementById('accessToken').value);
                localStorage.setItem('instanceUrl', document.getElementById('instanceUrl').value);
                localStorage.setItem('restUrl', document.getElementById('restUrl').value);
                localStorage.setItem('restMethod', document.getElementById('restMethod').value);
                localStorage.setItem('query', soqlEditor.getValue());
                localStorage.setItem('backendUrl', document.getElementById('backendUrl').value);
            };

            const getConfig = () => ({
                accessToken: document.getElementById('accessToken').value,
                instanceUrl: document.getElementById('instanceUrl').value,
                restUrl: document.getElementById('restUrl').value,
                restMethod: document.getElementById('restMethod').value,
                backendUrl: document.getElementById('backendUrl').value,
                query: soqlEditor.getValue(),
                apiVersion: 'v60.0'
            });

            // Add input listeners to save config
            document.querySelectorAll('#accessToken, #instanceUrl, #restUrl, #restMethod, #backendUrl').forEach(input => {
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

            // Helper function to ensure spinner is visible for at least a minimum time
            async function withMinimumSpinnerTime(promise) {
                const MINIMUM_SPINNER_TIME = 500; // 500ms minimum display time
                const startTime = Date.now();
                try {
                    const result = await promise;
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = MINIMUM_SPINNER_TIME - elapsedTime;
                    if (remainingTime > 0) {
                        await new Promise(resolve => setTimeout(resolve, remainingTime));
                    }
                    return result;
                } finally {
                    spinner.style.display = 'none';
                    overlay.style.display = 'none';
                    showLoading('fieldsLoading', false);
                    showLoading('queryLoading', false);
                }
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

                // Show spinner and overlay
                spinner.style.display = 'block';
                overlay.style.display = 'block';
                showLoading('fieldsLoading', true);

                return withMinimumSpinnerTime((async () => {
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
                            const errorText = await response.text();
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
                    }
                })());
            }

            // Query SOQL data or execute REST request (GET, POST, PATCH, DELETE)
            async function queryData(soqlQuery) {
                const config = getConfig();
                const tooling = document.getElementById('tooling').checked;
                const explainPlan = document.getElementById('explainPlan').checked; // Check if Explain Plan is enabled

                if (!config.accessToken || !config.instanceUrl || (!config.restUrl && !soqlQuery.trim())) {
                    showError('accessTokenError', 'Access Token, Instance URL, and SOQL Query (or REST URL) are required.');
                    showError('queryError', 'Please enter a valid SOQL query or REST URL.');
                    return { error: 'Missing required configuration or query' };
                }

                if (!validateRestUrl(config.restUrl)) return { error: 'Invalid REST URL format' };

                // For GET requests, validate SOQL query if no custom URL
                if (config.restMethod === 'GET' && !config.restUrl && !validateSoqlQuery(soqlQuery)) {
                    return { error: 'Invalid SOQL query format' };
                }

                // For non-GET requests, validate JSON payload
                let body = null;
                if (config.restMethod !== 'GET') {
                    try {
                        body = JSON.stringify(JSON.parse(soqlQuery));
                    } catch (e) {
                        showError('queryError', 'Invalid JSON payload for REST request.');
                        return { error: 'Invalid JSON payload' };
                    }
                }

                // Show spinner and overlay
                spinner.style.display = 'block';
                overlay.style.display = 'block';
                showLoading('queryLoading', true);

                // Start measuring execution time
                const startTime = performance.now();

                return withMinimumSpinnerTime((async () => {
                    try {
                        let url;
                        if (config.restUrl) {
                            url = `${config.instanceUrl}${config.restUrl}`;
                        } else {
                            // Base query URL
                            let queryPath = `/services/data/${config.apiVersion}/query`;
                            if (tooling) {
                                queryPath = `/services/data/${config.apiVersion}/tooling/query`;
                            }
                            // Append ?explain= if Explain Plan is checked, otherwise use regular query
                            if (explainPlan) {
                                url = `${config.instanceUrl}${queryPath}?explain=${encodeURIComponent(soqlQuery)}`;
                            } else {
                                url = `${config.instanceUrl}${queryPath}?q=${encodeURIComponent(soqlQuery)}`;
                            }
                        }

                        const response = await fetch(`${config.backendUrl}/query_data`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                soql_query: config.restMethod === 'GET' ? soqlQuery : null,
                                access_token: config.accessToken,
                                instance_url: config.instanceUrl,
                                api_version: config.apiVersion,
                                tooling,
                                custom_url: config.restUrl || null,
                                method: config.restMethod,
                                payload: body,
                                explain: explainPlan // Pass the explain flag to the backend
                            })
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            let errorMsg = `HTTP error! status: ${response.status}, message: ${response.statusText}`;
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
                    }
                })()).then(result => {
                    // Calculate and display execution time after the promise resolves
                    const endTime = performance.now();
                    const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
                    executionTime.textContent = `Time: ${timeTaken.toFixed(1)}s`;
                    executionTime.classList.remove('hidden');
                    setTimeout(() => executionTime.classList.add('hidden'), 5000); // Hide after 5 seconds
                    return result;
                });
            }

            // Autocompletion for SOQL Editor with common queries
            monaco.languages.registerCompletionItemProvider('sql', {
                triggerCharacters: [' ', ',', '\n', '.', 'S', 'F', 'A', 'C'],
                provideCompletionItems: async function (model, position) {
                    const lines = model.getLinesContent();
                    let currentLine = lines[position.lineNumber - 1];
                    let fullQuery = lines.join(' ');

                    const suggestions = [];
                    const prefix = model.getValueInRange({
                        startLineNumber: position.lineNumber,
                        startColumn: 1,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    }).toLowerCase();

                    Object.entries(commonQueries).forEach(([queryName, query]) => {
                        if (queryName.toLowerCase().includes(prefix) || query.toLowerCase().includes(prefix)) {
                            let formattedQuery = query.replace(/\sFROM\s/i, '\nFROM ').replace(/\sWHERE\s/i, '\nWHERE ');
                            suggestions.push({
                                label: queryName,
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: formattedQuery,
                                detail: `Common SOQL Query: ${query}`,
                                documentation: {
                                    value: `Inserts the predefined SOQL query for ${formattedQuery}.`
                                },
                                range: {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: position.column,
                                    endColumn: position.column
                                }
                            });
                        }
                    });

                    const sObjectMatch = fullQuery.match(/FROM\s+(\w+)/i);
                    if (sObjectMatch) {
                        const sObjectName = sObjectMatch[1];
                        const fields = await fetchSObjectFields(sObjectName);
                        fields.forEach(field => {
                            suggestions.push({
                                label: field,
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: field,
                                detail: `${field} (Field of ${sObjectName})`,
                                range: {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: position.column,
                                    endColumn: position.column
                                }
                            });
                        });
                    }

                    return {
                        suggestions: suggestions.slice(0, MAX_LIMIT_Q)
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

                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';

                if (!records || records.length === 0) {
                    table.classList.add('hidden');
                    document.getElementById('tableStatus').textContent = 'No results available. Run a query to display data.';
                    return;
                }

                table.classList.remove('hidden');
                document.getElementById('tableStatus').textContent = '';

                const headers = Object.keys(records[0]).filter(key => key !== 'attributes');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    th.className = 'p-2 text-left';
                    tableHeader.appendChild(th);
                });

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
                saveConfig();
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
    }).catch(error => {
        console.error('Error initializing Monaco Editor:', error);
        showError('queryError', 'Failed to initialize the editor. Check console for details.');
    });
});