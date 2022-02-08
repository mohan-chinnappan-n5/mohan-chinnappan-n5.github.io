getEle = id => document.getElementById(id);

// init the editor
initEditor = (id, value, language, theme) => {
    const editorEle = getEle(id);
    const editor = monaco.editor.create(editorEle, { value, language, theme });
    return editor;
};


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
let lang = params['l'] || 'xml';
let theme = params['t'] || 'vs-dark';
const content = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" id="gift" name="Credit gift" namespace="http://camunda.org/schema/1.0/dmn">
  <dmndi:DMNDI>
    <dmndi:DMNDiagram id="DMNDiagram_1ejukud" />
  </dmndi:DMNDI>
</definitions>
`
const editor = initEditor('editor', content, lang, theme );
const getEditorContent = (editor) => editor.getValue();
