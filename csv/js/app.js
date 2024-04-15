/* app.js

author: mohan chinnappan

*/

// Load SQL.js
window
  .initSqlJs({
    locateFile: (file) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`,
  })
  .then(function (SQL) {
    // Function to handle file upload
    function handleFileUploadCSV(event) {
      const file = event.target.files[0];
      Papa.parse(file, {
        complete: function (results) {
          const csvData = results.data;
          document.getElementById("csv-data").innerText = JSON.stringify(
            csvData,
            null,
            2
          );
          // Enable the executeQuery button after file upload
          document.getElementById("executeQuery").disabled = false;
        },
      });
    }

    // Function to handle file upload
    function handleFileUpload(event, callback) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result;
        callback(content);
      };
      reader.readAsText(file);
    }

    // Function to execute SQL query
    function executeQuery() {
      const csvData = JSON.parse(document.getElementById("csv-data").innerText);
      let columnNames = csvData[0].map((col) => col.replace(/\./g, "_")); // Replace '.' with '_'
      const sqlQuery = document.getElementById("sql-query").value;

      // Create database and run query
      const db = new SQL.Database();
      db.exec(
        "CREATE TABLE data (" +
          columnNames.map((col) => col + " TEXT").join(", ") +
          ")"
      );
      csvData.slice(1).forEach((row) => {
        const stmt = db.prepare(
          "INSERT INTO data VALUES (" + row.map((val) => "?").join(", ") + ")"
        );
        stmt.run(row);
        stmt.free();
      });

      const queryResult = db.exec(sqlQuery);
      if (queryResult.length > 0) {
        const resultSet = queryResult[0];
        const columns = resultSet.columns;
        const rows = resultSet.values;
        const html =
          '<table class="table table-bordered table-hover table-striped"><thead><tr>' +
          columns.map((col) => `<th>${col}</th>`).join("") +
          "</tr></thead><tbody>" +
          rows
            .map(
              (row) =>
                "<tr>" + row.map((val) => `<td>${val}</td>`).join("") + "</tr>"
            )
            .join("") +
          "</tbody></table>";
        document.getElementById("query-results").innerHTML = html;
        document.getElementById("exportCSV").disabled = false; // Enable export button
        document.getElementById("exportCSV").onclick = function () {
          exportCSVFile(columns, rows);
        };
      } else {
        document.getElementById("query-results").innerText = "No results";
      }
    }

    // Function to export query results as CSV
    function exportCSVFile2(columns, rows) {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += columns.join(",") + "\n";
      rows.forEach((row) => {
        csvContent += row.join(",") + "\n";
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "query_results.csv");
      document.body.appendChild(link);
      link.click();
    }
    // Function to export query results as CSV and copy to clipboard
    function exportCSVFile(columns, rows) {
      let csvContent = columns.join(",") + "\n";
      rows.forEach((row) => {
        csvContent += row.join(",") + "\n";
      });

      // Copy CSV content to clipboard
      navigator.clipboard
        .writeText(csvContent)
        .then(function () {
          console.log("CSV content copied to clipboard");
          // Open the specified URL after content is copied to clipboard
           window.open('https://mohan-chinnappan-n5.github.io/viz/datatable/dt.html?c=csv', '_blank');
        })
        .catch(function (err) {
          console.error("Failed to copy CSV content: ", err);
        });

      // Download CSV file
      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "query_results.csv");
      document.body.appendChild(link);
      link.click();

    }

    // Add event listener for file upload (CSV)
    document
      .getElementById("csv-file")
      .addEventListener("change", handleFileUploadCSV);

    // Add event listener for file upload (Query JSON)
    document
      .getElementById("query-file")
      .addEventListener("change", function (event) {
        handleFileUpload(event, function (data) {
          const queries = JSON.parse(data);
          const select = document.getElementById("query-select");
          select.innerHTML = "";
          queries.forEach((query) => {
            const option = document.createElement("option");
            option.value = query.query;
            option.textContent = query.label;
            select.appendChild(option);
          });
        });
      });

    // Add event listener for Execute Query button
    document
      .getElementById("executeQuery")
      .addEventListener("click", executeQuery);

    // Add event listener for query select
    document
      .getElementById("query-select")
      .addEventListener("change", function () {
        document.getElementById("sql-query").value = this.value;
      });
  });
