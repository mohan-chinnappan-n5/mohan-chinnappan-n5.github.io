// app.js
// mohan chinnappan

const getEle = (id) => document.getElementById(id);

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

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("o")) {
  const input = urlParams.get("o");
  const inputObj = JSON.parse(atob(input));
  const accessToken = decodeURIComponent(inputObj[0].split("=")[1]);
  const instanceUrl = decodeURIComponent(inputObj[1].split("=")[1]);
  getEle("accessTokenInput").value = accessToken;
  getEle("instanceUrlInput").value = instanceUrl;
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
    value: "SELECT Id, Name FROM Account LIMIT 5",
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

  getEle('corsLink').href = `${instanceUrl}/074`;
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

// Function to query Salesforce using the saved credentials and query
function querySalesforce() {
  
  const tooling = getEle('tooling').checked;
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
      // Check if the request was successful (status code 2xx)
      /* if (!response.ok) {
        throw new Error(
          `Salesforce API request failed: ${response.status} - ${response.statusText}`
        );
      } */
      // Parse the JSON response
      return response.json();
    })
    .then((data) => {
      // Return the query results
      resultEditor.setValue(JSON.stringify(data, null, 2));
    })
    .catch((error) => {
      // Check if there's additional error information in the response body
      if (error instanceof Response) {
        error.json().then((errorData) => {
          resultEditor.setValue(JSON.stringify(errorData, null, 4));
        });
      } else
        resultEditor.setValue({
          Error: error.message + ": Did you set up CORS in your Org?",
        });
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
  a.download = "soql-results.json";
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
  placeHolder: "Search for SOQL query data...",
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
