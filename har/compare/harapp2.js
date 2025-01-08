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
  
// Function to compare HAR files
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
  
        const server1 = entry1.response.headers.find((h) => h.name.toLowerCase() === 'server')?.value || 'N/A';
        const server2 = entry2?.response.headers.find((h) => h.name.toLowerCase() === 'server')?.value || 'N/A';
  
        const requestId1 = entry1.response.headers.find((h) => h.name.toLowerCase() === 'x-sfdc-request-id')?.value || 'N/A';
        const requestId2 = entry2?.response.headers.find((h) => h.name.toLowerCase() === 'x-sfdc-request-id')?.value || 'N/A';
  
        // Extract timings for HAR 1
        const timings1 = entry1.timings || {};
        const blocked1 = timings1.blocked || 0;
        const dns1 = timings1.dns || 0;
        const ssl1 = timings1.ssl || 0;
        const connect1 = timings1.connect || 0;
        const send1 = timings1.send || 0;
        const wait1 = timings1.wait || 0;
        const receive1 = timings1.receive || 0;
        const blockedQueueing1 = timings1._blocked_queueing || 0;
  
        // Extract timings for HAR 2
        const timings2 = entry2 ? entry2.timings || {} : {};
        const blocked2 = timings2.blocked || 0;
        const dns2 = timings2.dns || 0;
        const ssl2 = timings2.ssl || 0;
        const connect2 = timings2.connect || 0;
        const send2 = timings2.send || 0;
        const wait2 = timings2.wait || 0;
        const receive2 = timings2.receive || 0;
        const blockedQueueing2 = timings2._blocked_queueing || 0;
  
        return {
          url: entry1.request.url,
          method: entry1.request.method,
          httpVersion: entry1.response.httpVersion,
          status: entry1.response.status,
          bodySize: entry1.response.bodySize,
  
          // HAR 1
          server1,
          requestId1,
          time1: time1.toFixed(2),
          blocked1: blocked1.toFixed(2),
          dns1: dns1.toFixed(2),
          ssl1: ssl1.toFixed(2),
          connect1: connect1.toFixed(2),
          send1: send1.toFixed(2),
          wait1: wait1.toFixed(2),
          receive1: receive1.toFixed(2),
          blockedQueueing1: blockedQueueing1.toFixed(2),
  
          // HAR 2
          server2,
          requestId2,
          time2: time2.toFixed(2),
          blocked2: blocked2.toFixed(2),
          dns2: dns2.toFixed(2),
          ssl2: ssl2.toFixed(2),
          connect2: connect2.toFixed(2),
          send2: send2.toFixed(2),
          wait2: wait2.toFixed(2),
          receive2: receive2.toFixed(2),
          blockedQueueing2: blockedQueueing2.toFixed(2),
  
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
  
          // HAR 1
          row.server1,
          row.server2,
          row.requestId1,
          row.requestId2,
          row.time1,
          row.time2,
          row.blocked1,
          row.blocked2,
          row.dns1,
          row.dns2,
          row.ssl1,
          row.ssl2,
          row.connect1,
          row.connect2,
          row.send1,
          row.send2,
          row.wait1,
          row.wait2,
          row.receive1,
          row.receive2,
          row.blockedQueueing1,
          row.blockedQueueing2,
  
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
    data.each(function (row) {
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
  