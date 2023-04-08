// render.js
// mohan chinnappan 

const getEle = (id) => document.getElementById(id);

const specEle = getEle("spec");
const renderBtn = getEle("render");
const loadBtn = getEle("load");

// init the editor
initEditor = (id, value, language, theme) => {
  const editorEle = getEle(id);
  const editor = monaco.editor.create(editorEle, { value, language, theme });
  return editor;
};
const content = `
{
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A simple bar chart with embedded data.",
    "data": {
      "values": [
        {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
        {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
        {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
      ]
    },
    "mark": "bar",
    "encoding": {
      "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
      "y": {"field": "b", "type": "quantitative"}
    }
}
  `;
const lang = "json";
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
  vegaEmbed("#viz", JSON.parse(editor.getValue()));
});
//----
const htmlUtil = new HtmlUtil();

async function doRender() {
    await vegaEmbed("#viz", JSON.parse(editor.getValue()));
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

 