// medit.js
// mchinnappan

Split(["#menu", "#content"], { sizes: [60, 40] });

const code = `

`
//=============


/// read file
const readSingleFile = (e) => {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  let contents = "";
  const reader = new FileReader();
  reader.onload = function (e) {
    contents = e.target.result;
    editor.setValue(contents)
  };
  reader.readAsText(file);
};

document.getElementById("file-input").onchange = function (e) {
  readSingleFile(e);
};
document.getElementById("file-input").onclick = function (e) {
  readSingleFile(e);
};