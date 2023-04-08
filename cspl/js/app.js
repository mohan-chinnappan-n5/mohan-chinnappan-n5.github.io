/*
 app.js

 mohan chinnappan 2022

*/
const htmlUtil = new HtmlUtil();
const queryParams = htmlUtil.getUrlParams();
const getEle = htmlUtil.getEle;

// console.log(queryParams)
let activate = queryParams["a"] === "1" || false;

let timeout = queryParams["t"] || "30000";
let vsc = queryParams["vsc"] || 'f' ;

const initEditor = async (id, value, language, theme) => {
  const editorEle = getEle(id);
  // console.log(monaco);
  const editor = await monaco.editor.create(editorEle, { value, language, theme });
  editor.setValue(value);
  return editor;
};

const content = ` { } `;
const lang = "json";
const theme = "vs-dark";
let editor;
if (vsc !== 'f') { editor = await initEditor("editor", content, lang, theme);}


const listEle = getEle("list");
const runScriptEle = getEle("runScript");
const instanceURLEle = getEle("instanceURL");
const generateBtn = getEle("generate");
const saveEle = getEle("save");
const saveFileNameEle = getEle("savefilename");
const loginEle = getEle("login");
loginEle.href = instanceURLEle.value;

instanceURLEle.addEventListener("change", (e) => {
  loginEle.href = instanceURLEle.value;
});

getEle("inputfile").onchange = (e) => {
  htmlUtil.readSingleFile(e, listEle);
  runScriptEle.value = "";
  if (vsc !== 'f') editor.setValue("");


};
saveEle.addEventListener("click", (e) => {
  htmlUtil.saveSourceToFile(runScriptEle, saveFileNameEle);
});

Split(["#list", "#runScript" , '#editor'], {
  sizes: [20, 60, 20],
});
// --------------

const sampleInput = `NO|Norway|NO-03|3|Oslo
NO|Norway|NO-11|11|Rogaland
NO|Norway|NO-15|15|Møre og Romsdal
NO|Norway|NO-18|18|Nordland`;

listEle.value = sampleInput;

const generateScript = () => {
  const listValue = listEle.value;
  let listItems = listValue.split("\n");
  // console.log(listItems);
  let allItems = [];
  for (const item of listItems) {
    allItems.push(item.split("|"));
  }
  //console.log(allItems);

  const instanceUrl =
    instanceURLEle.value || "https://d4x000007rxogeaq-dev-ed.my.salesforce.com";

  const sfCSPL = new CSPL("CSPL - Kalam", instanceUrl, parseInt(timeout));
  let output = sfCSPL.processList(allItems);

  if (activate) {
    output = sfCSPL.processActivateAll(allItems);
  }
  // console.log(output);
   runScriptEle.value = JSON.stringify(output, null, 4);
   if (vsc !== 'f') editor.setValue(JSON.stringify(output, null, 4));
};

generateBtn.addEventListener("click", (event) => {
  generateScript();
});
generateBtn.click();
