// xmlst.mjs
// mchinnappan

Split(["#menu", "#content", '#result'], { sizes: [33, 33, 34] });
const getEle = id => document.getElementById(id);

const xmlEle = getEle('xml');
const xslEle = getEle('xsl');
const newTabBtn = getEle('newTab');

const iframe = document.getElementById("result-iframe");
const transformBtn = getEle('transform');

const packageUrl =
    "https://raw.githubusercontent.com/mohan-chinnappan-n/xml-xslt/main/package.xml";
const packageXSLUrl =
    "https://raw.githubusercontent.com/mohan-chinnappan-n/xml-xslt/main/package.xslt";

async function fetchText(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
}

const packageData = await fetchText(packageUrl);
xmlEle.value = packageData;
const packageXSLData = await fetchText(packageXSLUrl);
xslEle.value = packageXSLData;

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