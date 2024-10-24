/*
-----------------------------

XML delta app 

- mchinnappan

-----------------------------
*/

import { sectionsObj, xmlxsltMap, selectionMap } from "./lib/SectionsData.mjs";
import { DeltaUtil } from "./lib/DeltaUtil.mjs";

Split(["#menu", "#content"], { sizes: [60, 40] });

const getEle = (id) => document.getElementById(id);
const xmlInEle = getEle("xml-in");
const jsonEle = getEle("json");
const convertBtn = getEle("convert");

const xmlInEle2 = getEle("xml-in2");
const jsonEle2 = getEle("json2");
const convertBtn2 = getEle("convert2");

const compareBtn = getEle("compare");
const diffEle = getEle("diff");

const supportedTypes = Object.keys(sectionsObj);
console.log(supportedTypes);

let mTypeInput = "Profile"; // default
let params = new URL(document.location).searchParams;
if (params.get("t") !== null) {
  const t = params.get("t");
  if (supportedTypes.includes(t)) mTypeInput = params.get("t");
}
getEle("mtype").innerHTML = mTypeInput;

async function fetchText(url) {
  const response = await fetch(url);
  const content = await response.text();
  return content;
}

async function loadData(selection) {
  const sel = xmlxsltMap[selection];
  const packageUrl = `https://raw.githubusercontent.com/mohan-chinnappan-n/xml-xslt/main/${selectionMap[sel]}.xml`;
  const data = await fetchText(packageUrl);
  xmlInEle.value = data;
  xmlInEle2.value = data;
}

await loadData(mTypeInput);

const x2j = new DeltaUtil(mTypeInput);

convertBtn.addEventListener("click", (event) => {
  const json = x2j.xml2json(xmlInEle.value);
  jsonEle.value = JSON.stringify(json, null, 4);
});

convertBtn2.addEventListener("click", (event) => {
  const json = x2j.xml2json(xmlInEle2.value);
  jsonEle2.value = JSON.stringify(json, null, 4);
});

convertBtn.click();
convertBtn2.click();

compareBtn.addEventListener("click", (event) => {
  const mType = x2j.getMType();
  const sections = Object.keys(sectionsObj[mType]);
  let diffResult = "";

  const jsonObj1 = JSON.parse(jsonEle.value);
  const jsonObj2 = JSON.parse(jsonEle2.value);

  for (const section of sections) {
    if (section !== "layoutAssignments") {
      // TODO
      const items1 = x2j.getSection(section, mType, jsonObj1);
      const items2 = x2j.getSection(section, mType, jsonObj2);

      const deltaInfo = x2j.findDeltas(
        section,
        items1,
        items2,
        sectionsObj[mType][section]
      );
      diffResult += x2j.deltaInfo2XML(deltaInfo);
    }
  }
  diffEle.value = x2j.addWrapper(diffResult);
});
compareBtn.click();

// input file reading
// read file
const readSingleFile = (e, to) => {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  let contents = "";
  const reader = new FileReader();
  reader.onload = function (e) {
    contents = e.target.result;
    to.value = contents;
  };
  reader.readAsText(file);
};

getEle('file-input1').onchange = function(e) {
    readSingleFile(e, xmlInEle);
}
getEle('file-input1').onclick = function(e) {
    readSingleFile(e, xmlInEle);
}

getEle('file-input2').onchange = function(e) {
    readSingleFile(e, xmlInEle2);
}
getEle('file-input2').onclick = function(e) {
    readSingleFile(e, xmlInEle2);
}

