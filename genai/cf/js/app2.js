// app.js
// commit scripts gen 
// mohan chinnappan

const getEle = (id) => document.getElementById(id);
Split(["#code", "#content", "#results"], {
    sizes: [10, 35, 55],
});

  // Record the start time when the DOMContentLoaded event is fired
  document.addEventListener('DOMContentLoaded', function() {
    const domContentLoadedTime = performance.now();
    console.log(`DOM Loaded Time: ${domContentLoadedTime} milliseconds`);
  });

  // Record the start time when the load event is fired
  window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page Load Time: ${loadTime} milliseconds`);

    // Now the page is ready for user interaction
    const readyForInteractionTime = performance.now();
    console.log(`Ready for User Interaction Time: ${readyForInteractionTime} milliseconds`);
  });


  let editor;
let resultsEditor, resultsEditor2;
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: "Write Salesforce SOQL to get the Contacts in a given Account",
        language: "text",
        theme: "vs-dark",
        automaticLayout: true
    });
    resultsEditor = monaco.editor.create(document.getElementById('resultsEditor'), {
        value: `{ "results": "LLM Response comes here" }`,
        language: "json",
        theme: "vs-dark",
        automaticLayout: true
    });
    resultsEditor2 = monaco.editor.create(document.getElementById('resultsEditor2'), {
        language: "markdown",
        theme: "vs-dark",
        automaticLayout: true
    });

    async function run(model, prompt, ACCOUNT_ID, API_TOKEN, proxyServer) {

       const payload =  {
            "ACCOUNT_ID": ACCOUNT_ID,
            "API_TOKEN": API_TOKEN ,
            "model": model,
            "prompt": prompt 
        }
        // console.log(payload)
        const messages = [
            { role: "user", content: prompt },
        ];
    
        const response = await fetch( `${proxyServer}`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( payload ),
            }
        );
        const result = await response.json();
        return result;
    }


    // Event listener for the "Create Script" button
    getEle('run').addEventListener('click',  async function () {
        const accountId = getEle('accountId').value;
        const apiToken = getEle('apiToken').value ;
        const model = getEle('model').value; 
        const proxyServer = getEle('proxyServer').value; 
        
        // Store input in localStorage
        const data = { accountId, apiToken, model, proxyServer}; 
        localStorage.setItem('llmData', JSON.stringify(data));
        const prompt = editor.getValue();
        const results = await run(model, prompt, accountId, apiToken, proxyServer);
        resultsEditor.setValue(JSON.stringify(results, null, 4));
        if (results.success) resultsEditor2.setValue(results.result.response);



        
    });

    // Load previous input from localStorage
    const savedData = JSON.parse(localStorage.getItem('llmData'));
    if (savedData) {
        getEle('accountId').value = savedData.accountId;
        getEle('apiToken').value = savedData.apiToken;
        getEle('model').value = savedData.model;
    }
});


