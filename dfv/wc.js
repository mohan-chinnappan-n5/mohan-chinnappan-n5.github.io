// word cloud
// mohan chinnappan

const getEle = id => document.getElementById(id);

const WC_MAX_LENGTH = 40000;
let text = "This is the time for all good men to go for the aid of the country";  

Split([ "#content", "#htmlContent"], { sizes: [50, 50] });

const urlParams = new URLSearchParams(window.location.search);
//console.log(urlParams.get('c'))

let editor;


// editor setup
//Function to set Monaco Editor's language mode based on the file extension
function setEditorLanguage(extension) {
  const supportedLanguages = monaco.languages.getLanguages();

  const languageId = supportedLanguages.find((lang) =>
    lang.extensions?.includes(`.${extension}`)
  );

  if (languageId) {
    monaco.editor.setModelLanguage(editor.getModel(), languageId.id);
  }
}

require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs" },
});


text  = `
People who are really serious about software should make their own hardware
- Alan Kay

All truely great things are simple
- Albert Einstein
`;


require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: text,
    language: "html",
    theme: "vs-dark",
  });

   // Handle content change event
  editor.onDidChangeModelContent(function () {
    getEle('drawWC').click();
  });

});

getEle('drawWC').style.display = 'block';

if (urlParams.has('c')) {
  await navigator.clipboard.readText().then((clipText) => {
    text = clipText;
  });
}
if (urlParams.has('d')) {
    text = atob(urlParams.get('d'));
    // editor.setValue(text);
}


async function drawWC(text) {
  const wcSpecUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/vega/wc.json';
	const getWCSpec = async (url) => {
		const response = await fetch(url);
		return response.json(); 
	}
	const data = await getWCSpec(wcSpecUrl);
  data.data[0].values[0] = text;  
	vegaEmbed('#wc', data);
}


getEle('drawWC').addEventListener('click', event => {
  drawWC(editor.getValue());
});

getEle('drawWC').click();
