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
let queryHistory = new Set(JSON.parse(localStorage.getItem("queryHistory")) || []);
let editor; // Monaco Editor instance
let currentColumns = []; // Will be set based on selected tab
let workbook; // Store the parsed XLSX workbook

const defaultXlsxData = [
    { ID: "1", Name: "John Doe", Department: "Engineering", Salary: "75000", JoiningDate: "2020-01-15" },
    { ID: "2", Name: "Jane Smith", Department: "Marketing", Salary: "68000", JoiningDate: "2019-07-08" },
];

function addToQueryHistory(query) {
    if (!queryHistory.has(query)) {
        queryHistory.add(query);
        localStorage.setItem("queryHistory", JSON.stringify([...queryHistory]));
        updateQueryHistoryUI();
    }
}

function updateQueryHistoryUI() {
    const historyContainer = document.getElementById("queryHistoryContainer");
    historyContainer.innerHTML = "";
    const queries = [...queryHistory].reverse();
    queries.forEach(query => {
        const queryItem = document.createElement("div");
        queryItem.className = "p-2 hover:bg-gray-200 cursor-pointer border-b border-gray-300";
        queryItem.textContent = query;
        queryItem.title = "Click to rerun this query";
        queryItem.addEventListener("click", () => {
            editor.setValue(query);
            executeQuery(query);
        });
        historyContainer.appendChild(queryItem);
    });
}

function downloadQueries() {
    if (queryHistory.size === 0) {
        alert("No queries to download.");
        return;
    }
    const queries = [...queryHistory].reverse();
    const content = queries.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "query_history.txt";
    link.click();
}

function uploadQueries(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const queries = text.split("\n").map(q => q.trim()).filter(q => q);
        queries.forEach(query => queryHistory.add(query));
        localStorage.setItem("queryHistory", JSON.stringify([...queryHistory]));
        updateQueryHistoryUI();
    };
    reader.readAsText(file);
    event.target.value = "";
}

document.addEventListener("DOMContentLoaded", async () => {
    renderTable("xlsxTable", defaultXlsxData);
    await initializeSQLite(defaultXlsxData);

    // Initialize Monaco Editor
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('sqlQuery'), {
            value: "SELECT * FROM data WHERE Department = 'Engineering';",
            language: 'sql',
            theme: 'vs',
            automaticLayout: true,
            minimap: { enabled: false },
            suggestOnTriggerCharacters: true,
            tabCompletion: 'on',
            acceptSuggestionOnCommitCharacter: true,
            suggest: { showFields: true, showWords: true }
        });

        monaco.languages.registerCompletionItemProvider('sql', {
            provideCompletionItems: function (model, position) {
                const suggestions = currentColumns.map(col => ({
                    label: col,
                    kind: monaco.languages.CompletionItemKind.Field,
                    insertText: col,
                    detail: 'Column',
                }));
                return { suggestions };
            },
            triggerCharacters: ['\t']
        });
    });

    document.getElementById("runQueryButton").addEventListener("click", () => {
        const query = editor.getValue().trim();
        if (query) {
            showSpinner();
            executeQuery(query);
            addToQueryHistory(query);
            hideSpinner();
        }
    });

    document.getElementById("xlsxFileInput").addEventListener("change", event => {
        const file = event.target.files[0];
        if (file) {
            showSpinner();
            const reader = new FileReader();
            reader.onload = function (e) {
                workbook = XLSX.read(e.target.result, { type: 'binary' });
                populateTabSelect(workbook);
                hideSpinner();
            };
            reader.readAsBinaryString(file);
        }
    });

    document.getElementById("tabSelect").addEventListener("change", async (event) => {
        const sheetName = event.target.value;
        if (sheetName) {
            showSpinner();
            const data = sheetToArray(workbook.Sheets[sheetName]);
            renderTable("xlsxTable", data);
            await initializeSQLite(data);
            hideSpinner();
        }
    });

    document.getElementById("exportCsvButton").addEventListener("click", () => {
        exportToCsv("sqlTable");
    });

    document.getElementById("clearHistoryButton").addEventListener("click", () => {
        queryHistory.clear();
        localStorage.removeItem("queryHistory");
        updateQueryHistoryUI();
    });

    document.getElementById("downloadQueriesButton").addEventListener("click", downloadQueries);

    const uploadButton = document.getElementById("uploadQueriesButton");
    const fileInput = document.getElementById("queriesFileInput");
    uploadButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", uploadQueries);

    updateQueryHistoryUI();
});

function populateTabSelect(workbook) {
    const tabSelect = document.getElementById("tabSelect");
    tabSelect.innerHTML = "";
    workbook.SheetNames.forEach(sheetName => {
        const option = document.createElement("option");
        option.value = sheetName;
        option.textContent = sheetName;
        tabSelect.appendChild(option);
    });
    tabSelect.disabled = false;
    // Load the first tab by default
    if (workbook.SheetNames.length > 0) {
        const data = sheetToArray(workbook.Sheets[workbook.SheetNames[0]]);
        renderTable("xlsxTable", data);
        initializeSQLite(data);
    }
}

function sheetToArray(sheet) {
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: 'mm/dd/yyyy' });
    const headers = data[0];
    return data.slice(1).map(row => {
        const rowData = {};
        headers.forEach((header, index) => {
            let value = row[index];
            if (value !== undefined) {
                // If the value is a number and looks like an Excel date serial (e.g., 32474)
                if (typeof value === 'number' && value > 25569 && value < 2958465) { // Rough range for valid dates
                    value = XLSX.SSF.format('mm/dd/yyyy', value); // Convert serial to date string
                } else {
                    value = value.toString(); // Convert other values to string
                }
            } else {
                value = ""; // Handle undefined as empty string
            }
            rowData[header] = value;
        });
        return rowData;
    }).filter(row => Object.values(row).some(val => val !== ""));
}


async function initializeSQLite(data) {
    showSpinner();
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.7.0/sql-wasm.wasm`,
        });
        db = new SQL.Database();
        if (data.length === 0) return;
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
        hideSpinner();
    }
}

function executeQuery(query) {
    if (!db) {
        alert("Database not initialized. Upload an XLSX file and select a tab first.");
        hideSpinner();
        return;
    }
    try {
        const results = db.exec(query);
        if (results.length > 0) {
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
            alert("Query executed successfully, but no data returned.");
            renderTable("sqlTable", []);
            document.getElementById("exportCsvButton").disabled = true;
        }
    } catch (error) {
        alert("Error executing query: " + error.message);
    } finally {
        hideSpinner();
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

    const headerHtml = `<thead><tr>${columns.map(col => `<th>${col}</th>`).join("")}</tr></thead>`;
    const bodyHtml = `<tbody>${data.map(row => `<tr>${columns.map(col => `<td>${row[col] || ""}</td>`).join("")}</tr>`).join("")}</tbody>`;
    table.innerHTML = headerHtml + bodyHtml;

    $(`#${id}`).DataTable({
        paging: true,
        searching: true,
        ordering: true,
    });
}

function exportToCsv(tableId) {
    const table = $(`#${tableId}`).DataTable();
    const data = table.rows({ search: 'applied' }).data().toArray();
    const columns = table.columns().header().toArray().map(th => th.textContent.trim());

    const csvData = [columns.join(",")];
    data.forEach(row => {
        const rowData = row.map((value, index) => {
            const cellValue = value !== null && value !== undefined ? value.toString() : '';
            return `"${cellValue.replace(/"/g, '""')}"`;
        });
        csvData.push(rowData.join(","));
    });

    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export.csv";
    link.click();
}