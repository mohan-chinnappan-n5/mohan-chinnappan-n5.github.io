// har visualizer
// mohan chinnappan
// dedication to Dr. Kalam

let editor;
let summary = {};
let simpleHAR;

let showHeaders = false;
let urlSize = 75;





// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('c')) {
  await navigator.clipboard.readText().then((clipText) => {
    simpleHAR = clipText;
  });
} else {
    simpleHAR = await fetchText(`./data/simple.har`);
}

if (urlParams.has('h')) {
  showHeaders = true;
}

if (urlParams.has('u')) {
  urlSize = urlParams.get('u');
}


async function fetchText(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
}


const getEle = (id) => document.getElementById(id);
Split(["#code", "#content"], {
  sizes: [20, 80],
});

require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
  },
});
require(["vs/editor/editor.main"], function () {
  // Initialize Monaco Editor
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: simpleHAR, 
    language: "json",
    theme: "vs-dark",
    // Disable outline by making focus border invisible
    automaticLayout: true,
    minimap: { enabled: false },
  });
 
  monaco.editor.setModelLanguage(editor.getModel(), 'json');

  renderDataTable();


  function analyzeHarData(harData) {
    if (
      !harData ||
      !harData.log ||
      !harData.log.entries ||
      harData.log.entries.length === 0
    ) {
      return {
        numRequests: 0,
        uploadedBytes: 0,
        downloadedBytes: 0,
        totalTime: 0,
        waitTime: 0,
        blockedTime: 0,
      };
    }

    const entries = harData.log.entries;
    let numRequests = entries.length;
    let uploadedBytes = 0;
    let downloadedBytes = 0;
    let totalTime = 0;
    let waitTime = 0;
    let blockedTime = 0;

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

      if (entry.time) {
        totalTime += entry.time;
      }

      if (entry.timings) {
        if (entry.timings.wait > 0) {
          waitTime += entry.timings.wait;
        }
        if (entry.timings.blocked > 0) {
          blockedTime += entry.timings.blocked;
        }
      }
    }

    return {
      numRequests,
      uploadedBytes,
      downloadedBytes,
      totalTime,
      waitTime,
      blockedTime,
    };
  }

  function createBarChart(canvasId, timingValues) {
    let ctx = document.getElementById(canvasId);
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Blocked", "Receive", "DNS", "Connect", "Wait", "SSL"],
            datasets: [{
                label: 'Timings (ms)',
                data: timingValues,
                backgroundColor: ['#ff5733', '#33ff57', '#3388ff', '#ff33aa', '#ffaa33', '#33ffaa'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: { display: false }, // Hide x-axis labels
                y: { display: false }  // Hide y-axis labels
            },
            plugins: {
                legend: { display: false } // Hide legend
            }
        }
    });
}

function generateWaterfallChart(harData) {
  let waterfallData = [];

  harData.log.entries.forEach((entry, index) => {
      let startTime = new Date(entry.startedDateTime).getTime();
      let offset = startTime - new Date(harData.log.pages[0].startedDateTime).getTime(); // Relative start
      let requestURL = entry.request.url.split('?')[0]; // Remove query params

      let stages = [
          { phase: "Blocked", time: entry.timings.blocked || 0, start: offset },
          { phase: "DNS", time: entry.timings.dns || 0, start: offset + (entry.timings.blocked || 0) },
          { phase: "Connect", time: entry.timings.connect || 0, start: offset + (entry.timings.blocked || 0) + (entry.timings.dns || 0) },
          { phase: "SSL", time: entry.timings.ssl || 0, start: offset + (entry.timings.blocked || 0) + (entry.timings.dns || 0) + (entry.timings.connect || 0) },
          { phase: "Send", time: entry.timings.send || 0, start: offset + (entry.timings.blocked || 0) + (entry.timings.dns || 0) + (entry.timings.connect || 0) + (entry.timings.ssl || 0) },
          { phase: "Wait", time: entry.timings.wait || 0, start: offset + (entry.timings.blocked || 0) + (entry.timings.dns || 0) + (entry.timings.connect || 0) + (entry.timings.ssl || 0) + (entry.timings.send || 0) },
          { phase: "Receive", time: entry.timings.receive || 0, start: offset + (entry.timings.blocked || 0) + (entry.timings.dns || 0) + (entry.timings.connect || 0) + (entry.timings.ssl || 0) + (entry.timings.send || 0) + (entry.timings.wait || 0) }
      ];

      // Filter out zero-duration phases
      stages.forEach(stage => {
          if (stage.time > 0) {
              waterfallData.push({
                  request: requestURL,
                  phase: stage.phase,
                  start: stage.start,
                  duration: stage.time
              });
          }
      });
  });

  // Render Vega-Lite chart
  renderWaterfallChart(waterfallData);
}
function renderWaterfallChart(waterfallData) {
  let spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 800,
      height: 400,
      data: { values: waterfallData },
      mark: "bar",
      encoding: {
          x: { field: "start", type: "quantitative", title: "Time (ms)", axis: { grid: true } },
          x2: { field: "duration", type: "quantitative" },
          y: { field: "request", type: "ordinal", title: "Requests", sort: "-x" },
          color: { field: "phase", type: "nominal", title: "Timing Phase" },
          tooltip: [
              { field: "request", type: "nominal", title: "Request URL" },
              { field: "phase", type: "nominal", title: "Phase" },
              { field: "duration", type: "quantitative", title: "Time (ms)" }
          ]
      }
  };

  vegaEmbed("#waterfall-chart", spec, { actions: false });
}


  // Function to render the DataTable view
  function renderDataTable() {
    var harContent = editor.getValue();
    var harData = JSON.parse(harContent);
    summary = analyzeHarData(harData);
    // generateWaterfallChart(harData);


    const summaryStr = `Number of requests:${summary.numRequests} 

Uploaded bytes:${summary.uploadedBytes} 
Downloaded bytes:${summary.downloadedBytes}

totalTime ms: ${summary.totalTime}
waitTime ms: ${summary.waitTime}
blockedTime ms: ${summary.blockedTime}

        `;
    getEle("summary").value = summaryStr;

    if (summary.uploadedBytes !== 0 && summary.downloadedBytes !==0) {
        drawChartBytes(summary.uploadedBytes, summary.downloadedBytes);
    }
    drawChartTime(summary.waitTime, summary.blockedTime);

    getEle("summary").style.display = "block";

    const entries = harData.log.entries;

    entries.forEach((entry, index) => {
      entry.reqHeadersString = entry.request.headers;
      entry.resHeadersString = entry.response.headers;
      
      entry.time = entry.time.toFixed(2);
      entry.timings.blocked = entry.timings.blocked.toFixed(2);
      entry.timings.receive = entry.timings.receive.toFixed(2);
      entry.timings.dns = entry.timings.dns.toFixed(2);
      entry.timings.connect = entry.timings.connect.toFixed(2);
      entry.timings.wait = entry.timings.wait.toFixed(2);
      entry.timings.ssl = entry.timings.ssl.toFixed(2);
      

     });

     

  

     let myColumns = [
      { data: "startedDateTime", title: "StartTime" },
      //{ data: 'pageref', title: 'PageRef' },
      //{ data: 'serverIPAddress', title: 'serverIPAddress' },

      { data: "time", title: "Time (ms)" },
      { data: "request.method", title: "Method" },
      { data: "response.status", title: "Status" },
      { data: "response.httpVersion", title: "HTTP" },
      { data: "response.bodySize", title: "BodySize" },
      { data: "request.url", title: "URL", 

      render: function (data, type, row) {
        if (type === 'display' && data.length > 50) { // Limit length for display
            return `<span title="${data}">${data.substring(0, urlSize)}...</span>`;
        }
        return `<span title="${data}">${data}</span>`; // Full URL for short links
    }},


     { data: "timings.blocked", title: "Blocked (ms)" },

      { data: "timings.receive", title: "Receive (ms)" },
      { data: "timings.dns", title: "DNS (ms)" },
      { data: "timings.connect", title: "Connect (ms)" },
      { data: "timings.wait", title: "Wait (ms)" },
      { data: "timings.ssl", title: "SSL (ms)" },

      { data: "response.content.size", title: "Size (b)" },
      // { data: "response.content.compression", title: "Compression (b)" },
      { data: "response.content.mimeType", title: "MimeType" },

      { 
        title: "Timing Chart", 
        data: null, 
        render: function(data, type, row, meta) {
            return `<div id="vega-chart-${meta.row}" style="width:100px; height:40px;"></div>`;
        }
      },

      //{ data: 'connection', title: 'Connection' },
      { data: "time", title: "" },


      { 
        data: "reqHeadersString",
        title: "RequestHeaders",
        render: function(data, type, row) {
            return `<button class='showBtn' onclick='showJsonPopup(${JSON.stringify(data)})'>Show</button>`;
        }
     },

     { 
      data: "resHeadersString",
      title: "ResponseHeaders",
      render: function(data, type, row) {
          return `<button class='showBtn' onclick='showJsonPopup(${JSON.stringify(data)})'>Show</button>`;
      }
    },
    

    ]

    if (!showHeaders) {
      myColumns = myColumns.slice(0, -2);
    }

    // $("#har-table").append( $('<tfoot/>').append($("#har-table thead tr").clone()));

    
    const table = $("#har-table").DataTable({
      scrollX: true,
      destroy: true,
      bDestroy: true,
      data: entries,
      dom: "Blfrtip",
      buttons: ["copy", "csv", "excel", "pdf", "print"],
      data: entries,
      columns:  myColumns,
      drawCallback: function(settings) {
        let api = this.api();
        api.rows().every(function(rowIdx, tableLoop, rowLoop) {
            let data = this.data();
            let containerId = `vega-chart-${rowIdx}`;
            createVegaLiteChart(containerId, [
                { category: "Blocked", value: data.timings.blocked || 0 },
                { category: "Receive", value: data.timings.receive || 0 },
                { category: "DNS", value: data.timings.dns || 0 },
                { category: "Connect", value: data.timings.connect || 0 },
                { category: "Wait", value: data.timings.wait || 0 },
                { category: "SSL", value: data.timings.ssl || 0 }
            ]);
        });
    
    }

      
      /* drawCallback: function () {
                var api = this.api();
                $(api.table().footer()).html(
                    api.column(1, { page: 'current' }).data().sum()
                );
            } */
    });
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
    };
  }
  reader.readAsText(file);
});

const drawChartBytes = (uploadedBytes, downloadedBytes) => {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "UploadedBytes vs DownloadedBytes",
    data: {
      values: [
        { category: "UploadedBytes", value: uploadedBytes },
        { category: "DownloadedBytes", value: downloadedBytes },
      ],
    },
    mark: { type: "arc", innerRadius: 50, tooltip: true },
    encoding: {
      theta: { field: "value", type: "quantitative" },
      color: { field: "category", type: "nominal" },
    },
  };
  vegaEmbed("#vizBytes", spec);
};

const drawChartTime = (waitTime, blockedTime) => {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "UploadedBytes vs DownloadedBytes",
    data: {
      values: [
        { category: "WaitTime", value: waitTime },
        { category: "BlockedTime", value: blockedTime },
      ],
    },
    mark: { type: "arc", innerRadius: 50, tooltip: true },
    encoding: {
      theta: { field: "value", type: "quantitative" },
      color: { field: "category", type: "nominal" },
    },
  };
  vegaEmbed("#vizTimes", spec);
};


