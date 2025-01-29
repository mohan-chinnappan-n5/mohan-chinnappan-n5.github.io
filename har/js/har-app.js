// har visualizer
// mohan chinnappan
// dedication to Dr. Kalam

let editor;
let summary = {};
let simpleHAR;

let showHeaders = false;





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


async function fetchText(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
}


const getEle = (id) => document.getElementById(id);
Split(["#code", "#content"], {
  sizes: [40, 60],
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

  // Function to render the DataTable view
  function renderDataTable() {
    var harContent = editor.getValue();
    var harData = JSON.parse(harContent);
    summary = analyzeHarData(harData);

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
      { data: "request.url", title: "URL" },


     { data: "timings.blocked", title: "Blocked (ms)" },

      { data: "timings.receive", title: "Receive (ms)" },
      { data: "timings.dns", title: "DNS (ms)" },
      { data: "timings.connect", title: "Connect (ms)" },
      { data: "timings.wait", title: "Wait (ms)" },
      { data: "timings.ssl", title: "SSL (ms)" },

      { data: "response.content.size", title: "Size (b)" },
      // { data: "response.content.compression", title: "Compression (b)" },
      { data: "response.content.mimeType", title: "MimeType" },

      //{ data: 'connection', title: 'Connection' },

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
    }

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
      columns:  myColumns

      
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


