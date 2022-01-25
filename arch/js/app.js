// app.js
// mohan chinnappan

const getEle = (id) => document.getElementById(id);


// param parsing
parseParams = () => {
  const query = location.search.substr(1);
  let qResult = {};
  query.split("&").forEach(function(part) {
      const item = part.split("=");
      qResult[item[0]] = decodeURIComponent(item[1]);
  });
  return qResult;
}

// get the language (l) param
const params = parseParams();
let lang = params['l'] || 'json';
let theme = params['t'] || 'vs-dark';
let timeout = params['o'] || 100;


const TIMEOUT = 100;

// init the editor
initEditor = (id, value, language, theme) => {
    const editorEle = getEle(id);
    const editor = monaco.editor.create(editorEle, { value, language, theme });
    return editor;
};


Split(["#left", "#right "], { sizes: [50, 50] });
const hpccWasm = window["@hpcc-js/wasm"];

let label = "Web Server Architecture";
const dir = "LR"; // LR RL TB BT

const rankSep = 0.75;
const pad = 2.0;

const nodeSep = 0.6;
const nodeWidth = 1.2;
const nodeHeight = 1.2;

const labelLoc = "b";
const labelFontsize = 10;



const defaultDef = {
  "title": "AWS Web Server Architecture",
  "images": [
      {
          "name": "LoadBalancer",
          "url": "https://mohan-chinnappan-n5.github.io/arch/img/aws/network/elastic-load-balancing.png"
      },
      {
          "name": "WebServer1",
          "url": "https://mohan-chinnappan-n5.github.io/arch/img/aws/compute/ec2-rounded.png"
      },
      {
          "name": "WebServer2",
          "url": "https://mohan-chinnappan-n5.github.io/arch/img/aws/compute/ec2-rounded.png"
      },
      {
          "name": "Database",
          "url": "https://mohan-chinnappan-n5.github.io/arch/img/aws/db/database.png"
      },
      {
        "name": "a0",
        "url": "https://mohan-chinnappan-n5.github.io/arch/img/aws/db/database.png"
      },
      {
      "name": "a1",
      "url": "https://mohan-chinnappan-n5.github.io/arch/img/aws/db/database.png"
     },
     {
      "name": "a2",
      "url": "https://mohan-chinnappan-n5.github.io/arch/img/aws/db/database.png"
     },
     {
     "name": "a3",
     "url": "https://mohan-chinnappan-n5.github.io/arch/img/aws/db/database.png"
    }

  ],
  "connections": [
      "LoadBalancer -> WebServer1 -> Database;",
      "LoadBalancer -> WebServer2 -> Database;",

      "subgraph cluster_0 { style=filled; shape=box color=lightblue; node [style=filled, color=salmon];a0 -> a1 -> a2 -> a3; label=\" OnPrem\"}",
      "WebServer1 -> a0;"
  ]
}

let editor;
const drawBtn = getEle("draw");

setTimeout(function() {

  try {

  editor = initEditor('editor', JSON.stringify(defaultDef, null, 4), lang, theme );
  const getEditorContent = (editor) => editor.getValue();




const getDrawStr  = definition => {
  let imageSet = [];
  let dotStr = "";
  for (const image of definition.images) {
      dotStr += String.raw`${image.name}[image="${image.url}"];` + "\n";
      if (imageSet.indexOf(image.url) === -1) {
          imageSet.push(image.url)
      }
  }

  for (const connection of definition.connections) {
      dotStr += connection + "\n";

  }
  return { dotStr, imageSet };
}


const renderDwg = (definition) => {

  const { dotStr, imageSet } = getDrawStr(definition);
  label = definition.title;

  const images = [];
  for (const image of imageSet ){
    const item = { path: `${image}`, width: "515px", height: "600px" }
    images.push(item);
  }

  // refer: https://github.com/magjac/d3-graphviz#images

  const archDotPrefix = `
    digraph arch { 
        graph [ fontcolor="#2D3436" 
            fontname="Times" 
            fontsize=15 label="${label}" 
            nodesep=${nodeSep} 
            pad=${pad} rankdir=${dir} ranksep=${rankSep} 
            
            ];

        node [fixedsize=true 
              fontcolor="#2D3436" 
              fontname="Times" 
              fontsize=${labelFontsize} 
              height=${nodeHeight}
              imagescale=true 
              labelloc=${labelLoc} 
              shape=box 
              style=rounded 
              width=${nodeWidth}
            ];
            
        edge [color="#7B8894"]
`;

 const dotOutput = `${archDotPrefix} ${dotStr} } ;`;
 const dotEle = getEle('dotOutput');
 dotEle.value = dotOutput;

  hpccWasm.graphviz
  .layout(`${archDotPrefix} ${dotStr} }`, "svg", "dot", { images })
  .then((svg) => {
    const div = document.getElementById("arch");
    div.innerHTML = svg;
  }) .catch((err) => console.error(err.message));
};

drawBtn.addEventListener('click', event => {
    renderDwg(JSON.parse( getEditorContent(editor))  );
});

drawBtn.click(); // bootstrap



// draw diagram functions
const graphDivEle = document.getElementById('arch');
const saveBtn = document.getElementById("saveBtn");

// SVG Save functions
const saveFilenameEle = document.getElementById('svgFilename');

saveBtn.addEventListener("click", (event) => {
  save(graphDivEle);
});

let svgFileName = 'arch.svg';

const triggerDownload = (imgURI, fileName) => {
  let a = document.createElement("a");
  const svgFileName = saveFilenameEle.value || 'arch.svg';

  a.setAttribute("download", `${svgFileName}`);
  a.setAttribute("href", imgURI);
  a.setAttribute("target", "_blank");

  a.click();
};


let save = (ele) => {
  const startNode = 6;
  let data = new XMLSerializer().serializeToString(ele.childNodes[startNode]);
  // console.log(data);
  let svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  let url = URL.createObjectURL(svgBlob);
  
  triggerDownload(url, svgFileName);
};




// file management
let getUploadedFile = (event) => {
  const input = event.target;
  if ("files" in input && input.files.length > 0) {
    // console.log(input.files[0]);
    placeFileContent( input.files[0]);
  }
};
let placeFileContent = ( file) => {
  readFileContent(file)
    .then((content) => {
      editor.setValue(content);
    })
    .catch((error) => { console.log(error); alert(error)});
};

let readFileContent = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

document
  .getElementById("inputfile")
  .addEventListener("change", getUploadedFile);

// saving source

// save to file
saveSourceToFile = () => {
  //var textToWrite = document.getElementById('textArea').innerHTML;

  var fileContent = editor.getValue();
  var textFileAsBlob = new Blob([fileContent], { type: "application/json" });
  var fileNameToSaveAsInput = document.getElementById("savefilename").value;
  //console.log('fileNameToSaveAsInput:' , fileNameToSaveAsInput)
  var fileNameToSaveAs = fileNameToSaveAsInput || "myPage.html";

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
};
document.getElementById("save").addEventListener("click", saveSourceToFile)

  } catch (e) {
    alert (e);
  }

}, timeout);

// https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/index.min.js
// wasm: https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/graphvizlib.wasm