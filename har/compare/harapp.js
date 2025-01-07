// harapp.js
// mohan chinnappan
// ----------

// Initialize DataTable
$(document).ready(function () {
    $('#comparisonTable').DataTable();
  });
  
  // Function to parse HAR files
  function parseHAR(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const harData = JSON.parse(event.target.result);
          resolve(harData.log.entries);
        } catch (error) {
          reject('Invalid HAR file');
        }
      };
      reader.onerror = () => reject('Failed to read file');
      reader.readAsText(file);
    });
  }
  
  // Compare HAR files
  async function compareHARFiles() {
    const har1File = document.getElementById('har1').files[0];
    const har2File = document.getElementById('har2').files[0];
  
    if (!har1File || !har2File) {
      alert('Please upload both HAR files');
      return;
    }
  
    try {
      const [har1Entries, har2Entries] = await Promise.all([
        parseHAR(har1File),
        parseHAR(har2File),
      ]);
  
      const comparisonData = har1Entries.map((entry1) => {
        const entry2 = har2Entries.find(
          (e) => e.request.url === entry1.request.url
        );
  
        const time1 = entry1.time || 0;
        const time2 = entry2 ? entry2.time || 0 : 0;
  
        return {
          url: entry1.request.url,
          method: entry1.request.method,
          httpVersion: entry1.response.httpVersion,
          status: entry1.response.status,
          bodySize: entry1.response.bodySize,
          
          time1: time1.toFixed(2),
          time2: time2.toFixed(2),
          diff: (time1 - time2).toFixed(2),
        };
      });
  
      // Update DataTable
      const table = $('#comparisonTable').DataTable();
      table.clear();
  
      comparisonData.forEach((row) => {
        table.row.add([
          row.url,
          row.method,
          row.httpVersion,
          row.status,
          row.bodySize,
          row.time1,
          row.time2,
          row.diff,
        ]);
      });
  
      table.draw();
      document.getElementById('exportCsvBtn').style.display = 'block';
    } catch (error) {
      alert(error);
    }
  }
  
  // Attach event listener to compare button
  document.getElementById('compareButton').addEventListener('click', compareHARFiles);
  
// Function to export DataTable as CSV
function exportToCSV() {
    const table = $('#comparisonTable').DataTable();
    const data = table.rows().data();
    const csvRows = [];
  
    // Add headers
    const headers = table.columns().header().toArray().map(header => header.textContent.trim());
    csvRows.push(headers.join(','));
  
    // Add data rows
    data.each(function(row) {
      const rowData = row.map(cell => `"${cell}"`).join(',');
      csvRows.push(rowData);
    });
  
    // Create CSV Blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'comparison_results.csv';
    link.click();
  }
  
  // Attach event listener to export button
  document.getElementById('exportCsvBtn').addEventListener('click', exportToCSV);