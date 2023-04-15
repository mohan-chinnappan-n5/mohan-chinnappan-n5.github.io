// xmlst.mjs
// mchinnappan




import { XMLTypes } from "./xmlTypes.js";

const selectionMap = {
    'profile3': 'Admin.profile-meta',
    'permissionset3': 'Experience_Profile_Manager.permissionset-meta',
    'package': 'package',
    'customlabel2': 'CustomLabels.labels-meta',
    'customlabel3': 'CustomLabels.labels-meta',
    'flexipage': 'flexipage',
    'samlrequest': 'samlrequest',
    'samlresponse': 'samlresponse',
    'pmd-report-v2': "pmd-report",
    'pmd-ruleset': "apex_ruleset"
}


Split(["#menu", "#content", '#result'], { sizes: [33, 33, 34] });






let typeSelected = "package";

const acConfigMtype = {
  placeHolder: "Search for XML Type...",
  selector: "#autoCompleteMtype",
  data: {
    src: XMLTypes.getSupported(),
  },
  resultItem: {
    highlight: true,
  },

  resultsList: {
    element: (list, data) => {
      const info = document.createElement("p");
      if (data.results.length) {
        info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
      } else {
        info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
      }
      list.prepend(info);
    },

    noResults: true,
    maxResults: 15,
    tabSelect: true,
  },

  events: {
    input: {
      selection: async (event) => {
        const selection = event.detail.selection.value;
        autoCompleteJSMtype.input.value = selection;
        typeSelected = selection;
        await loadData(typeSelected);

      },
    },
  },
};
const autoCompleteJSMtype = new autoComplete(acConfigMtype);

const getEle = id => document.getElementById(id);

const xmlEle = getEle('xml');
const xslEle = getEle('xsl');
const newTabBtn = getEle('newTab');

const iframe = document.getElementById("result-iframe");
const transformBtn = getEle('transform');


async function fetchText(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
}

// input file reading
// read file
const readSingleFile = (e, to) => {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    let contents = "";
    const reader = new FileReader();
    reader.onload = function(e) {
      contents = e.target.result;
      to.value = contents;
  
    };
    reader.readAsText(file);
  }


getEle('file-input').onchange = function(e) {
    readSingleFile(e, xmlEle);
  }
  getEle('file-input').onclick = function(e) {
    readSingleFile(e, xmlEle);
  }

  getEle('xsl-input').onchange = function(e) {
    readSingleFile(e, xslEle);
  }
  getEle('xsl-input').onclick = function(e) {
    readSingleFile(e, xslEle);
  }


async function loadData(selection) {
    const packageUrl =
    `https://raw.githubusercontent.com/mohan-chinnappan-n/xml-xslt/main/${selectionMap[selection]}.xml`;
    const packageXSLUrl =
    `https://raw.githubusercontent.com/mohan-chinnappan-n/xml-xslt/main/${selection}.xslt`;

    const packageData = await fetchText(packageUrl);
    xmlEle.value = packageData;
    const packageXSLData = await fetchText(packageXSLUrl);
    xslEle.value = packageXSLData;
    transformBtn.click();

}

// first time
await loadData(typeSelected);


let resultString;

transformBtn.addEventListener('click', event => {
    const xml = xmlEle.value;
    const xsl = xslEle.value

    // Parse the XML document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');

    // Apply the XSLT stylesheet to the XML DOM tree
    const xsltProcessor = new XSLTProcessor();
    const xslDoc = parser.parseFromString(xsl, 'application/xml');
    xsltProcessor.importStylesheet(xslDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    resultString = new XMLSerializer().serializeToString(resultDoc);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(resultString);
    doc.close();

    newTabBtn.disabled = false;
});

transformBtn.click();

newTabBtn.addEventListener('click', event => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(resultString);
    newWindow.document.close();

});