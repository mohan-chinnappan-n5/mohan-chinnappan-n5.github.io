/*
  class to provide HTML utils
  mohan chinnappan 2022
*/

class HtmlUtil {
  constructor() {}

  getEle = (id) => document.getElementById(id);

  // read file
  readSingleFile = (e, editor) => {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var contents = "";
    var reader = new FileReader();
    reader.onload = function (e) {
      contents = e.target.result;
      console.log(contents);
      editor.value = contents;
    };
    reader.readAsText(file);
  };

  // save to file
  saveSourceToFile = (editor, saveFileNameEle) => {
    const fileContent = editor.value;
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

  getUrlParams = () => {
    const query = location.search.substr(1);
    let qresult = {};
    query.split("&").forEach(function (part) {
      let item = part.split("=");
      qresult[item[0]] = decodeURIComponent(item[1]);
    });
    return qresult;
  };
}
