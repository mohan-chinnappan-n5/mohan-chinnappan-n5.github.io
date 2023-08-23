// simple editor
// mchinnappan
//------------------------------------------------------------

Split(["#menu", "#content", "#htmlContent"], { sizes: [20, 50, 30] });
let isFileLoaded = false; // Track whether a file is loaded
let inputExtension = ""; // Store the input file's extension
let originalFileName = ""; // Store the original uploaded file name

let editor;

// Function to set Monaco Editor's language mode based on the file extension
function setEditorLanguage(extension) {
  const supportedLanguages = monaco.languages.getLanguages();

  const languageId = supportedLanguages.find((lang) =>
    lang.extensions?.includes(`.${extension}`)
  );

  if (languageId) {
    monaco.editor.setModelLanguage(editor.getModel(), languageId.id);
  }
}

require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs" },
});

const initContent = `
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" />
</head>

<body class="container">
  <h3>Hello Fruits!</h3>
  <ul class="list-group">
    <li class="list-group-item">Mango</li>
    <li class='list-group-item'>Jackfruit</li>
    <li class='list-group-item'>Peach</li>
  </ul>

  <h4>Choose</h4>
  <select class='form-control'>
    <option>Mango</option>
    <option>Jackfruit</option>
    <option>Peach</option>
  </select>

</html>


`;
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: initContent,
    language: "html",
    theme: "vs-dark",
  });

  // Get the iframe element
  var iframe = document.getElementById("output-iframe");

  // Function to update the iframe content
  function updateIframeContent() {
    const contentType = editor.getModel().getModeId();

    // Get the HTML content from the editor
    var htmlContent = editor.getValue();

    // Update the iframe content
    iframe.contentWindow.document.open();
    if (contentType !== 'html') iframe.contentWindow.document.write('<pre>' + htmlContent + '</pre>');
    else iframe.contentWindow.document.write(htmlContent );
    
    iframe.contentWindow.document.close();
  }

  // Call the function to update the iframe content initially
  updateIframeContent();

  // Handle content change event
  editor.onDidChangeModelContent(function () {
    // Get the content type (language) of the editor's model
    var contentType = editor.getModel().getModeId();

    // Check if the content type is HTML
    var isHtml = contentType === "html";

    // Enable or disable the iframe based on the content type
    iframe.style.display = isHtml ? "block" : "none";
    updateIframeContent()
  });

  const jsonFileInput = document.getElementById("jsonFileInput");
  jsonFileInput.addEventListener("change", function (event) {
    var file = event.target.files[0];
    // Store the original uploaded file name
    const fileName = file.name;
    originalFileName = fileName;
    // Extract the file extension from the input file
    inputExtension = fileName.split(".").pop().toLowerCase();
    // Set Monaco Editor's language mode based on the inputExtension
    setEditorLanguage(inputExtension);
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var content = e.target.result;
        editor.setValue(content);
      };
      reader.readAsText(file);
    }
  });
});

// Function to handle file drop
function handleFileDrop(e) {
  e.preventDefault();

  const files = e.dataTransfer.files;

  if (files.length > 0) {
    const file = files[0];
    // Store the original uploaded file name
    const fileName = file.name;
    originalFileName = fileName;

    // Extract the file extension from the input file
    inputExtension = fileName.split(".").pop().toLowerCase();

    // Check if the dropped file is a text file (you can adjust the condition)
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result;

      // Set the file content in Monaco Editor
      editor.setValue(fileContent);
      // Update the flag and enable the download button
      isFileLoaded = true;
      // Set Monaco Editor's language mode based on the inputExtension
      setEditorLanguage(inputExtension);
      updateIframeContent();
      document.getElementById("downloadButton").disabled = false;
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

// Add a click event listener to the download button (as shown in the previous answer)
document
  .getElementById("downloadButton")
  .addEventListener("click", downloadFile);

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
