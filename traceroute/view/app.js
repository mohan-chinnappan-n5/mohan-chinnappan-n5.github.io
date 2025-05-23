// app.js
// mohan chinnappan
// Fetch country information based on IP address using ip-api (free version)
        async function fetchCountry(ip) {
            try {
                const response = await fetch(`http://ip-api.com/json/${ip}`);
                const data = await response.json();
                return data.country || 'Unknown';
            } catch (error) {
                console.error('Error fetching country info:', error);
                // return 'Unknown';
                return `<a target='new' class="text-blue-600 hover:text-blue-800 visited:text-purple-600" href='https://ipinfo.io/${ip}'>Get Country Info</a>`;

            }
        }




// Parse traceroute output with support for multiple latencies and multi-line hops
function parseTraceroute2(tracerouteText) {
    const hops = [];
    const lines = tracerouteText.split("\n");
    let currentHop = null;

    lines.forEach(line => {
        // Match a new hop line
        const hopMatch = line.match(/^\s*(\d+)\s+([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:[\d\.]+ ms\s*)+)/);
        const starMatch = line.match(/^\s*(\d+)\s+\*/);

        if (hopMatch) {
            if (currentHop) {
                hops.push(currentHop); // Save the previous hop before starting a new one
            }

            // Start a new hop
            currentHop = {
                hopNumber: hopMatch[1],
                hostname: hopMatch[2] || 'Unknown',
                ipAddress: hopMatch[3],
                latencies: hopMatch[4]
                    .trim()
                    .split(/\s+/), // Split latencies by whitespace
                country: 'Fetching...' // Placeholder for country
            };
        } else if (starMatch) {
            if (currentHop) {
                hops.push(currentHop); // Save the previous hop before starting a new one
            }

            // Start a new hop with no response
            currentHop = {
                hopNumber: starMatch[1],
                hostname: 'No Response',
                ipAddress: 'N/A',
                latencies: ['N/A'],
                country: 'Unknown'
            };
        } else if (line.match(/^\s+/) && currentHop) {
            // Additional lines for the current hop
            const additionalMatch = line.match(/([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:[\d\.]+ ms\s*)+)/);
            if (additionalMatch) {
                // Add details from the additional line
                currentHop.latencies.push(
                    ...additionalMatch[3]
                        .trim()
                        .split(/\s+/) // Split latencies by whitespace
                );
            }
        }
    });

    // Push the last hop if it exists
    if (currentHop) {
        hops.push(currentHop);
    }

    return hops;
}

function parseTraceroute(tracerouteText) {
    const hops = [];
    const lines = tracerouteText.split("\n");
    let currentHop = null;

    lines.forEach(line => {
        // Match a new hop line
        const hopMatch = line.match(/^\s*(\d+)\s+([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s?)+)/);
        const starMatch = line.match(/^\s*(\d+)\s+\*/);

        if (hopMatch) {
            if (currentHop) {
                hops.push(currentHop); // Save the previous hop before starting a new one
            }

            // Start a new hop
            currentHop = {
                hopNumber: hopMatch[1],
                hostname: hopMatch[2] || 'Unknown',
                ipAddress: hopMatch[3],
                latencies: hopMatch[4]
                    .trim()
                    .split(/\s+(?=\d+\.|\*)/) // Split latencies into individual parts
                    .map(latency => latency.trim()),
                country: 'Fetching...' // Placeholder for country
            };
        } else if (starMatch) {
            if (currentHop) {
                hops.push(currentHop); // Save the previous hop before starting a new one
            }

            // Start a new hop with no response
            currentHop = {
                hopNumber: starMatch[1],
                hostname: 'No Response',
                ipAddress: 'N/A',
                latencies: ['N/A'],
                country: 'Unknown'
            };
        } else if (line.match(/^\s+/) && currentHop) {
            // Additional lines for the current hop
            const additionalMatch = line.match(/([\w\.-]+)?\s*\(([\d\.]+)\)\s+((?:\d+\.\d+ ms|\*\s?)+)/);
            if (additionalMatch) {
                // Add details from the additional line
                currentHop.latencies.push(
                    ...additionalMatch[3]
                        .trim()
                        .split(/\s+(?=\d+\.|\*)/) // Split latencies into individual parts
                        .map(latency => latency.trim())
                );
            }
        }
    });

    // Push the last hop if it exists
    if (currentHop) {
        hops.push(currentHop);
    }

    return hops;
}



        // Handle file upload and process traceroute data
        document.getElementById('fileInput').addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async function (event) {
                    const tracerouteText = event.target.result;
                    // Display the raw traceroute output in the <pre> element
                    document.getElementById('rawTracerouteOutput').innerText = tracerouteText;
                    document.getElementById('allContent').style.display = 'block';

                    navigator.clipboard.writeText(tracerouteText).then(function() {
                        alert('The traceroute data copied to clipboard!');
                    }).catch(function(error) {
                        console.error('Error copying raceroute data : ', error);
                    });

                    document.getElementById('rawTracerouteOutput').style.display = 'block';
                    const hops = parseTraceroute(tracerouteText);

                    // Insert data into the table
                    const tableBody = document.getElementById('tracerouteTableBody');
                    let totalLatency = 0;

                    // Clear previous table rows
                    tableBody.innerHTML = '';
                    document.getElementById('exportCsvButton').style.display = 'block';

                    // Add new rows with country data
                    for (let hop of hops) {
                        // Fetch country for each hop
                        hop.country = await fetchCountry(hop.ipAddress);

                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${hop.hopNumber}</td>
                            <td>${hop.hostname}</td>
                            <td>${hop.ipAddress}
                            </td>
                            <td>${hop.latencies.join(', ')}</td>
                            <td>${hop.country}</td>
                        `;
                        tableBody.appendChild(row);

                        // Calculate total latency (ignore 'N/A' latencies)
                        hop.latencies.forEach(latency => {
                            if (latency !== 'N/A') {
                                totalLatency += parseFloat(latency.replace(' ms', ''));
                            }
                        });
                    }

                    // Display total latency
                    document.getElementById('totalLatency').innerText = `Total Latency: ${totalLatency.toFixed(2)} ms`;

                    // Initialize DataTable
                    $('#tracerouteTable').DataTable();

                    // Generate Line-by-Line Analysis
                    let analysisSection = '';
                    hops.forEach(hop => {
                        analysisSection += `
                            <div class="line-analysis">
                                <h4>Hop ${hop.hopNumber}: ${hop.hostname}</h4>
                                <p><strong>IP Address:</strong> ${hop.ipAddress}</p>
                                <p><strong>Latencies:</strong> ${hop.latencies.join(', ')}</p>
                                <p><strong>Country:</strong> ${hop.country}</p>
                                <p><strong>Status:</strong> ${hop.hostname === 'No Response' ? 'No Response from Host' : 'Response Received'}</p>
                            </div>
                        `;
                    });
                    document.getElementById('lineAnalysisSection').innerHTML = analysisSection;

                    // Generate Mermaid Flowchart
                    let mermaidText = 'graph LR;\n';
                    hops.forEach(hop => {
                        let hopColor = hop.hostname === 'No Response' ? 'red' : 'green';
                        mermaidText += `  ${hop.hopNumber}["Hop ${hop.hopNumber}: ${hop.hostname}"]:::${hopColor};\n`;
                    });

                    // Apply Mermaid flowchart syntax with colors
                    mermaidText += `
                    classDef red fill:#ffcccc,stroke:#ff6666;
                    classDef green fill:#ccffcc,stroke:#66cc66;
                    `;

                    // Enable the button once the Mermaid code is ready
                    document.getElementById('copyMermaidButton').style.display = 'block';

                    // Store the Mermaid text in clipboard when the button is clicked
                    document.getElementById('copyMermaidButton').addEventListener('click', function() {
                        navigator.clipboard.writeText(mermaidText).then(function() {
                            alert('Mermaid code copied to clipboard!');
                        }).catch(function(error) {
                            console.error('Error copying Mermaid code: ', error);
                        });
                    });
                };

                reader.readAsText(file);
            }
        });


// Function to export all DataTable data to CSV
function exportAllDataTableToCSV(filename) {
    const dataTable = $('#tracerouteTable').DataTable();

    // Get all data from DataTable
    const rows = [['Hop', 'Hostname', 'IP Address', 'Latencies (ms)', 'Country']]; // Add header row
    const allData = dataTable.rows().data(); // Fetch all rows, ignoring pagination

    // Iterate over all rows and push to CSV
    allData.each(row => {
        rows.push([
            row[0], // Hop
            row[1], // Hostname
            row[2], // IP Address
            row[3], // Latencies (ms)
            row[4], // Country
        ]);
    });

    // Convert rows to CSV format
    const csvContent = rows.map(row => row.join(',')).join('\n');

    // Create a blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Attach click event to the Export CSV button
document.getElementById('exportCsvButton').addEventListener('click', function () {
    exportAllDataTableToCSV('traceroute_data.csv');
});