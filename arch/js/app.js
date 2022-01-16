// app.js

const getEle = (id) => document.getElementById(id);


// init the editor
initEditor = (id, value, language, theme) => {
    const editorEle = getEle(id);
    const editor = monaco.editor.create(editorEle, { value, language, theme });
    return editor;
};


Split(["#left", "#right "], { sizes: [50, 50] });
const hpccWasm = window["@hpcc-js/wasm"];

const label = "Web Server Architecture";
const dir = "LR"; // LR RL TB BT

const rankSep = 0.75;
const pad = 2.0;

const nodeSep = 0.6;
const nodeWidth = 1.2;
const nodeHeight = 1.2;

const labelLoc = "b";
const labelFontsize = 10;

const archDotPrefix = `
    digraph { 
        graph [ fontcolor="#2D3436" 
            fontname="Sans-Serif" 
            fontsize=15 label="${label}" 
            nodesep=${nodeSep} 
            pad=${pad} rankdir=${dir} ranksep=${rankSep} 
            splines=curved
            ];

        node [fixedsize=true 
              fontcolor="#2D3436" 
              fontname="Sans-Serif" 
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

const fillImages = (str) => str;

const dotStr = `
LoadBalancer[image="${AWS_LB}"];

WebServer1[image="${AWS_EC2}"];
WebServer2[image="${AWS_EC2}"];
WebServer3[image="${AWS_EC2}"];
 
Database[image="${AWS_DB}"];  


LoadBalancer -> WebServer1 -> Database;
LoadBalancer -> WebServer2 -> Database;
LoadBalancer -> WebServer3 -> Database;

            `;
 


 
let editor;
setTimeout(function() {
     editor = initEditor('editor', dotStr, "text", 'vs-dark' );



const getEditorContent = (editor) => editor.getValue();




const drawBtn = getEle("draw");


const renderDwg = (dotStr) => {
  hpccWasm.graphviz
  .layout(`${archDotPrefix} ${dotStr} }`, "svg", "dot", { images: imagesUsed })
  .then((svg) => {
    const div = document.getElementById("arch");
    div.innerHTML = svg;
  }) .catch((err) => console.error(err.message));
};

drawBtn.addEventListener('click', event => {
    renderDwg(getEditorContent(editor));
});

drawBtn.click(); // bootstrap



// draw diagram functions
const graphDivEle = document.getElementById('arch');
const saveBtn = document.getElementById("saveBtn");

// SVG Save functions
let svgFileName = 'arc.svg';
const savefilenameEle = document.getElementById('savefilename');

saveBtn.addEventListener("click", (event) => {
  save(graphDivEle);
});

const triggerDownload = (imgURI, fileName) => {
  let a = document.createElement("a");

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
/*
  let image = new Image();
  image.onload = () => {

   let canvas = document.createElement('canvas');
   const div = document.getElementById("arch");
   div.append(canvas)

   
   
   canvas.width = 800;
   
   canvas.height = 600;
   let context = canvas.getContext('2d');
   // draw image in canvas starting left-0 , top - 0  
   context.drawImage(image, 0, 0, 800, 600 );
  //  downloadImage(canvas); need to implement
  }
   image.src = url;
*/

  triggerDownload(url, svgFileName);
};



}, 100);

// https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/index.min.js
// wasm: https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/graphvizlib.wasm