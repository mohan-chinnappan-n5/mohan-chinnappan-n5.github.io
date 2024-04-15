// file diff editor 
// mohan chinnappan

let editor;
require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs",
  },
});
require(["vs/editor/editor.main"], () => {});


let ext = 'xml';
let inputFiles = [];

const getFileType = () => {
  for (const inputFile of inputFiles) {
    if (inputFile.includes('profile')) return 'profile';
    if (inputFile.includes('package')) return 'package';
    if (inputFile.includes('permissionset')) return 'permissionset';
  }
  return null;
}
// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('c')) {
  await navigator.clipboard.readText().then((clipText) => {
    document.getElementById('t1').value = clipText;
  });
}

const enableCompareButton = () => {
  const v1 = document.getElementById("t1").value;
  const v2 = document.getElementById("t2").value;
  // console.log(v1.trim().length, v2.trim().length);
  if (v1.trim().length > 0 && v2.trim().length > 0) {
    document.getElementById("compare").disabled = false;
  } else {
    document.getElementById("compare").disabled = true;
  }
}





// file management
const getUploadedFile =  async (event, id) => {
  const input = event.target;
  inputFiles.push(input.files[0].name);
  inputFiles = inputFiles.slice(-2);
  if ("files" in input && input.files.length > 0) {
	ext = input.files[0].name.split('.').slice(-1).pop() || 'xml'; 
	// console.log(ext);
    await placeFileContent(document.getElementById(id), input.files[0]);
	enableCompare();

  }
};
const placeFileContent = async (target, file) => {
  await readFileContent(file)
    .then((content) => {
      target.value = content;
    })
    .catch((error) => console.log(error));
};

const readFileContent = async (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

document.getElementById("file1").addEventListener("change", (event) => {
  getUploadedFile(event, "t1");
});

document.getElementById("file2").addEventListener("change", (event) => {
  getUploadedFile(event, "t2");
});


const  prettifyXml  =  (sourceXml) => {
  const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
  const xsltDoc = new DOMParser().parseFromString([
      // describes how we want to modify the XML - indent everything
      '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
      '  <xsl:strip-space elements="*"/>',
      '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
      '    <xsl:value-of select="normalize-space(.)"/>',
      '  </xsl:template>',
      '  <xsl:template match="node()|@*">',
      '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
      '  </xsl:template>',
      '  <xsl:output indent="yes"/>',
      '</xsl:stylesheet>',
  ].join('\n'), 'application/xml');

  const xsltProcessor = new XSLTProcessor();    
  xsltProcessor.importStylesheet(xsltDoc);
  const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  const resultXml = new XMLSerializer().serializeToString(resultDoc);
  return resultXml;
};

const xml2json = xml => {
  const x2js = new X2JS();
  return x2js.xml_str2json( xml );

}

 

const json2xml = (json) => {
  const x2js = new X2JS();
  return  prettifyXml(x2js.json2xml_str (json ));
}



document.getElementById("t1").addEventListener('input', event => enableCompareButton());
document.getElementById("t2").addEventListener('input', event => enableCompareButton()); 



enableCompare = () => {
  enableCompareButton();
  if (ext.toLowerCase() === 'xml')  document.getElementById("x2j").disabled = false;
  else document.getElementById("x2j").disabled = true;  
  if (getFileType())  document.getElementById("html").disabled = false;
};
  
document.getElementById("x2j").addEventListener('click', event => {
  document.getElementById("t1").value = JSON.stringify(xml2json(document.getElementById("t1").value), null, 4);
  document.getElementById("t2").value = JSON.stringify(xml2json(document.getElementById("t2").value), null, 4);
  document.getElementById("x2j").disabled = true;    
});

document.getElementById("j2x").addEventListener('click', event => {
  document.getElementById("t1").value = JSON.stringify(json2xml(document.getElementById("t1").value), null, 4);
  document.getElementById("t2").value = JSON.stringify(json2xml(document.getElementById("t2").value), null, 4); 
});

async function getXSLT(type) {
  const url = `https://raw.githubusercontent.com/mohan-chinnappan-n/xml-xslt/main/${type}.xslt`;
  const response = await fetch(url);
  const text = await response.text();
  return text;
}
// https://developer.mozilla.org/en-US/docs/Web/XSLT/XSLT_JS_interface_in_Gecko/Basic_Example
const xsltProcessor = new XSLTProcessor();
document.getElementById("html").addEventListener('click', async event => {
  const xml = document.getElementById("t1").value;
  // console.log(xml);
  const xsl = await getXSLT(getFileType());
  // console.log(xsl);

  /*
  let myXMLHTTPRequest = new XMLHttpRequest();
  const url = `./xslt/profile.xslt`;
  myXMLHTTPRequest.open("GET", url , false);
  myXMLHTTPRequest.send(null);
  xslStylesheet = myXMLHTTPRequest.responseXML;
  */

  //https://stackoverflow.com/questions/50350870/load-xml-and-xsl-from-variables-and-transform-in-the-browser
  const parser = new DOMParser();
  const xsl_doc = parser.parseFromString(xsl, "application/xml");
  const xml_doc = parser.parseFromString(xml, "application/xml");


  const proc = new XSLTProcessor();
  proc.importStylesheet(xsl_doc);
  const resultDocument = proc.transformToFragment(xml_doc, document);
  // console.log(resultDocument);
  // document.getElementById('body').appendChild(resultDocument);

});




document.getElementById("compare").addEventListener("click", (event) => {
  if (editor) {
    monaco.editor.getModels().forEach((model) => model.dispose());
    editor.dispose(); // ref: https://github.com/microsoft/monaco-editor/issues/672
  }

  editor = monaco.editor.createDiffEditor(document.getElementById("container"));
  editor.setModel({
    original: monaco.editor.createModel(
      document.getElementById("t1").value,
      ext
    ),
    modified: monaco.editor.createModel(
      document.getElementById("t2").value,
      ext
    ),
  });

});
