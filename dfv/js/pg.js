// render.js
// mohan chinnappan 

const getEle = (id) => document.getElementById(id);
const vizFrame= document.getElementById('viz').contentWindow.document;


const specEle = getEle("spec");
const renderBtn = getEle("render");
const loadBtn = getEle("load");

const CSS_LINKS = [`https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css`];
const SCRIPT_LINKS = [`https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.2/d3.min.js`];

const scriptContent = `
var homeless = [
    {state: "California", population: 129972 },
    {state: "New York", population: 91897 },
    {state: "Florida", population: 31030 },
    {state: "Texas", population: 25310 },
    {state: "Washington", population: 22304 }];
    
  var bar = d3.select("#bargraph1")
    .selectAll()
    .data(homeless);
    
  bar.join("text")
    .text((d) => d.state)
    .attr('x', 96)
    .attr('text-anchor', 'end')
    .attr('y', (d, i) => i * 20 + 17);
    
  bar.join("rect")
    .attr("height", 19)
    .attr("width", (d) => d.population/500)
    .attr("x", 100)
    .attr("y", (d, i) => i * 20)
    .attr("fill", "pink");

`;

  // <iframe> inject CSS
  CSS_LINKS.forEach(linkURL => {
    const link = document.createElement('link');
    link.href = linkURL;
    link.rel = "stylesheet";
    vizFrame.head.appendChild(link);
 })
  // <iframe> inject script
  SCRIPT_LINKS.forEach(scriptURL => {
    const scriptEle = document.createElement('script');
    scriptEle.setAttribute("src", scriptURL);
    scriptEle.setAttribute("type", "text/javascript");
    vizFrame.head.appendChild(scriptEle);


    // success event 
  scriptEle.addEventListener("load", () => {
    console.log("File loaded");
    const script2 = document.createElement('script');
    script2.innerText = scriptContent;
    vizFrame.head.appendChild(script2);
  });
   // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });

 })


// init the editor
initEditor = (id, value, language, theme) => {
  const editorEle = getEle(id);
  const editor = monaco.editor.create(editorEle, { value, language, theme });
  return editor;
};
const content = `

<svg id="bargraph1" width="400" height="100" ></svg>
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" />
</svg>
  `;





const lang = "html";
const theme = "vs-dark";

const editor = initEditor("editor", content, lang, theme);
const getEditorContent = (editor) => editor.getValue();
editor.setValue(content);



//alert(editor.getValue());

Split([ "#editor", "#viz"], {
  sizes: [50, 50],
});

const query = location.search.substr(1);
let qresult = {};
query.split("&").forEach(function (part) {
  const item = part.split("=");
  qresult[item[0]] = decodeURIComponent(item[1]);
});

let inputSpec = "";
if (qresult.d) { inputSpec = qresult.d; }
if (qresult.s) { inputSpec = atob(qresult.s); 
  editor.setValue(inputSpec);
}

editor.onDidChangeModelContent(() => {
  console.log(vizFrame.body.innerHTML);
  vizFrame.body.innerHTML = editor.getValue();
});

const render = async (input) => {
  if (!input) return;
  if (inputSpec.trim().length > 0) return; // already got it via qresult.s 

  async function fetchSpecFile(input) {
    try {
      const response = await fetch(input);
      const json = await response.json();
      if (response.status === 200) return json;
      else null;
    } catch (e) {
      alert("Error: " + e);
      throw "Error: " + e;
    }
  }
  const spec = await fetchSpecFile(input);

  if (!spec) {
    alert("No lines in the given file");
    throw "No lines in the given file";
  }
  editor.setValue( JSON.stringify(spec, null, 4));
  renderBtn.click();
};

render(inputSpec);


renderBtn.addEventListener("click", (e) => {
  vizFrame.body.innerHTML = editor.getValue();
 });
//----
const htmlUtil = new HtmlUtil();

async function doRender() {
   // await vegaEmbed("#viz", JSON.parse(editor.getValue()));
  }

editor.addAction({
    id: "vizRender",
    label: "Viz: Render",
    run: doRender
});


// read file
const readSingleFile = (e, editor) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    let contents = "";
    const reader = new FileReader();
    reader.onload = function (e) {
      contents = e.target.result;
      editor.setValue(contents);
    };
    reader.readAsText(file);
    renderBtn.click();

  };
getEle("inputfile").onchange = (e) => {
    readSingleFile(e, editor);
};

const saveEle = getEle("save");
const saveFileNameEle = getEle("savefilename");

const saveSourceToFile = (editor, saveFileNameEle) => {
  const fileContent = editor.getValue();
  const textFileAsBlob = new Blob([fileContent], { type: "text/plain" });

  const downloadLink = document.createElement("a");
  downloadLink.download = saveFileNameEle.value;
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

saveEle.addEventListener("click", (e) => {
    saveSourceToFile(editor, saveFileNameEle);
});

 