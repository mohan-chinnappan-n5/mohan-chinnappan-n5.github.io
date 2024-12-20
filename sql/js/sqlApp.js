let db; // SQLite database instance
const defaultCsvData = [
    { ID: "1", Name: "John Doe", Department: "Engineering", Salary: "75000", JoiningDate: "2020-01-15" },
    { ID: "2", Name: "Jane Smith", Department: "Marketing", Salary: "68000", JoiningDate: "2019-07-08" },
    { ID: "3", Name: "Bob Johnson", Department: "Sales", Salary: "72000", JoiningDate: "2021-03-22" },
    { ID: "4", Name: "Emily Davis", Department: "Engineering", Salary: "80000", JoiningDate: "2018-05-14" },
    { ID: "5", Name: "Michael Brown", Department: "HR", Salary: "60000", JoiningDate: "2022-06-01" },
    { ID: "6", Name: "Mohan Chinnappan", Department: "Engineering", Salary: "60000", JoiningDate: "2022-06-01" },
];

document.addEventListener("DOMContentLoaded", async () => {
    renderTable("csvTable", defaultCsvData);
    await initializeSQLite(defaultCsvData);

    document.getElementById("runQueryButton").addEventListener("click", () => {
        const query = document.getElementById("sqlQuery").value;
        executeQuery(query);
    });

    document.getElementById("csvFileInput").addEventListener("change", event => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async function (results) {
                    const data = results.data;
                    renderTable("csvTable", data);
                    await initializeSQLite(data);
                },
            });
        }
    });
});

async function initializeSQLite(data) {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.7.0/sql-wasm.wasm`,
    });
    db = new SQL.Database(); // Initialize SQLite database
    const columns = Object.keys(data[0]);
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
}

function executeQuery(query) {
    if (!db) {
        alert("Database not initialized. Upload a CSV file first.");
        return;
    }
    try {
        const stmt = db.prepare(query);
        const columns = stmt.getColumnNames();
        const data = [];
        while (stmt.step()) {
            const row = {};
            stmt.get().forEach((value, index) => {
                row[columns[index]] = value;
            });
            data.push(row);
        }
        stmt.free();
        renderTable("sqlTable", data, columns);
    } catch (error) {
        alert("Error executing query: " + error.message);
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