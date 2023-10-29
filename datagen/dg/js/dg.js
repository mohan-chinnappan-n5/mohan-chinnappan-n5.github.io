// synthetic (fake) data generator
// mohan chinnappan

let editor;
let editor2;

let simpleSpec;
let total = 5;
const MAX_LIMIT = 10000;
import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const repoUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n/project-docs';
const listDwg = await fetchText(`${repoUrl}/main/datagen/list.txt`);
const selectionMap = listDwg.trim().split('\n');
let typeSelected = "package";


async function loadData(selection) {
    const packageUrl = `${repoUrl}/main/datagen/${selection}`;
    const packageData = await fetchText(packageUrl);
    editor.setValue(packageData);

}


const acConfigMtype = {
    placeHolder: "Search for data spec JSON data ...",
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


// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('c')) {
    await navigator.clipboard.readText().then((clipText) => {
        simpleSpec = clipText;
    });
} else {
    simpleSpec = await fetchText(`./data/person.json?v=2`);
}

if (urlParams.has('t')) {
    total = parseInt(urlParams.get('t'));
}

if (total > MAX_LIMIT) {
    alert(`Maximum limit for number of records per execution: ${MAX_LIMIT}. We generated ${MAX_LIMIT} records! `)
    total = 10000;
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
        value: simpleSpec,
        language: "json",
        theme: "vs-dark",
    });
    editor2 = monaco.editor.create(document.getElementById("editor2"), {

        language: "json",
        theme: "vs-dark",
    });

    monaco.editor.setModelLanguage(editor.getModel(), 'json');


    const convertAndDownload = jsonData => {
        // Convert JSON to CSV
        const csvData = Papa.unparse(jsonData);

        // Generate download link
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
    }

    const convertAndDownloadJSON = jsonData => {
        // Convert JSON to CSV
        const csvData = Papa.unparse(jsonData);

        // Generate download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
    }



    function convertAndCopyToClipboard(jsonData) {
        // Convert JSON to CSV
        const csvData = Papa.unparse(jsonData);
        console.log(csvData);

        // Copy CSV data to clipboard
        navigator.clipboard.writeText(csvData)
            .then(() => {
                console.log('CSV data copied to clipboard!');
            })
            .catch((error) => {
                console.error('Failed to copy CSV data to clipboard:', error);
            });
    }
    getEle('viewcsv').addEventListener('click', event => {
        // Convert JSON to CSV
        convertAndCopyToClipboard(editor2.getValue());
        window.location.href = `https://mohan-chinnappan-n5.github.io/viz/datatable/dt.html?c=csv`;
    });


    getEle('tocsv').addEventListener('click', event => {
        convertAndDownload(editor2.getValue());
        convertAndDownloadJSON(editor2.getValue());

    });


    const getData = (specs, count = 100) => {
        const output = [];

        for (let i = 0; i < count; i++) {
            const obj = {};
            for (const spec of specs) {
                const [cat, item] = spec.split('.');
                const data = faker[cat][item]();
                obj[`${item}`] = data;
            }
            output.push(obj);
        }
        return output;
    }

    renderDataTable();
    // Function to render the DataTable view
    function renderDataTable() {
        try {
            const editorContent = JSON.parse(editor.getValue());
            let fieldsData = [];
            for (const col of editorContent) {
                const colName = (col.split('.'))[1];
                fieldsData.push({ data: colName, title: colName });
            }


            const genData = getData(editorContent, total);
            editor2.setValue(JSON.stringify(genData, null, 4));

            /* $('#data-table').empty();
            //$("#data-table").DataTable().remove().draw();
  
             const dt = $("#data-table").DataTable({
                 destroy: true,
                 bDestroy: true,
                 scrollX: true,
                 dom: "Blfrtip",
                 buttons: ["copy", "csv", "excel", "pdf", "print"],
                 data: genData,
                 columns: fieldsData
 
             });
             dt.columns.adjust().draw(); */


        }
        catch (e) {
            console.log(e);
            getEle('errors').value = e;

        }



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



