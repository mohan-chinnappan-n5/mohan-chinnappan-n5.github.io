//----------------------------
// Markdown Editor 
// mohan chinnappan
//----------------------------
Split([ "#content", "#htmlContent"], { sizes: [50, 50] });
let originalFileName = ""; // Store the original uploaded file name
const repoUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n/project-docs';
const listDwg = await fetchText(`${repoUrl}/main/sf/list.txt`);
const selectionMap = listDwg.trim().split('\n');


let initData = `
# Animals
## Donkeys
## Horses
## Mules
## Ponies
- For kids
    - Friendly with kids
![Compare](https://www.greensboroughvets.com.au/images/mule.jpg)

`;
// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('c')) {
  await navigator.clipboard.readText().then((clipText) => {
    initData = clipText;
  });
} else if (urlParams.has('f')) {
  const file = urlParams.get('f'); 
  initData = await getData(file);
}

const getEle = (id) => document.getElementById(id);




let editor; // Declare editor variable in a global scope

const preview = document.getElementById('preview');
const converter = new showdown.Converter({tables: true});


// Initialize Monaco Editor
require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.24.0/min/vs",
  },
});
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: JSON.stringify(initData, null, 4),
    language: "markdown",
    theme: "vs-dark",
  });

  editor.setValue(initData);


  function updatePreview() {
    var markdownText = editor.getValue();
    preview.innerHTML =  converter.makeHtml(markdownText); // You need to include the 'marked' library
  }

  editor.onDidChangeModelContent((event) => {
    updatePreview();
  });


  const jsonFileInput = document.getElementById("jsonFileInput");
  jsonFileInput.addEventListener("change", function (event) {
    var file = event.target.files[0];
    originalFileName = file.name;

    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var content = e.target.result;
           editor.setValue(content);
        }
      };
      reader.readAsText(file);
    });


  // Initialize the preview
  updatePreview();

});

// Function to handle file drop
function handleFileDrop(e) {
  e.preventDefault();

  const files = e.dataTransfer.files;

  if (files.length > 0) {
    const file = files[0];
    // Store the original uploaded file name
    originalFileName = file.name;

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



// Function to download the file
function downloadFile() {
  const fileContent = editor.getValue(); // Get the content from Monaco Editor
  const blob = new Blob([fileContent], { type: "text/plain" }); // Create a Blob

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);

  // Set the file name with the input extension
  // a.download = `downloaded_file.${inputExtension}`;
  // Set the file name with the original uploaded file name and extension
  a.download = originalFileName;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
}

// Add a click event listener to the download button
document
  .getElementById("downloadButton")
  .addEventListener("click", downloadFile);

//------ auto complete ---
async function fetchText(url) {
  const response = await fetch(url);
  const content = await response.text();
  return content;
}


let typeSelected = "package";

async function loadData(selection) {
  const packageUrl = `${repoUrl}/main/sf/${selection}`;
  const packageData = await fetchText(packageUrl);
  editor.setValue(packageData);

}
async function getData(selection) {
  const packageUrl = `${repoUrl}/main/sf/${selection}`;
  const packageData = await fetchText(packageUrl);
  return packageData;

}



const acConfigMtype = {
  placeHolder: "Search for markdown data...",
  selector: "#autoCompleteMtype",
  data: {
      src: selectionMap
  },
  resultItem: {
      highlight: true,
  },

  resultsList: {
      element: (list, data) => {
          const info = document.createElement("p");
          if (data.results.length) {
              info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
          } else {
              info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
          }
          list.prepend(info);
      },

      noResults: true,
      maxResults: 15,
      tabSelect: true,
  },

  events: {
      input: {
          selection: async (event) => {
              const selection = event.detail.selection.value;
              autoCompleteJSMtype.input.value = selection;
              typeSelected = selection;
              await loadData(typeSelected);

          },
      },
  },
};
const autoCompleteJSMtype = new autoComplete(acConfigMtype);


 // Function to handle the print action
 function printDiv(divName) {
  const printContents = document.getElementById(divName).innerHTML;
  const originalContents = document.body.innerHTML;

  // Temporarily replace the page's content with the content of the specified div
  document.body.innerHTML = printContents;

  // Apply the "print-only" class to hide elements not intended for printing
  document.body.classList.add('print-only');

  // Trigger the print action
  window.print();

  // Restore the original page content
  document.body.innerHTML = originalContents;
  document.body.classList.remove('print-only');
}

// Add a click event listener to the "Print" button
document.getElementById('printButton').addEventListener('click', function () {
  printDiv('preview'); // 'contentToPrint' is the id of the div to be printed
});

// RUM stuff
// Function to send performance data to the RUM server
    //const rumServer = 'http://localhost:1000/rum';
    const rumServer = 'http://3.133.148.157:3000/rum'
    const pageName = 'Markdown Editor - Kalam';
    console.log(rumServer);

    function sendPerformanceDataToServer(data) {
      fetch(rumServer, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Performance data sent to RUM server successfully');
          } else {
            console.error('Failed to send performance data to RUM server');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    // Function to gather and send performance metrics
    function gatherAndSendPerformanceMetrics() {
      console.log('inside gatherAndSendPerformanceMetrics() ')

      if ('performance' in window) {
        const perf = window.performance;
        const timing = perf.timing;
        const resources = perf.getEntriesByType('resource');
        const userTimings = perf.getEntriesByType('measure');

        // Calculate page load time
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        // Ensure pageLoadTime is non-negative
        const nonNegativePageLoadTime = Math.max(0, pageLoadTime);

        // Gather performance data including page name
        const performanceData = {
          pageName: pageName, // Replace with the actual page name
          pageLoadTime: nonNegativePageLoadTime,
          timeToFirstByte: timing.responseStart - timing.navigationStart,
          resources: resources,
          userTimings: userTimings,
        };

        // Send performance data to the RUM server
        sendPerformanceDataToServer(performanceData);
      }
      else {
        console.log('could not find "performance" in the window object')
      }
    }

    // Log performance metrics when the page is fully loaded
    let myevent = 'load';
    myevent = 'afterprint';
    window.addEventListener(myevent, gatherAndSendPerformanceMetrics);





