import { WIN_HEIGHT, WIN_WIDTH } from "./consts.js";

export class Utils {
  static setupAceEditor = (id, content, theme='monokai', mode='sql', fontSize='14pt', maxLines=1000) => {
    const aceEditor = ace.edit(id);
    aceEditor.setOptions({
      fontSize: fontSize,
      maxLines,
      autoScrollEditorIntoView: true,
      theme: `ace/theme/${theme}`,
      showPrintMargin: true,
      mode: `ace/mode/${mode}`,
      enableBasicAutocompletion: true,
    });

    aceEditor.$blockScrolling = Infinity;
    aceEditor.setValue(content);
    return aceEditor;
  };

  static xml2json = (xml) => {
    const x2js = new X2JS();
    return x2js.xml_str2json(xml);
  };

  static json2xml = (json) => {
    const x2js = new X2JS();
    return this.prettifyXml(x2js.json2xml_str(json));
  };

  static prettifyXml = (sourceXml) => {
    const xmlDoc = new DOMParser().parseFromString(
      sourceXml,
      "application/xml"
    );
    const xsltDoc = new DOMParser().parseFromString(
      [
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        "  </xsl:template>",
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        "  </xsl:template>",
        '  <xsl:output indent="yes"/>',
        "</xsl:stylesheet>",
      ].join("\n"),
      "application/xml"
    );

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
  };

  static downloadTextFile(text, outputFilename) {
    const blobText = new Blob([text], { type: "text/plain" });
    const downloadLink = document.createElement("a");
    downloadLink.download = outputFilename;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.webkitURL.createObjectURL(blobText);
    downloadLink.click();
  }

  static downloadZipFile(ZipText, outputFilename) {
    const zipContent = atob(ZipText);
    const length = zipContent.length;
    // make array
    const binArray = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      binArray[i] = zipContent.charCodeAt(i);
    }
    const blobZip = new Blob([binArray], { type: "application/zip" });
    const downloadLink = document.createElement("a");
    downloadLink.download = outputFilename;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.webkitURL.createObjectURL(blobZip);
    downloadLink.click();
  }

  // get all methods in a class
  static getAllMethodNames(obj) {
    let methods = new Set();
    while ((obj = Reflect.getPrototypeOf(obj))) {
      let keys = Reflect.ownKeys(obj);
      keys.forEach((k) => methods.add(k));
    }
    return methods;
  }

  static resizePopup() {
    window.onload = () => {
      document.body.style.minWidth = `${WIN_WIDTH}px`;
      document.body.style.minHeight = `${WIN_HEIGHT}px`;
    };
  }

  static setupDatatable(id) {
    $(`#${id}`).DataTable({
      dom: "Blfrtip",
      buttons: ["copy", "csv", "excel", "print"],
    });
  }

  static setupVega(length) {
    const barSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Chart",
      data: {
        values: [{ records: "Total Records", count: length }],
      },
      mark: { type: "bar", tooltip: true, orient: "horizontal" },
      encoding: {
        y: { field: "records", type: "nominal", axis: { labelAngle: 0 } },
        x: { field: "count", type: "quantitative" },
      },
    };

    vegaEmbed("#vizBar", barSpec);
  }

  static getUrlParams() {
    const params = new URLSearchParams(document.location.search);
    const sid = params.get("sid");
    const url = params.get("url");
    return { sid, url };
  }

  static getEle = (id) => document.getElementById(id);

  static setupSplit = (columns, sizes) => {
    Split(columns, { sizes });
  };

  //------
  constructor() {}
}
