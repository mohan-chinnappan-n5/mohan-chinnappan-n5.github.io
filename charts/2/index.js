// Replace the existing JavaScript in the <script> tag at the bottom of `index.html` with this updated version to improve field selection handling and chart generation:

    // Handle CSV Upload
    document.getElementById('uploadBtn').addEventListener('click', () => {
        const fileInput = document.getElementById('csvUpload');
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a CSV file.');
            return;
        }

        Papa.parse(file, {
            complete: function(results) {
                const data = results.data;
                if (data.length === 0 || data[0].length === 0) {
                    alert('No data found in the CSV file.');
                    return;
                }

                // Display data in DataTable
                populateDataTable(data);
                // Populate field selectors for charts
                populateFieldSelectors(data[0]); // Use header row for field names
                // Show field selection and chart container
                document.getElementById('fieldSelection').classList.remove('hidden');
                document.getElementById('chartContainer').innerHTML = ''; // Clear previous chart
            },
            header: true,
            skipEmptyLines: true,
            error: function(error) {
                alert(`Error parsing CSV: ${error.message}`);
            }
        });
    });

    // Populate DataTable
    function populateDataTable(data) {
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');
        const table = document.getElementById('dataTable');

        // Clear existing content
        tableHeader.innerHTML = '';
        tableBody.innerHTML = '';

        // Use header row for columns
        const headers = Object.keys(data[0]);
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.className = 'p-2 text-left';
            tableHeader.appendChild(th);
        });

        // Populate rows
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header] || '';
                td.className = 'p-2';
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });

        table.classList.remove('hidden');
        document.getElementById('tableStatus').classList.add('hidden');

        // Initialize DataTable
        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').DataTable().destroy();
        }
        $('#dataTable').DataTable({
            responsive: true,
            pageLength: 10,
            order: [[0, 'asc']]
        });
    }

    // Populate field selectors for charts
    function populateFieldSelectors(headers) {
        const xField = document.getElementById('xField');
        const yField = document.getElementById('yField');

        // Clear existing options
        xField.innerHTML = '<option value="">Select X-Axis Field</option>';
        yField.innerHTML = '<option value="">Select Y-Axis Field / Aggregate</option>';

        headers.forEach(header => {
            const optionX = document.createElement('option');
            optionX.value = header;
            optionX.textContent = header;
            xField.appendChild(optionX);

            const optionY = document.createElement('option');
            optionY.value = header;
            optionY.textContent = header;
            yField.appendChild(optionY);

            // Add aggregate options for bar charts
            ['sum', 'max', 'average'].forEach(agg => {
                const aggOption = document.createElement('option');
                aggOption.value = `${agg}(${header})`;
                aggOption.textContent = `${agg.toUpperCase()} of ${header}`;
                yField.appendChild(aggOption);
            });
        });
    }

    // Generate VegaLite Chart
    function generateChart(data) {
        const chartType = document.getElementById('chartType').value;
        const xField = document.getElementById('xField').value;
        const yField = document.getElementById('yField').value;

        if (!xField || !yField) {
            document.getElementById('chartError').classList.remove('hidden');
            document.getElementById('chartError').textContent = 'Please select both X-Axis and Y-Axis fields or aggregates.';
            return;
        }

        document.getElementById('chartError').classList.add('hidden');

        let spec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            data: { values: data },
            mark: chartType,
            encoding: {
                x: { field: xField, type: 'nominal' }, // Assuming X-axis is categorical (nominal)
                y: { 
                    field: yField.replace(/^(sum|max|average)\((.*?)\)$/, '$2'), 
                    type: 'quantitative' 
                }
            }
        };

        // Handle aggregates for bar charts
        if (chartType === 'bar' && yField.match(/^(sum|max|average)\((.*?)\)$/)) {
            const [agg, field] = yField.match(/^(sum|max|average)\((.*?)\)$/).slice(1);
            spec.transform = [{
                aggregate: [{ op: agg, field: field, as: field }],
                groupby: [xField]
            }];
            spec.encoding.y.field = field;
            spec.encoding.y.type = 'quantitative';
        }

        // Adjust for specific chart types
        if (chartType === 'donut') {
            spec.mark = { type: 'arc', innerRadius: 50 };
            spec.encoding.theta = { field: yField.replace(/^(sum|max|average)\((.*?)\)$/, '$2'), type: 'quantitative' };
            delete spec.encoding.y;
            delete spec.encoding.x; // Donut charts typically don’t use X/Y but theta
        } else if (chartType === 'scatter') {
            spec.mark = { type: 'point', filled: true };
            // Ensure X-axis can be quantitative if needed (e.g., for numeric data like mpg)
            if (!isNaN(data[0][xField])) {
                spec.encoding.x.type = 'quantitative';
            }
        } else if (chartType === 'line') {
            spec.mark = 'line';
            // Ensure X-axis can be quantitative if needed
            if (!isNaN(data[0][xField])) {
                spec.encoding.x.type = 'quantitative';
            }
        } else if (chartType === 'area') {
            spec.mark = 'area';
            // Ensure X-axis can be quantitative if needed
            if (!isNaN(data[0][xField])) {
                spec.encoding.x.type = 'quantitative';
            }
        }

        vegaEmbed('#chartContainer', spec, { actions: true }).then(() => {
            console.log('Chart rendered successfully');
        }).catch(error => {
            console.error('Error rendering chart:', error);
            document.getElementById('chartError').classList.remove('hidden');
            document.getElementById('chartError').textContent = `Error generating chart: ${error.message}`;
        });
    }

    // Handle chart generation on button click
    document.getElementById('generateChartBtn').addEventListener('click', () => {
        const fileInput = document.getElementById('csvUpload');
        if (fileInput.files.length > 0) {
            Papa.parse(fileInput.files[0], {
                complete: function(results) {
                    generateChart(results.data);
                },
                header: true,
                skipEmptyLines: true,
                error: function(error) {
                    alert(`Error parsing CSV: ${error.message}`);
                }
            });
        } else {
            alert('Please upload a CSV file first.');
        }
    });

    // Handle chart generation on selection change (optional, for real-time updates)
    document.getElementById('chartType').addEventListener('change', () => {
        const fileInput = document.getElementById('csvUpload');
        if (fileInput.files.length > 0) {
            Papa.parse(fileInput.files[0], {
                complete: function(results) {
                    generateChart(results.data);
                },
                header: true,
                skipEmptyLines: true,
                error: function(error) {
                    alert(`Error parsing CSV: ${error.message}`);
                }
            });
        }
    });

    document.getElementById('xField').addEventListener('change', () => {
        const fileInput = document.getElementById('csvUpload');
        if (fileInput.files.length > 0) {
            Papa.parse(fileInput.files[0], {
                complete: function(results) {
                    generateChart(results.data);
                },
                header: true,
                skipEmptyLines: true,
                error: function(error) {
                    alert(`Error parsing CSV: ${error.message}`);
                }
            });
        }
    });

    document.getElementById('yField').addEventListener('change', () => {
        const fileInput = document.getElementById('csvUpload');
        if (fileInput.files.length > 0) {
            Papa.parse(fileInput.files[0], {
                complete: function(results) {
                    generateChart(results.data);
                },
                header: true,
                skipEmptyLines: true,
                error: function(error) {
                    alert(`Error parsing CSV: ${error.message}`);
                }
            });
        }
    });