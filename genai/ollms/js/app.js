//-------------------------
//app.js
// mohan chinnappan
//-------------------------


Split(["#prompt", "#response"], {
    sizes: [30, 70],
});


require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    // Initialize Monaco editor
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: 'markdown',
        theme: 'vs-dark',
        wordWrap: 'on' // Enable word wrap

    });

    // Fetch model names and populate dropdown
    axios.get('http://localhost:11434/api/tags')
        .then(function (response) {
            const models = response.data.models;
            const select = document.getElementById('modelName');
            models.forEach(function (model) {
                const option = document.createElement('option');
                option.value = model.name;
                option.textContent = model.name;
                select.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error('Error fetching model names:', error);
        });

});
// OLLAMA_ORIGINS=https://mohan-chinnappan-n5.github.io/*  ollama serve

function fetchResponse() {
    // Show spinner
    document.getElementById('spinner').style.display = 'inline-block';


    // Get user input from textarea
    const prompt = document.getElementById('markdownInput').value;
    // Get selected model name from dropdown
    const modelName = document.getElementById('modelName').value;
    // Record start time
    const startTime = performance.now();


    // Fetch response from service
    axios.post('http://localhost:11434/api/generate',  {
        model: modelName,
        prompt: prompt,
        stream: false
    })
        .then(function (response) {
            // Hide spinner
            document.getElementById('spinner').style.display = 'none';
            // Record end time
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);
            // Display response time
            document.getElementById('responseTime').textContent = 'Response time: ' + duration + ' ms';


            // Render response in Monaco editor
            const responseData = response.data;
            const responseText = responseData.response;
            const editor = monaco.editor.getModels()[0];
            editor.setValue(responseText);
        })
        .catch(function (error) {
            console.error('Error fetching response:', error);

            // Hide spinner in case of error
            document.getElementById('spinner').classList.add('hide');
        });
}