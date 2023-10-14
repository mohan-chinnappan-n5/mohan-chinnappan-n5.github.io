// har visualizer
// mohan chinnappan

let editor;
const getEle = id => document.getElementById(id);
Split(["#code", "#content"], {
    sizes: [40, 60]
});


require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    // Initialize Monaco Editor
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `{"message": "Load your HAR file by uploading or drag and drop"}`,
        language: "json",
        theme: "vs-dark"
    });


    function analyzeHarData(harData) {
        if (!harData || !harData.log || !harData.log.entries || harData.log.entries.length === 0) {
            return {
                numRequests: 0,
                uploadedBytes: 0,
                downloadedBytes: 0
            };
        }

        const entries = harData.log.entries;
        let numRequests = entries.length;
        let uploadedBytes = 0;
        let downloadedBytes = 0;

        for (const entry of entries) {
            if (entry.request) {
                if (entry.request.bodySize > 0) {
                    uploadedBytes += entry.request.bodySize;
                }
            }

            if (entry.response) {
                if (entry.response.bodySize > 0) {
                    downloadedBytes += entry.response.bodySize;
                }
            }
        }

        return {
            numRequests,
            uploadedBytes,
            downloadedBytes
        };
    }



    // Function to render the DataTable view
    function renderDataTable() {
        var harContent = editor.getValue();
        var harData = JSON.parse(harContent);
        const { numRequests, uploadedBytes, downloadedBytes } = analyzeHarData(harData);
        const summary =
            `Number of requests:${numRequests} 
Uploaded bytes:${uploadedBytes} 
Downloaded bytes:${downloadedBytes}
        `;
        getEle('summary').value = summary;
        getEle('summary').style.display ='block';


        const entries = harData.log.entries;
        // $("#har-table").append( $('<tfoot/>').append($("#har-table thead tr").clone()));
        const table = $('#har-table').DataTable({
            scrollX: true,
            destroy: true,
            bDestroy: true,
            data: entries,
            dom: "Blfrtip",
            buttons: ["copy", "csv", "excel", "pdf", "print"],
            data: entries,
            columns: [
                { data: 'startedDateTime', title: 'StartTime' },
                //{ data: 'pageref', title: 'PageRef' },
                //{ data: 'serverIPAddress', title: 'serverIPAddress' },


                { data: 'time', title: 'Time (ms)' },

                { data: 'request.method', title: 'Method' },
                { data: 'response.status', title: 'Status' },
                { data: 'response.httpVersion', title: 'HTTP' },
                { data: 'response.bodySize', title: 'BodySize' },
                { data: 'timings.blocked', title: 'Blocked (ms)' },

                { data: 'timings.receive', title: 'Receive (ms)' },
                { data: 'timings.dns', title: 'DNS (ms)' },
                { data: 'timings.connect', title: 'Connect (ms)' },
                { data: 'timings.wait', title: 'Wait (ms)' },
                { data: 'timings.ssl', title: 'SSL (ms)' },



                { data: 'response.content.size', title: 'Size (b)' },
                { data: 'response.content.compression', title: 'Compression (b)' },
                { data: 'response.content.mimeType', title: 'MimeType' },

                //{ data: 'connection', title: 'Connection' },


                { data: 'request.url', title: 'URL' },

            ],
            /* drawCallback: function () {
                var api = this.api();
                $(api.table().footer()).html(
                    api.column(1, { page: 'current' }).data().sum()
                );
            } */

        });
    }




    // Function to update visualization
    function updateVisualization() {
        var harContent = editor.getValue();
        var harData = JSON.parse(harContent);

        // Clear the previous visualization
        var visualization = d3.select('svg');
        visualization.selectAll('*').remove();

        // Extract network requests from the HAR data
        var entries = harData.log.entries;

        // Calculate the start and end times for the requests
        var minStartTime = Number.MAX_VALUE;
        var maxEndTime = 0;

        entries.forEach(function (entry) {
            var startTime = entry.startedDateTime ? new Date(entry.startedDateTime).getTime() : 0;
            var endTime = startTime + entry.time;

            minStartTime = Math.min(minStartTime, startTime);
            maxEndTime = Math.max(maxEndTime, endTime);
        });

        // Create the x and y scales for the chart
        var svgWidth = document.getElementById('visualization').offsetWidth;
        var svgHeight = 300;

        var xScale = d3.scaleLinear()
            .domain([minStartTime, maxEndTime])
            .range([10, svgWidth - 10]);

        var yScale = d3.scaleBand()
            .domain(entries.map(function (entry, index) { return "Request " + (index + 1); }))
            .range([10, svgHeight - 10]);

        // Create rectangles for each request (representing request duration)
        visualization.selectAll("rect")
            .data(entries)
            .enter()
            .append("rect")
            .attr("x", function (d) { return xScale(new Date(d.startedDateTime).getTime()); })
            .attr("y", function (d, i) { return yScale("Request " + (i + 1)); })
            .attr("width", function (d) { return xScale(d.time); })
            .attr("height", yScale.bandwidth())
            .attr("fill", "lightblue");

        // Add labels for request durations
        visualization.selectAll("text")
            .data(entries)
            .enter()
            .append("text")
            .text(function (d) { return d.time + " ms"; })
            .attr("x", function (d) { return xScale(new Date(d.startedDateTime).getTime()) + xScale(d.time) + 5; })
            .attr("y", function (d, i) { return yScale("Request " + (i + 1)) + yScale.bandwidth() / 2; })
            .attr("dy", "0.35em");

        // Add axis labels
        visualization.append("g")
            .attr("transform", "translate(0," + (svgHeight - 20) + ")")
            .call(d3.axisBottom(xScale).tickFormat(d3.format(".2s")));

        visualization.append("text")
            .attr("x", svgWidth / 2)
            .attr("y", svgHeight - 5)
            .style("text-anchor", "middle")
            .text("Time (ms)");
    }

    // Listen for changes in the editor content
    // editor.onDidChangeModelContent(updateVisualization);
    editor.onDidChangeModelContent(renderDataTable);


    // Initialize visualization
    //updateVisualization();
});

// Function to handle file drop
function handleFileDrop(e) {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];
        // Store the original uploaded file name
        // Check if the dropped file is a text file (you can adjust the condition)
        const reader = new FileReader();

        reader.onload = function (event) {
            const fileContent = event.target.result;
            editor.setValue(fileContent);
        };

        reader.readAsText(file);
    }
}

// Function to prevent the default behavior of drag-and-drop
function preventDefault(e) {
    e.preventDefault();
}

// Add event listeners to the drop area
const dropArea = document.getElementById("dropArea");
dropArea.addEventListener("dragenter", preventDefault, false);
dropArea.addEventListener("dragover", preventDefault, false);
dropArea.addEventListener("drop", handleFileDrop, false);

// file upload
const jsonFileInput = document.getElementById("jsonFileInput");
jsonFileInput.addEventListener("change", function (event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            editor.setValue(content);
        }
    };
    reader.readAsText(file);
});


