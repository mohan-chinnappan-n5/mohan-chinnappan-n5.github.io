// svg editor
// mohan chinnappan

let editor;
const getEle = (id) => document.getElementById(id);
Split(["#code", "#content"], {
    sizes: [50, 50],
});

// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const repoUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n/project-docs';


const rendering = getEle('rendering');
let startFile = 'lightningUriEvent.svg'
let initFileUrl = undefined;

let simpleSVG =
`<svg width="1000" height="800">
    <circle cx="50" cy="50" r="40" stroke="black" 
    stroke-width="2" fill="#99ccff" />
    <rect x="120" width="100" height="100" rx="15" fill='#ff99cc' />

    <polygon points="0,100 50,25 50,75 100,0" fill="#cc99ff"/>
    <polyline points="100,100 150,25 150,75 200,0" fill="none" stroke="red" />

    <!-- The <g> SVG element is a container used to group other SVG elements. -->
    <!-- Using g to inherit presentation attributes -->

    <g fill="white" stroke="green" stroke-width="3">
        <circle cx="100" cy="400" r="25" />
        <circle cx="120" cy="440" r="25" />
        <circle cx="140" cy="480" r="25" />
    </g>
</svg>`;

simpleSVG = await fetchText(`${repoUrl}/main/svg/lightningUriEvent.svg`); 

if (urlParams.has("c")) {
    await navigator.clipboard.readText().then((clipText) => {
        simpleSVG = clipText;
    });
}
if (urlParams.has("u")) {
    const url = urlParams.get('u');
    // e.g: https://raw.githubusercontent.com/mohan-chinnappan-n/project-docs/main/svg/loginEvent.svg
    simpleSVG = await fetchText(url); 
 } 
 


async function fetchText(url) {
const response = await fetch(url);
const content = await response.text();
return content;
}

const listDwg = await fetchText(`${repoUrl}/main/svg/list.txt`);
const selectionMap = listDwg.trim().split('\n');
let typeSelected = "package";


async function loadData(selection) {
const packageUrl = `${repoUrl}/main/svg/${selection}`;
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

// Initialize Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(getEle('editor'), {
        language: 'xml',
        theme: 'vs-dark',
        value: simpleSVG,
        automaticLayout: true,
    });





    // Function to render the SVG based on user input
    const renderSVG = () => {
        const svgText = editor.getValue();
        rendering.innerHTML = svgText;
    }




    // Render the SVG when the editor content changes
    editor.onDidChangeModelContent(renderSVG);

    // Initial rendering
    renderSVG();


    // SVG Save functions
    const chartEle = getEle("rendering");
    let svgFileName = "drawing.svg";
    const saveBtn = getEle("save");
    saveBtn.addEventListener("click", (event) => {
        save(chartEle);
    });

    const triggerDownload = (imgURI, fileName) => {
        let a = document.createElement("a");
        a.setAttribute("download", `${svgFileName}`);
        a.setAttribute("href", imgURI);
        a.setAttribute("target", "_blank");
        a.click();
    };

    let save = (ele) => {
        let data = new XMLSerializer().serializeToString(ele.childNodes[0]);
        let svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
        let url = URL.createObjectURL(svgBlob);
        triggerDownload(url, svgFileName);
    };

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



// Function to prevent the default behavior of drag-and-drop
function preventDefault(e) {
    e.preventDefault();
}

// Add event listeners to the drop area
const dropArea = document.getElementById("dropArea");
dropArea.addEventListener("dragenter", preventDefault, false);
dropArea.addEventListener("dragover", preventDefault, false);
dropArea.addEventListener("drop", handleFileDrop, false);

if (urlParams.has("f")) {
    loadData(initFileUrl);
}



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







});











