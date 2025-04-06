// js/codegenApp2.js
// Mohan Chinnappan

// Initialize split layout using the global Split function
Split(["#left", "#right"], { sizes: [40, 60] });

// Utility to get DOM element by ID
const getEle = id => document.getElementById(id);

// Query parameter parser
const getQueryParams = () => {
  const query = location.search.substr(1);
  let result = {};
  query.split("&").forEach(part => {
    const item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
};

// Standard LWC Templates
const templates = {
  uiAPI: (object, fields) => {
    const objectCased = object[0].toLowerCase() + object.slice(1);
    let markupFields = "";
    let getters = "";
    let fieldCode = "";
    fields.forEach(field => {
      markupFields += `<p class="slds-p-horizontal_small"><b>${field.toLowerCase()}</b>: {${field.toLowerCase()}}</p>`;
      fieldCode += `'${object}.${field}',`;
      getters += `\n    get ${field.toLowerCase()}() {\n        return this.${object.toLowerCase()}.data.fields.${field}.value;\n    }\n`;
    });
    const markup = `
<template>
    <lightning-card title="${object} Record" icon-name="standard:${object.toLowerCase()}">
        <template if:true={${object.toLowerCase()}.data}>
            ${markupFields}
        </template>
    </lightning-card>
</template>
    `;
    const compMetadata = `
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__AppPage</target>
        <target>lightning__HomePage</target>
        <target>lightningCommunity__Page</target>
        <target>lightningCommunity__Default</target>
    </targets>
</LightningComponentBundle>
    `;
    const compJS = `
import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [ ${fieldCode} ];

export default class WireGetRecord${object} extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    ${object.toLowerCase()};

    ${getters}
}
    `;
    return [
      { name: `${objectCased}.html`, content: markup, language: 'html' },
      { name: `${objectCased}.js`, content: compJS, language: 'javascript' },
      { name: `${objectCased}.js-meta.xml`, content: compMetadata, language: 'xml' }
    ];
  },
  apexWire: (object, fields, query) => {
    const objectCased = object[0].toLowerCase() + object.slice(1);
    let columns = '';
    fields.forEach(field => {
      columns += `{ label: '${field.trim()}', fieldName: '${field.trim()}' },\n`;
    });
    const markup = `
<template>
    <lightning-card title="${object} Datatable" icon-name="standard:${object.toLowerCase()}">
        <template if:true={${object.toLowerCase()}s.data}>
            <lightning-datatable
                key-field="id"
                data={${object.toLowerCase()}s.data}
                columns={columns}>
            </lightning-datatable>
        </template>
    </lightning-card>
</template>
    `;
    const compMetadata = `
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__AppPage</target>
        <target>lightning__HomePage</target>
        <target>lightningCommunity__Page</target>
        <target>lightningCommunity__Default</target>
    </targets>
</LightningComponentBundle>
    `;
    const compJS = `
import { LightningElement, wire } from 'lwc';
import get${object}List from '@salesforce/apex/${object}Controller.get${object}List';

export default class ApexWireGetRecords${object} extends LightningElement {
    columns = [
        ${columns}
    ];

    @wire(get${object}List)
    ${object.toLowerCase()}s;
}
    `;
    const apex = `
// ${object}Controller.cls
public with sharing class ${object}Controller {    
    @AuraEnabled(cacheable=true)
    public static List<${object}> get${object}List() {
        return [
            ${query}
        ];
    }
}
    `;
    const apexMetadata = `
<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <status>Active</status>
</ApexClass>
    `;
    return [
      { name: `${objectCased}Controller.cls`, content: apex, language: 'java' },
      { name: `${objectCased}Controller.cls-meta.xml`, content: apexMetadata, language: 'xml' },
      { name: `${objectCased}.html`, content: markup, language: 'html' },
      { name: `${objectCased}.js`, content: compJS, language: 'javascript' },
      { name: `${objectCased}.js-meta.xml`, content: compMetadata, language: 'xml' }
    ];
  },
  apexREST: (object, query) => {
    const apex = `
// ${object}RESTController.cls
@RestResource(urlMapping='/${object}s/*')
global with sharing class ${object}RESTController {
    @HttpGet
    global static ${object} get${object}ById() {
        RestRequest request = RestContext.request;
        String ${object.toLowerCase()}Id = request.requestURI.substring(
            request.requestURI.lastIndexOf('/')+1
        );
        ${object} result = [${query} WHERE Id = :${object.toLowerCase()}Id];
        return result;
    }
}
    `;
    return [
      { name: `${object}RESTController.cls`, content: apex, language: 'java' }
    ];
  },
  tcrm: (object, fields, query) => {
    const objectCased = object[0].toLowerCase() + object.slice(1);
    let markupFields = "";
    fields.forEach(field => {
      markupFields += `<p>{${field.toLowerCase()}}</p>`;
    });
    const dashboard = `
"steps": {
    "lens_1": {
        "type": "soql",
        "query": "${query}",
        "numbers": [],
        "strings": [],
        "groups": [],
        "selectMode": "single"
    }
},
    `;
    const markup = `
<template>
    <p>Hello World - {title}</p>
    <h3>Results from Query</h3>
    <p>{output}</p>
</template>
    `;
    const compMetadata = `
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>61.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>TCRM LWC</masterLabel>
    <description>LWC component</description>
    <targets>
        <target>analytics__Dashboard</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="analytics__Dashboard">
            <hasStep>true</hasStep>
            <property name="title" type="String" label="My Title" required="true"></property>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
    `;
    const compJS = `
import { LightningElement, api } from 'lwc';

export default class TCRM extends LightningElement {
    @api title = "LWC!";
    @api results;

    get output() {
        return JSON.stringify(this.results, null, 4);
    }
}
    `;
    return [
      { name: `dashboard.json`, content: dashboard, language: 'json' },
      { name: `${objectCased}.html`, content: markup, language: 'html' },
      { name: `${objectCased}.js`, content: compJS, language: 'javascript' },
      { name: `${objectCased}.js-meta.xml`, content: compMetadata, language: 'xml' }
    ];
  }
};

// Clean fields from SOQL query
const getCleanedFields = fields => fields.split(',').map(field => field.trim());

// Monaco Editor instances
let editors = [];
let mdEditor;  // Monaco Editor instance for SOQL Query
let execEditor; // Monaco Editor instance for RegEx Results

// Function to initialize Monaco Editor for a file
const initializeEditor = (containerId, content, language) => {
  const container = getEle(containerId);
  const editor = monaco.editor.create(container, {
    value: content,
    language: language,
    theme: 'vs-dark',
    automaticLayout: true,
    readOnly: false,
    minimap: { enabled: true },
  });
  return editor;
};

// Function to create tabs and editors for generated files
const displayGeneratedFiles = (files) => {
  const tabsContainer = getEle('tabs');
  const editorsContainer = getEle('editors');
  tabsContainer.innerHTML = '';
  editorsContainer.innerHTML = '';
  editors = [];

  files.forEach((file, index) => {
    // Create tab
    const tab = document.createElement('div');
    tab.className = `tab ${index === 0 ? 'active' : ''}`;
    tab.textContent = file.name;
    tab.dataset.index = index;
    tabsContainer.appendChild(tab);

    // Create editor container
    const editorContainer = document.createElement('div');
    editorContainer.id = `editor-${index}`;
    editorContainer.className = `editor-container tab-content ${index === 0 ? 'active' : ''}`;
    editorsContainer.appendChild(editorContainer);

    // Create download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mt-2';
    downloadBtn.textContent = `Download ${file.name}`;
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up
    });
    editorContainer.appendChild(downloadBtn);

    // Initialize Monaco Editor
    const editor = initializeEditor(`editor-${index}`, file.content, file.language);
    editors.push({ editor, content: file.content, name: file.name });
  });

  // Add tab click handlers
  tabsContainer.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      editorsContainer.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active'));
      tab.classList.add('active');
      getEle(`editor-${tab.dataset.index}`).classList.add('active');
    });
  });
};

// Function to generate code and display in editors
const generateCode = (template, query, fields, object) => {
  const files = templates[template](object, fields, query.trim());
  displayGeneratedFiles(files);
  return files;
};

// Function to download all files
const downloadAllAsZip = (files) => {
  files.forEach(file => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
  });
  alert('All files have been downloaded individually (ZIP functionality requires JSZip library).');
};

// Initialize the app
const init = async () => {
  // Load Monaco Editor
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' } });
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'json') return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/language/json/json.worker.js';
      if (label === 'javascript') return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/language/typescript/ts.worker.js';
      if (label === 'html') return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/language/html/html.worker.js';
      return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/editor/editor.worker.js';
    }
  };
  require(['vs/editor/editor.main'], () => {
    // Monaco Editor is loaded, proceed with initialization
    initializeApp();
  });
};

// Main app initialization
const initializeApp = async () => {
  // Handle query parameters
  let params = getQueryParams();
  let soql = `
SELECT Id, Name 
FROM Account
  `.trim();
  if (params.d) {
    soql = atob(params.d);
  }

  // Handle clipboard input
  const qparams = new URLSearchParams(window.location.search);
  const c = qparams.get('c');
  if (c !== null) {
    const clipText = await navigator.clipboard.readText();
    soql = clipText.replace(/\n/g, " ");
  }

  // Initialize Monaco Editors for left pane
  mdEditor = monaco.editor.create(getEle('md-editor'), {
    value: soql,
    language: 'sql', // Use SQL language for SOQL
    theme: 'vs-dark',
    automaticLayout: true,
    readOnly: false,
    minimap: { enabled: false }
  });

  execEditor = monaco.editor.create(getEle('exec-editor'), {
    value: '',
    language: 'json', // Use JSON language for RegEx results
    theme: 'vs-dark',
    automaticLayout: true,
    readOnly: true,
    minimap: { enabled: false }
  });

  // RegEx input change handler
  getEle('regex').addEventListener('change', event => {
    const reSOQL = new RegExp(event.target.value, 'gmi');
    const input = mdEditor.getValue(); // Get value from Monaco Editor
    const reResults = reSOQL.exec(input);
    execEditor.setValue(JSON.stringify(reResults, null, 4)); // Set value in Monaco Editor
  });

  // SOQL input change handler
  mdEditor.onDidChangeModelContent(() => {
    const input = mdEditor.getValue(); // Get value from Monaco Editor
    const reSOQL = new RegExp(getEle('regex').value, 'gmi');
    const reResults = reSOQL.exec(input);
    execEditor.setValue(JSON.stringify(reResults, null, 4)); // Set value in Monaco Editor
  });

  // Template selector change handler
  getEle('template-select').addEventListener('change', event => {
    const template = event.target.value;
    const input = mdEditor.getValue(); // Get value from Monaco Editor
    const reSOQL = new RegExp(getEle('regex').value, 'gmi');
    const reResults = reSOQL.exec(input);
    if (reResults) {
      const [query, fields, object] = reResults;
      execEditor.setValue(JSON.stringify(reResults, null, 4)); // Set value in Monaco Editor
      const files = generateCode(template, query, getCleanedFields(fields), object);
      getEle('download-all-btn').onclick = () => downloadAllAsZip(files);
    }
  });

  // Copy to Clipboard button handler (copies the active editor's content)
  getEle('copy-code-btn').addEventListener('click', () => {
    const activeEditor = editors.find(e => getEle(`editor-${editors.indexOf(e)}`).classList.contains('active'));
    if (activeEditor) {
      const codeContent = activeEditor.editor.getValue();
      navigator.clipboard.writeText(codeContent).then(() => {
        alert('Code copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy code:', err);
      });
    }
  });

  // Docs menu toggle
  const docsMenuBtn = getEle('docs-menu-btn');
  const docsMenu = getEle('docs-menu');
  docsMenuBtn.addEventListener('click', () => {
    docsMenu.classList.toggle('hidden');
  });

  // Close docs menu when clicking outside
  document.addEventListener('click', event => {
    if (!docsMenuBtn.contains(event.target) && !docsMenu.contains(event.target)) {
      docsMenu.classList.add('hidden');
    }
  });

  // Trigger initial code generation with default template (uiAPI)
  const input = mdEditor.getValue(); // Get value from Monaco Editor
  const reSOQL = new RegExp(getEle('regex').value, 'gmi');
  const reResults = reSOQL.exec(input);
  if (reResults) {
    const [query, fields, object] = reResults;
    execEditor.setValue(JSON.stringify(reResults, null, 4)); // Set value in Monaco Editor
    const files = generateCode('uiAPI', query, getCleanedFields(fields), object);
    getEle('download-all-btn').onclick = () => downloadAllAsZip(files);
  }
};

document.addEventListener('DOMContentLoaded', init);