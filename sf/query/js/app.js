// app.js
// mohan chinnappan



Split(["#settingPane", "#queryPane", "#resultsPane"], {
  sizes: [20, 40, 40],
});

const getEle = (id) => document.getElementById(id);
let initData = "SELECT Id, Name FROM Account LIMIT 5";

let downloadFileExt = 'json';

// Get the query parameters from the URL

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("o")) {
  const input = urlParams.get("o");
  const inputObj = JSON.parse(atob(input));
  const accessToken = decodeURIComponent(inputObj[0].split("=")[1]);
  const instanceUrl = decodeURIComponent(inputObj[1].split("=")[1]);
  getEle("accessTokenInput").value = accessToken;
  getEle("instanceUrlInput").value = instanceUrl;
  saveCredentials();
} else if (urlParams.has("c")) {
  await navigator.clipboard.readText().then((clipText) => {
    initData = clipText;
  });
} else if (urlParams.has("c2")) {
  await navigator.clipboard.readText().then((clipText) => {
    initData = clipText.replace(/;/g, ",").replace(/WHERE/gi, "\nWHERE");
  });
}

//------ auto complete ---
async function fetchText(url) {
  const response = await fetch(url);
  const content = await response.text();
  return content;
}

const repoUrl =
  "https://raw.githubusercontent.com/mohan-chinnappan-n/project-docs";
const listDwg = await fetchText(`${repoUrl}/main/soql/list.txt`);
const selectionMap = listDwg.trim().split("\n");

// Load previous input from localStorage
const savedData = JSON.parse(localStorage.getItem("orgData"));
// console.log(savedData);
if (savedData) {
  getEle("accessTokenInput").value = savedData.accessToken;
  getEle("instanceUrlInput").value = savedData.instanceUrl;
}

let queryEditor;
let resultEditor;

let typeSelected = "package";

async function loadData(selection) {
  const packageUrl = `${repoUrl}/main/soql/${selection}`;
  const packageData = await fetchText(packageUrl);
  queryEditor.setValue(packageData);
}

require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
  },
});
require(["vs/editor/editor.main"], function () {
  // Initialize Monaco Editor for query input
  queryEditor = monaco.editor.create(getEle("queryEditor"), {
    value: initData,
    language: "sql",
    theme: "vs-dark",
    automaticLayout: true,
  });

  // Initialize Monaco Editor for result display
  resultEditor = monaco.editor.create(getEle("resultEditor"), {
    value: "",
    language: "json",
    theme: "vs-dark",
    readOnly: true,
    automaticLayout: true,
  });
});

// Function to save access token and instance URL to local storage
function saveCredentials() {
  const accessToken = getEle("accessTokenInput").value;
  const instanceUrl = getEle("instanceUrlInput").value;

  getEle(
    "login-frontDoor"
  ).href = `${instanceUrl}/secur/frontdoor.jsp?sid="${accessToken}"`;

  getEle("login-frontDoor").style.display = "block";

  getEle("corsLink").href = `${instanceUrl}/074`;
  getEle("corsLink").style.display = "block";

  // Store input in localStorage
  const data = { accessToken, instanceUrl };
  // console.log(data);
  //console.log(data);
  localStorage.setItem("orgData", JSON.stringify(data));
}

getEle("saveOrgInfo").addEventListener("click", (event) => {
  saveCredentials();
});

// Function to store SOQL query in local storage
function storeQuery(query, time) {
  const item = { q: query, t: time };
  let storedQueries = new Set(JSON.parse(localStorage.getItem("storedSOQLQueries"))) || new Set();
  storedQueries.add(item);
  localStorage.setItem("storedSOQLQueries", JSON.stringify(Array.from(storedQueries)));
  // Update the displayed stored queries
  displayStoredQueries();

}

// Function to display stored queries
function displayStoredQueries() {
  const storedQueries =
    JSON.parse(localStorage.getItem("storedSOQLQueries")) || new Set();
  const storedQueriesList = getEle("storedQueries");
  storedQueriesList.innerHTML = "";

  Array.from(storedQueries).forEach(function (query, index) {
    const listItem = document.createElement("li");
    listItem.textContent = `${query.q} | ${query.t}`;
    listItem.classList.add("list-group-item");
    listItem.onclick = function () {
      // Set the selected query in the editor when clicked
      queryEditor.setValue(query.q);
    };
    storedQueriesList.appendChild(listItem);
  });
  updateDownloadButtonState();

}

// Function to remove stored queries
function removeQueries() {
  // Clear stored queries in local storage
  localStorage.removeItem("storedSOQLQueries");

  // Clear displayed queries
  getEle("storedQueries").innerHTML = "";

  // Update download button state
  updateDownloadButtonState();
}


// Function to query Salesforce using the saved credentials and query
function querySalesforce() {
  const tooling = getEle("tooling").checked;
  // console.log('querySalesforce');
  const accessToken = getEle("accessTokenInput").value;
  const instanceUrl = getEle("instanceUrlInput").value;

  if (!accessToken || !instanceUrl) {
    alert("Please enter the access token and instance URL in the left pane.");
    return;
  }

  // Salesforce REST API endpoint for querying records
  const query = queryEditor.getValue();
  let apiEndpoint = `${instanceUrl}/services/data/v58.0/query?q=${encodeURIComponent(
    query
  )}`;

  if (tooling) {
    apiEndpoint = `${instanceUrl}/services/data/v58.0/tooling/query?q=${encodeURIComponent(
      query
    )}`;
  }

  // Make a GET request to the Salesforce REST API with 'no-cors' mode
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  // Record the start time
  const startTime = performance.now();

  fetch(apiEndpoint, {
    method: "GET",
    headers,
    // mode: 'no-cors'
  })
    .then((response) => {
      // Record the end time
      const endTime = performance.now();
      // Calculate the elapsed time
      const elapsedTime = endTime - startTime;
      getEle("time-taken").innerHTML = `Completed in: ${elapsedTime.toFixed(
        2
      )} ms`;
      // Store the query in local storage
      if (query && query !== undefined) storeQuery(query, elapsedTime.toFixed(2));

      return response.json();
    })
    .then((data) => {
      // Return the query results
      resultEditor.setValue(JSON.stringify(data, null, 2));
      const tempTextArea = document.createElement("textarea");

      tempTextArea.value = JSON.stringify(data.records);
      // Append the textarea to the document
      document.body.appendChild(tempTextArea);

      // Select and copy the content of the textarea
      tempTextArea.select();
      document.execCommand("copy");
      getEle("dtv").style.display = "block";
      getEle("elf").style.display = "none";
      downloadFileExt = 'json';

      const msg = "Are you sure you want to proceed to view the Latest Event Log File?"

      if (data && data.records && data.records[0].attributes.url && 
        data.records[0].attributes.url.includes('EventLogFile/')
        && window.confirm(msg)) {

        const restPayload = {
          "method": "GET",
          "tooling": false,
          "url": data.records[0].LogFile,
          "sfdc": true,
          "Content-Type": "text/csv"
        }

        headers["Content-Type"] = restPayload["Content-Type"];
        // REST for event logs
        fetch(`${instanceUrl}${restPayload.url}`, {
          method: restPayload.method,
          headers
          // mode: 'no-cors'
        })
          .then((response) => {
            // Record the end time
            const endTime = performance.now();
            // Calculate the elapsed time
            const elapsedTime = endTime - startTime;
            getEle("time-taken").innerHTML = `Completed in: ${elapsedTime.toFixed(
              2
            )} ms`;

            // Store the query in local storage
            if (query && query !== undefined) storeQuery(query, elapsedTime.toFixed(2));

            return response.text();
          })
          .then((data) => {
            // Return the query results
            resultEditor.setValue(data)

            const tempTextArea = document.createElement("textarea");

            tempTextArea.value = data;
            // Append the textarea to the document
            document.body.appendChild(tempTextArea);

            // Select and copy the content of the textarea
            tempTextArea.select();
            document.execCommand("copy");
            getEle("elf").style.display = "block";
            getEle("dtv").style.display = "none";
            downloadFileExt = 'csv';


          })
          .catch((error) => {
            // Check if there's additional error information in the response body
            if (error instanceof Response) {
              error.json().then((errorData) => {
                resultEditor.setValue(JSON.stringify(errorData, null, 4));
              });
            } else
              resultEditor.setValue(
                JSON.stringify({
                  msg: error.message,
                  info: "Did you set up CORS in your Org?",
                })
              );
          });


      }
    })
    .catch((error) => {
      // Check if there's additional error information in the response body
      if (error instanceof Response) {
        error.json().then((errorData) => {
          resultEditor.setValue(JSON.stringify(errorData, null, 4));
          console.log(errorData);
        });
      } else
        resultEditor.setValue(
          JSON.stringify({
            msg: error.message,
            info: "Did you set up CORS in your Org?",
          })
        );
    });
}

getEle("processButton").addEventListener("click", (event) => {
  querySalesforce();
});

// Download
function downloadFile() {
  const fileContent = resultEditor.getValue(); // Get the content from Monaco Editor
  const blob = new Blob([fileContent], { type: "text/plain" }); // Create a Blob

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);

  // Set the file name with the input extension
  // a.download = `downloaded_file.${inputExtension}`;
  // Set the file name with the original uploaded file name and extension
  a.download = `soql-results.${downloadFileExt}`;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
}

getEle("downloadScript").addEventListener("click", downloadFile);

// file load
getEle("soqlInput").addEventListener("change", function (event) {
  var file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      queryEditor.setValue(e.target.result);
    };
    reader.readAsText(file);
  }
});

// drag n drop
// Function to handle file drop
function handleFileDrop(e) {
  e.preventDefault();

  const files = e.dataTransfer.files;

  if (files.length > 0) {
    const file = files[0];

    // Check if the dropped file is a text file (you can adjust the condition)
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result;
      queryEditor.setValue(fileContent);
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

// autocomplete

const acConfigMtype = {
  placeHolder: "Search for SOQL query files...",
  selector: "#autoCompleteMtype",
  data: {
    src: selectionMap,
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
// Display stored queries on page load
displayStoredQueries();

// Function to download queries to a text file
function downloadQueries() {
  const storedQueries = getEle("storedQueries").getElementsByTagName("li");
  let queriesText = "";

  // Concatenate queries into a text string
  for (let i = 0; i < storedQueries.length; i++) {
    queriesText += storedQueries[i].textContent + "\n";
  }

  // Create a Blob with the text content
  const blob = new Blob([queriesText], { type: "text/plain" });

  // Create a download link
  const link = document.createElement("a");
  link.download = "queries.txt";
  link.href = window.URL.createObjectURL(blob);
  link.style.display = "none";

  // Append the link to the body and trigger the click event
  document.body.appendChild(link);
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
}

getEle("download-queries").addEventListener("click", (event) => {
  downloadQueries();
});

// Function to update the download button state based on stored queries
function updateDownloadButtonState() {
  const storedQueries = getEle("storedQueries").getElementsByTagName("li");
  const downloadButton = getEle("download-queries");

  // Enable the button if there are stored queries, otherwise disable it
  downloadButton.disabled = storedQueries.length === 0;
  getEle('delete-queries').disabled = storedQueries.length === 0;

}

// Initial state check on page load
updateDownloadButtonState();

getEle('delete-queries').addEventListener('click', event => {
  removeQueries();
})

