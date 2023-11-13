// xml2json.js
// mohan chinnappan

Split(["#xml", "#content", "#je"], { sizes: [33, 33, 33] });

const downloadButton = document.getElementById('download-button');
const initXML =
    `<yield>
    <fruits>
     <fruit>Mango</fruit>
     <fruit>Peach</fruit>
     <fruit>Plum</fruit>
    </fruits>
     
</yield>
`;

const jqScript = 
`
input=~/Downloads/fp-1.json
numberRegions=\`cat  $input| jq '.FlexiPage.flexiPageRegions' | jq 'length'\`
echo "=== number of Regions = $numberRegions ==="
for ((i = 0; i < $numberRegions; i++)); do
    cat  $input |   jq -c --argjson i "$i"    '.FlexiPage.flexiPageRegions[$i].itemInstances.componentInstance.componentName'
done`;


let xmlEditor;
let jsonEditor;

// create the editor
const container = document.getElementById('jsoneditor')
const options = {
    mode: 'tree',
    modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
    onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode)
    },
    autocomplete: {
        applyTo: ['value'],
        filter: 'contain',
        trigger: 'focus',
        getOptions: function (text, path, input, editor) {
            return new Promise(function (resolve, reject) {
                const options = extractUniqueWords(editor.get())
                if (options.length > 0) {
                    resolve(options)
                } else {
                    reject()
                }
            })
        }
    }
}

// helper function to extract all unique words in the keys and values of a JSON object
function extractUniqueWords(json) {
    return _.uniq(_.flatMapDeep(json, function (value, key) {
        return _.isObject(value)
            ? [key]
            : [key, String(value)]
    }))
}

const editor = new JSONEditor(container, options)


require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    xmlEditor = monaco.editor.create(document.getElementById('editor-xml'), {
        value: initXML,
        language: 'xml',
        theme: 'vs-dark'
    });

    jsonEditor = monaco.editor.create(document.getElementById('editor-json'), {
        value: '',
        language: 'json',
        theme: 'vs-dark'
    });



    const x2js = new X2JS();
    function convertXmlToJson() {
        const xmlValue = xmlEditor.getValue();
        try {

            const jsonObj = x2js.xml_str2json(xmlValue);
            jsonEditor.setValue(JSON.stringify(jsonObj, null, 4));
            editor.set(jsonObj);
            if (jsonObj.FlexiPage) {
                document.getElementById('jq').value = jqScript;
                document.getElementById('jq').style.display = 'block';

            }
        } catch (error) {
            console.error('Error converting XML to JSON:', error);
            jsonEditor.setValue('Error converting XML to JSON');
        }
    }
    xmlEditor.onDidChangeModelContent(convertXmlToJson);

    convertXmlToJson();




    //--------
    function downloadJson() {
        const jsonContent = jsonEditor.getValue();
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadButton.addEventListener('click', downloadJson);



});



const jsonFileInput = document.getElementById("jsonFileInput");
jsonFileInput.addEventListener("change", function (event) {
    var file = event.target.files[0];
    originalFileName = file.name;

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            xmlEditor.setValue(content);
        }
    };
    reader.readAsText(file);
});




// Function to handle file drop
function handleFileDrop(e) {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];
        // Store the original uploaded file name
        originalFileName = file.name;

        // Check if the dropped file is a text file (you can adjust the condition)
        const reader = new FileReader();

        reader.onload = function (event) {
            const fileContent = event.target.result;
            xmlEditor.setValue(fileContent);
        };

        reader.readAsText(file);
    }
}

// Function to prevent the default behavior of drag-and-drop
function preventDefault(e) {
    e.preventDefault();
}

// Add event listeners to the drop area
const dropArea = document.getElementById("dropArea");
dropArea.addEventListener("dragenter", preventDefault, false);
dropArea.addEventListener("dragover", preventDefault, false);
dropArea.addEventListener("drop", handleFileDrop, false);
