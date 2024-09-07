// df.js
// author: mohan chinnappan

let ext = "plaintext"; // Default extension
let isDarkTheme = false; 

// Load Monaco Editor
require.config({ paths: { vs: "monaco/vs" } });

let editor;
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.createDiffEditor(
    document.getElementById("container"),
    {
      theme: "vs-light", // You can change to "vs-dark" for dark mode
    }
  );
});

// Utility function to get file extension
function getFileExtension(filename) {
  return filename.split(".").pop();
}

  // Toggle Theme
  document.getElementById("themeToggle").addEventListener("change", (event) => {
    isDarkTheme = event.target.checked;
    const theme = isDarkTheme ? "vs-dark" : "vs-light";
    monaco.editor.setTheme(theme);

    // Update label text
    document.getElementById("themeLabel").innerText = isDarkTheme ? "Dark Theme" : "Light Theme";
  });

  

// File handling for original and modified files
document.getElementById("file1").addEventListener("change", handleFileUpload);
document.getElementById("file2").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];
  const reader = new FileReader();
  const textareaId = fileInput.id === "file1" ? "t1" : "t2";

  reader.onload = function (e) {
    document.getElementById(textareaId).value = e.target.result;
  };

  reader.readAsText(file);

  // Auto-detect file extension
  const detectedExt = getFileExtension(file.name);
  ext = detectedExt;
}

document.getElementById("compare").addEventListener("click", () => {
  if (editor) {
    monaco.editor.getModels().forEach((model) => model.dispose());
    editor.dispose(); // Clean up existing editor
  }

  // Check if extension override is provided
  const overrideExt = document.getElementById("overrideExt").value;
  if (overrideExt) {
    ext = overrideExt;
  }

  // Create new diff editor
  editor = monaco.editor.createDiffEditor(
    document.getElementById("container"),
    {
        theme: isDarkTheme ? "vs-dark" : "vs-light",
    }
  );

  // Set the original and modified models
  editor.setModel({
    original: monaco.editor.createModel(
      document.getElementById("t1").value,
      ext
    ),
    modified: monaco.editor.createModel(
      document.getElementById("t2").value,
      ext
    ),
  });
});
