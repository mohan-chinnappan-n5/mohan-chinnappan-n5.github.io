
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0';

const TASK = 'feature-extraction'; // extracts feature,  embedding for the given texts
const MODEL = 'Xenova/all-MiniLM-L6-v2';

const getEle = id => document.getElementById(id);
let initInputText = "Ken Thompson and Dennis Ritchie are fathers of the Unix operating system";

// read url parameters
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("c")) {
    await navigator.clipboard.readText().then((clipText) => {
        initInputText = clipText;
    })
}


Split(["#set1", "#set2",], { sizes: [50, 50] });
//Split(["#input2", "#output2",], { sizes: [50, 50] });


// ---- cosine similarity ----
// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
function dotProduct(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const commonKeys = keys1.filter(key => keys2.includes(key));

    return commonKeys.reduce((acc, key) => acc + obj1[key] * obj2[key], 0);
}

function magnitude(obj) {
    const values = Object.values(obj);
    return Math.sqrt(values.reduce((acc, val) => acc + val * val, 0));
}

function cosineSimilarity(obj1, obj2) {
    const dotProd = dotProduct(obj1, obj2);
    const mag1 = magnitude(obj1);
    const mag2 = magnitude(obj2);

    if (mag1 === 0 || mag2 === 0) {
        throw new Error('Magnitude should not be zero for cosine similarity');
    }

    return dotProd / (mag1 * mag2);
}



let resultsEditor, resultsEditor2;
let inputEditor, inputEditor2;

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
    },
});



require(["vs/editor/editor.main"], function () {
    resultsEditor = monaco.editor.create(getEle("resultsEditor"), {
        language: "json",
        theme: "vs-dark",
    });

    inputEditor = monaco.editor.create(getEle("inputEditor"), {
        value: initInputText,
        language: "text",
        theme: "vs-dark",
    });
    // second editor
    resultsEditor2 = monaco.editor.create(getEle("resultsEditor2"), {
        language: "json",
        theme: "vs-dark",
    });

    inputEditor2 = monaco.editor.create(getEle("inputEditor2"), {
        value: initInputText,
        language: "text",
        theme: "vs-dark",
    });

});



async function loadModel(task, model) {
    return await pipeline(TASK, MODEL);
}
const extractor = await loadModel(TASK, MODEL);

async function getEmbedding(sentence, extractor) {
    const embedding = await extractor(sentence, { pooling: 'mean', normalize: true });
    return embedding.data;
}


async function main(sentence) {
    return await getEmbedding(sentence, extractor);
}

//--------------

getEle('embed').addEventListener('click', async event => {
    // let sentence = 'Ken Thompson and Dennis Ritchie are fathers of the Unix operating system';
    const sentence = inputEditor.getValue();
    const embedding = await main(sentence);
    resultsEditor.setValue(JSON.stringify(embedding, null, 4));
});
getEle('embed2').addEventListener('click', async event => {
    // let sentence = 'Ken Thompson and Dennis Ritchie are fathers of the Unix operating system';
    const sentence = inputEditor2.getValue();
    const embedding = await main(sentence);
    resultsEditor2.setValue(JSON.stringify(embedding, null, 4));
});

getEle('cs').addEventListener('click', async event => {
    // let sentence = 'Ken Thompson and Dennis Ritchie are fathers of the Unix operating system';
    if (resultsEditor.getValue() && resultsEditor2.getValue()) {
        const vec1 = JSON.parse(resultsEditor.getValue());
        const vec2 = JSON.parse(resultsEditor2.getValue());
        const cs = cosineSimilarity(vec1, vec2);
        getEle('csValue').innerHTML = `${cs.toFixed(6)}`;
    } else {
        alert ("Two vectors are needed for cosine similarity!");
        throw new Error('Two vectors are needed for cosine similarity!');
    }

})


// file upload


// file upload
getEle("file-upload")
    .addEventListener("change", function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                inputEditor.setValue(e.target.result);
                getEle('embed').click();
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
            getEle('embed').click();
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

