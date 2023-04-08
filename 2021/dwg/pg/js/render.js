// render.js

const getEle = (id) => document.getElementById(id);

const specEle = getEle("spec");
const renderBtn = getEle("render");

// init the editor
initEditor = (id, value, language, theme) => {
  const editorEle = getEle(id);
  const editor = monaco.editor.create(editorEle, { value, language, theme });
  return editor;
};
const content = `{ "name": "Apple"}`;
const lang = "json";
const theme = "dark";

const editor = initEditor("editor", content, lang, theme);
const getEditorContent = (editor) => editor.getValue();

Split(["#spec", "#editor", "#viz"], {
  sizes: [20, 25, 50],
});

const query = location.search.substr(1);
let qresult = {};
query.split("&").forEach(function (part) {
  const item = part.split("=");
  qresult[item[0]] = decodeURIComponent(item[1]);
});

let inputSpec = "";
if (qresult.d) {
  inputSpec = qresult.d;
}

const render = async (input) => {
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
  specEle.value = JSON.stringify(spec, null, 4);
  renderBtn.click();
};

render(inputSpec);

renderBtn.addEventListener("click", (e) => {
  vegaEmbed("#viz", JSON.parse(specEle.value));
});
