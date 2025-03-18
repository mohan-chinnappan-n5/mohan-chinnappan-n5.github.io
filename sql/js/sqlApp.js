// sqlApp.js
// mohan chinnappan
// --------------

function showSpinner() {
    document.getElementById("spinner").classList.remove("hidden");
}
function hideSpinner() {
    document.getElementById("spinner").classList.add("hidden");
}

let db; // SQLite database instance
let queryHistory = new Set(JSON.parse(localStorage.getItem("queryHistory")) || []); // Load from localStorage or initialize empty

function addToQueryHistory(query) {
    if (!queryHistory.has(query)) {
        queryHistory.add(query);
        localStorage.setItem("queryHistory", JSON.stringify([...queryHistory])); // Save to localStorage
        updateQueryHistoryUI();

    }
}
function updateQueryHistoryUI() {
    const historyContainer = document.getElementById("queryHistoryContainer");
    historyContainer.innerHTML = ""; // Clear existing content
    queryHistory.forEach(query => {
        const queryItem = document.createElement("div");
        queryItem.className = "p-2 hover:bg-gray-200 cursor-pointer border-b border-gray-300";
        queryItem.textContent = query;
        queryItem.title = "Click to rerun this query";
        queryItem.addEventListener("click", () => {
	    editor.setValue(query); // Set value in Monaco Editor
            executeQuery(query); // Rerun the query
        });
        historyContainer.appendChild(queryItem);
    });
}



const defaultCsvData = [
    { ID: "1", Name: "John Doe", Department: "Engineering", Salary: "75000", JoiningDate: "2020-01-15" },
    { ID: "2", Name: "Jane Smith", Department: "Marketing", Salary: "68000", JoiningDate: "2019-07-08" },
    { ID: "3", Name: "Bob Johnson", Department: "Sales", Salary: "72000", JoiningDate: "2021-03-22" },
    { ID: "4", Name: "Emily Davis", Department: "Engineering", Salary: "80000", JoiningDate: "2018-05-14" },
    { ID: "5", Name: "Michael Brown", Department: "HR", Salary: "60000", JoiningDate: "2022-06-01" },
    { ID: "6", Name: "Mohan Chinnappan", Department: "Engineering", Salary: "60000", JoiningDate: "2022-06-01" },
];
let editor; // Monaco Editor instance
let currentColumns = Object.keys(defaultCsvData[0]); // Default columns from initial data


document.addEventListener("DOMContentLoaded", async () => {
    renderTable("csvTable", defaultCsvData);
    await initializeSQLite(defaultCsvData);


    // Initialize Monaco Editor
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('sqlQuery'), {
            value: "SELECT * FROM data WHERE Department = 'Engineering';",
            language: 'sql',
            theme: 'vs', // Optional: change to 'vs' for light theme
            automaticLayout: true,
            minimap: { enabled: false },
            suggestOnTriggerCharacters: true,
        });

        // Register autocompletion provider
        monaco.languages.registerCompletionItemProvider('sql', {
            provideCompletionItems: function (model, position) {
                const suggestions = currentColumns.map(col => ({
                    label: col,
                    kind: monaco.languages.CompletionItemKind.Field,
                    insertText: col,
                    detail: 'Column',
                }));
                return { suggestions };
            }
        });
    });

    document.getElementById("runQueryButton").addEventListener("click", () => {
	const query = editor.getValue().trim();
	if (query) { // Check if query is non-empty
	    showSpinner(); // Show spinner before executing query
            executeQuery(query);
            addToQueryHistory(query);
	    hideSpinner(); // Hide spinner after execution

        }
    });

    document.getElementById("csvFileInput").addEventListener("change", event => {
        const file = event.target.files[0];
	showSpinner(); // Show spinner before CSV processing
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async function (results) {
                    const data = results.data;
                    renderTable("csvTable", data);
                    await initializeSQLite(data);
                    hideSpinner(); // Hide spinner after CSV is loaded

                },
            });
        }
    });

    document.getElementById("exportCsvButton").addEventListener("click", () => {
        exportToCsv("sqlTable");
    });
    updateQueryHistoryUI()
});

async function initializeSQLite(data) {
    showSpinner(); // Show spinner at the start
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.7.0/sql-wasm.wasm`,
        });
        db = new SQL.Database();
        const columns = Object.keys(data[0]);
        currentColumns = columns;
        const createTableQuery = `CREATE TABLE data (${columns.map(col => `"${col}" TEXT`).join(", ")});`;
        db.exec(createTableQuery);

        const insertQuery = `INSERT INTO data VALUES (${columns.map(() => "?").join(", ")});`;
        const stmt = db.prepare(insertQuery);
        data.forEach(row => {
            stmt.bind(columns.map(col => row[col]));
            stmt.step();
            stmt.reset();
        });
        stmt.free();
    } finally {
        hideSpinner(); // Hide spinner when done
    }
}

function executeQuery(query) {
    if (!db) {
        alert("Database not initialized. Upload a CSV file first.");
        hideSpinner(); // Ensure spinner is hidden if db is not ready
        return;
    }
    try {
        const results = db.exec(query); // Use exec for broader query support
        if (results.length > 0) {
            // Query returned results (e.g., SELECT)
            const columns = results[0].columns;
            const data = results[0].values.map(row => {
                const rowData = {};
                columns.forEach((col, index) => {
                    rowData[col] = row[index];
                });
                return rowData;
            });
            renderTable("sqlTable", data, columns);
            document.getElementById("exportCsvButton").disabled = false;
        } else {
            // No results (e.g., INSERT, UPDATE, DELETE, or empty SELECT)
            alert("Query executed successfully, but no data returned.");
            renderTable("sqlTable", []); // Clear table
            document.getElementById("exportCsvButton").disabled = true;
        }
    } catch (error) {
        alert("Error executing query: " + error.message);
    }
    finally {
        hideSpinner(); // Ensure spinner is hidden after query execution
    }
}


function renderTable(id, data, columns) {
    const container = document.getElementById(`${id}Container`);
    const table = document.getElementById(id);
    if ($.fn.DataTable.isDataTable(table)) {
        $(table).DataTable().destroy();
    }
    $(table).empty();

    if (data.length === 0) {
        container.innerHTML = `<p>No data available.</p>`;
        return;
    }
    columns = columns || Object.keys(data[0]);

    // Populate table headers and rows
    const headerHtml = `<thead><tr>${columns.map(col => `<th>${col}</th>`).join("")}</tr></thead>`;
    const bodyHtml = `<tbody>${data.map(row => `<tr>${columns.map(col => `<td>${row[col] || ""}</td>`).join("")}</tr>`).join("")}</tbody>`;
    table.innerHTML = headerHtml + bodyHtml;

    // Initialize DataTables
    $(`#${id}`).DataTable({
        paging: true,
        searching: true,
        ordering: true,
    });
}
// Replace the existing exportToCsv function with this updated version
function exportToCsv(tableId) {
    const table = $(`#${tableId}`).DataTable(); // Get the DataTable instance
    const data = table.rows({ search: 'applied' }).data().toArray(); // Get all filtered data across all pages
    const columns = table.columns().header().toArray().map(th => th.textContent.trim()); // Get column headers

    // Prepare CSV data
    const csvData = [];
    
    // Add headers
    csvData.push(columns.join(","));

    // Add rows
    data.forEach(row => {
        // DataTables returns row data as an array, not an object, so use indices instead of column names
        const rowData = row.map((value, index) => {
            const cellValue = value !== null && value !== undefined ? value.toString() : ''; // Handle null/undefined
            return `"${cellValue.replace(/"/g, '""')}"`; // Escape quotes and wrap in quotes
        });
        csvData.push(rowData.join(","));
    });

    // Generate and download CSV
    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export.csv";
    link.click();
}

