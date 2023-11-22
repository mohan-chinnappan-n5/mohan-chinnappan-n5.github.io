// text classification in browser
// based on transformers.js by xenova
// mohan chinnappan 

const getEle = id => document.getElementById(id);
Split(["#stat", "#inputDiv", "#results", ], { sizes: [10, 45, 45], });
let initData = `{"result": "comes here"}`;
let initInputText = `Yesterday I went to movie theater and saw the movie. 
The movie was awesome!`;

// read url parameters
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("c")) {
    await navigator.clipboard.readText().then((clipText) => {
        initInputText = clipText;
    })
}

// constants 
const THRESHOLD = 0.5;
const TASK = 'text-classification';
const MODEL = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'


let resultsEditor;
let inputEditor;

require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
  },
});



require(["vs/editor/editor.main"], function () {
    resultsEditor = monaco.editor.create(getEle("resultsEditor"), {
    value: initData,
    language: "json",
    theme: "vs-dark",
  });
  
  inputEditor = monaco.editor.create(getEle("inputEditor"), {
    value: initInputText,
    language: "text",
    theme: "vs-dark",
  }); 

});



// Reference the elements that we will need
const status = getEle('status');
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0';

// Since we will download the model from the Hugging Face Hub, we can skip the local model check
env.allowLocalModels = false;

// Create a new text-classification pipeline
status.textContent = 'Loading model...';
const classifier = await pipeline(TASK, MODEL);
status.textContent = 'Ready';


// Detect objects in the image
async function classify(text) {
    status.textContent = 'Analyzing the text...';
    const output = await classifier(text);
    status.textContent = 'Done.';
    return output;
}

const classifyBtn = getEle('classifyButton')
classifyBtn.addEventListener('click', async event => {
    const output = await classify(inputEditor.getValue());
    resultsEditor.setValue(JSON.stringify(output, null, 4));
})

// init click
classifyBtn.click();

 // file upload
 getEle("file-upload")
 .addEventListener("change", function (event) {
   var file = event.target.files[0];
   if (file) {
     var reader = new FileReader();
     reader.onload = function (e) {
       inputEditor.setValue(e.target.result);
       classifyBtn.click();
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
         inputEditor.setValue(fileContent);
         classifyBtn.click();
      };
      reader.readAsText(file);

    }
  }
  
  // Function to prevent the default behavior of drag-and-drop
  function preventDefault(e) {
    e.preventDefault();
  }
  
  // Add event listeners to the drop area
  const dropArea = getEle("dropArea");
  dropArea.addEventListener("dragenter", preventDefault, false);
  dropArea.addEventListener("dragover", preventDefault, false);
  dropArea.addEventListener("drop", handleFileDrop, false);
  //----------