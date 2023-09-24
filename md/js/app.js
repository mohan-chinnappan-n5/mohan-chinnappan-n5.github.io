//----------------------------
// Markdown Editor 
// mohan chinnappan
//----------------------------
Split([ "#content", "#htmlContent"], { sizes: [50, 50] });

let initData = `
# Animals
## Donkeys
## Horses
## Mules
## Ponies
- For kids
    - Friendly with kids
![Compare](https://www.greensboroughvets.com.au/images/mule.jpg)

`;
// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('c')) {
  await navigator.clipboard.readText().then((clipText) => {
    initData = clipText;
  });
}


const getEle = (id) => document.getElementById(id);




let editor; // Declare editor variable in a global scope

const preview = document.getElementById('preview');
const converter = new showdown.Converter({tables: true});


// Initialize Monaco Editor
require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.24.0/min/vs",
  },
});
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: JSON.stringify(initData, null, 4),
    language: "markdown",
    theme: "vs-dark",
  });

  editor.setValue(initData);


  function updatePreview() {
    var markdownText = editor.getValue();
    preview.innerHTML =  converter.makeHtml(markdownText); // You need to include the 'marked' library
  }

  editor.onDidChangeModelContent((event) => {
    updatePreview();
  });

  // Initialize the preview
  updatePreview();

});


//------ auto complete ---
async function fetchText(url) {
  const response = await fetch(url);
  const content = await response.text();
  return content;
}


let typeSelected = "package";

const repoUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n/project-docs';
const listDwg = await fetchText(`${repoUrl}/main/sf/list.txt`);
console.log(listDwg);
const selectionMap = listDwg.trim().split('\n');

async function loadData(selection) {
  const packageUrl = `${repoUrl}/main/sf/${selection}`;
  const packageData = await fetchText(packageUrl);
  editor.setValue(packageData);

}


const acConfigMtype = {
  placeHolder: "Search for chart data...",
  selector: "#autoCompleteMtype",
  data: {
      src: selectionMap
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



