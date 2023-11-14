// jsonApp.js
// mohan chinnappan

Split(["#content", "#je"], { sizes: [50, 50] });

const downloadButton = document.getElementById('download-button');
let initJSON =
    `{
        "browsers": [
          "Chrome",
          "Safari",
          "Firefox"
        ],
        "chrome_is_best": true,
        "pollution": null,
        "pi": 3.14,
        "gems": {
          "unix": [
            "ken",
            "dmr"
          ],
          "c": [
            "dmr"
          ]
        },
        "greeting": "Hello Math!"
      }
`;

let jsonEditor;

// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('c')) {
  await navigator.clipboard.readText().then((clipText) => {
    initJSON = clipText;
  });
}


// create the editor
const container = document.getElementById('jsoneditor')
const options = {
    mode: 'tree',
    modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
    onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode)
    },
    autocomplete: {
        applyTo: ['value'],
        filter: 'contain',
        trigger: 'focus',
        getOptions: function (text, path, input, editor) {
            return new Promise(function (resolve, reject) {
                const options = extractUniqueWords(editor.get())
                if (options.length > 0) {
                    resolve(options)
                } else {
                    reject()
                }
            })
        }
    }
}

// helper function to extract all unique words in the keys and values of a JSON object
function extractUniqueWords(json) {
    return _.uniq(_.flatMapDeep(json, function (value, key) {
        return _.isObject(value)
            ? [key]
            : [key, String(value)]
    }))
}

const editor = new JSONEditor(container, options)


require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {

    jsonEditor = monaco.editor.create(document.getElementById('editor-json'), {
        value: initJSON,
        language: 'json',
        theme: 'vs-dark'
    });
    editor.set(JSON.parse(initJSON));

    jsonEditor.onDidChangeModelContent(() => {
        editor.set(JSON.parse(jsonEditor.getValue()));
    });


    //--------
    function downloadJson() {
        const jsonContent = jsonEditor.getValue();
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadButton.addEventListener('click', downloadJson);



});



const jsonFileInput = document.getElementById("jsonFileInput");
jsonFileInput.addEventListener("change", function (event) {
    var file = event.target.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            jsonEditor.setValue(content);
        }
    };
    reader.readAsText(file);
});




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
            jsonEditor.setValue(fileContent);
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
