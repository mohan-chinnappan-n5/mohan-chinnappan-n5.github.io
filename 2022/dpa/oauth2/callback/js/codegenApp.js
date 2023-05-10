// codegenApp.js 
// mohan chinnappan

Split(["#left", "#right"], { sizes: [40, 60] });

 // query parm parser
 let getQueryParams = () => {
    const query = location.search.substr(1);
    let result = {};
    query.split("&").forEach(function(part) {
         const item = part.split("=");
         result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
   };

let params = getQueryParams()
const getEle = id => document.getElementById(id);
let soql = `
SELECT Id, Name 
FROM Account
`;
if (params.d) { soql = atob(params.d); }

let qparams = (new URL(document.location)).searchParams;

//------- via clipboard
let c = qparams.get('c');
if (c !== null) await navigator.clipboard.readText().then((clipText) => {
    soql = clipText;
});



getEle('md').value = soql.trim();

getEle('md2html').addEventListener('click', event => {
    const markDown = getEle('md').value; 
    const converter = new showdown.Converter();
    const html = converter.makeHtml(markDown);
    getEle('code').innerHTML = html;
});


const getLWCuiRecordApi =  (object, fields) => {
    var objectCased = object[0].toLowerCase() + object.slice(1);    var markDown = '';
    var markupFields = "";
    var getters = "";
    var fieldCode = "";
    fields.forEach(function (field) {
        markupFields +=  `<p class="slds-p-horizontal_small"><b> ${field.toLowerCase()} </b> : ` +  "{" + field.toLowerCase() + "}</p>";
        fieldCode += "'" + object + "." + field + "',";
        getters += "\n    get " + field.toLowerCase() + "() {\n        return this." + object.toLowerCase() + ".data.fields." + field + ".value;\n    }\n";
    });
    const markup = "\n\n<template>\n    <lightning-card title=\"" + object + " Record\" icon-name=\"standard:" + object.toLowerCase() + "\">\n        <template if:true={" + object.toLowerCase() + ".data}>\n\t\t   " + markupFields + "\n\t\t</template>\n\t</lightning-card>\n</template>\n\n    ";
    const compMetadata = "\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<LightningComponentBundle xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n    <apiVersion>51.0</apiVersion>\n    <isExposed>true</isExposed>\n\n    <targets>\n        <target>lightning__RecordPage</target>\n        <target>lightning__AppPage</target>\n        <target>lightning__HomePage</target>\n         <target>lightningCommunity__Page</target>\n         <target>lightningCommunity__Default</target>\n   </targets>\n\n</LightningComponentBundle>\n   \n   ";
    const compJS = "\n    \nimport { LightningElement, api, wire } from 'lwc';\nimport { getRecord } from 'lightning/uiRecordApi';\n\nconst FIELDS = [ " + fieldCode + " ];\n\nexport default class WireGetRecord" + object + " extends LightningElement {\n    @api recordId;\n\n    // Let\u2019s use the wire service to get record data and display some field names.\n\n    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })\n    " + object.toLowerCase() + ";\n     \n    " + getters + "\n    \n}\n    ";
    markDown = "\n### Component Markup: " + objectCased + ".html\n```html\n" + markup + "\n```\n\n### Component Javascript: " + objectCased + ".js\n```js\n    " + compJS + "\n```\n\n### Component Metadata: " + objectCased + ".js-meta-xml\n```xml\n    " + compMetadata + "\n```\n";
    // convert to html
    const converter = new showdown.Converter();
    return converter.makeHtml(markDown);
};


const getLWCWireApex =  (object, fields, query) => {
    var objectCased = object[0].toLowerCase() + object.slice(1);    var markDown = '';
    var markDown = '';
    var markupFields = "";
    var colmuns = '';
    var fieldCode = "";
    fields.forEach(function (field) {
        markupFields += "<p>{" + field.toLowerCase() + "}</p>";
        colmuns += "{  label: '" + field.trim() + "', fieldName: '" + field.trim() + "' },\n";
    });
    const markup = "\n\n<template>\n    <lightning-card title=\"" + object + " Datatable\" icon-name=\"standard:" + object.toLowerCase() + "\">\n        <template if:true={" + object.toLowerCase() + "s.data}>\n            <lightning-datatable\n            key-field=\"id\"\n            data={" + object.toLowerCase() + "s.data}\n            columns={columns}>\n        </lightning-datatable>\n\n        </template>\n    </lightning-card>\n</template>\n\n    ";
    const compMetadata = "\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<LightningComponentBundle xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n    <apiVersion>51.0</apiVersion>\n    <isExposed>true</isExposed>\n\n    <targets>\n        <target>lightning__RecordPage</target>\n        <target>lightning__AppPage</target>\n        <target>lightning__HomePage</target>\n        <target>lightningCommunity__Page</target>\n         <target>lightningCommunity__Default</target>\n     </targets>\n\n</LightningComponentBundle>\n   \n   ";
    const compJS = "\n    \nimport { LightningElement,  wire } from 'lwc';\nimport get" + object + "List from '@salesforce/apex/" + object + "Controller.get" + object + "List';\n\n\nexport default class ApexWireGetRecords" + object + " extends LightningElement {\n\n    columns = [" + colmuns + "];\n    // Let\u2019s use the apex wire service to get record data and display some field names.\n    @wire(get" + object + "List)\n    " + object.toLowerCase() + "s;\n     \n}\n    ";
    const apex = "\n    \n// " + object + "Controller.cls\npublic with sharing class " + object + "Controller {    \n    @AuraEnabled(cacheable=true)\n    public static List<" + object + "> get" + object + "List() {\n        return [\n          " + query + "\n        ];\n    }\n}\n    ";
    markDown = "\n\n### Apex Controller: " + objectCased + "Controller.cls\n```java\n" + apex + "\n```\n### Apex Controller Metadata: " + objectCased + "Controller.cls.meta.xml\n\n```xml\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<ApexClass xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n    <apiVersion>51.0</apiVersion>\n    <status>Active</status>\n</ApexClass>\n```\n\n\n### Component Markup: " + objectCased + ".html\n```html\n" + markup + "\n```\n\n### Component Javascript: " + objectCased + ".js\n```js\n    " + compJS + "\n```\n\n### Component Metadata: " + objectCased + ".js-meta-xml\n```xml\n    " + compMetadata + "\n```\n";
    // convert to html
    const converter = new showdown.Converter();
    return converter.makeHtml(markDown);
};

const getApexREST =  (object, query) => {
    var apex = "\n    \n// ".concat(object, "RESTController.cls\n@RestResource(urlMapping='/").concat(object, "s/*')\nglobal with sharing class ").concat(object, "RESTController {\n    @HttpGet\n    global static ").concat(object, " get").concat(object, "ById() {\n        RestRequest request = RestContext.request;\n        // grab the ").concat(object.toLowerCase(), "Id from the end of the URL\n        String ").concat(object.toLowerCase(), "Id = request.requestURI.substring(\n          request.requestURI.lastIndexOf('/')+1);\n          ").concat(object, " result =  [").concat(query, "\n            WHERE Id = :").concat(object.toLowerCase(), "Id];\n          return result;\n\n \n    }\n}\n");
    var markDown = "\n### Apex Controller: ".concat(object, "RESTController.cls\n```java\n").concat(apex, "\n```\n");
    // convert to html
    var converter = new showdown.Converter();
    return converter.makeHtml(markDown);
};


const getLWCTCRM = (object, fields, query) => {
    var objectCased = object[0].toLowerCase() + object.slice(1);    var markDown = '';
    var markDown = '';
    var markupFields = "";
    var getters = "";
    var fieldCode = "";
    fields.forEach(function (field) {
        markupFields += "<p>{" + field.toLowerCase() + "}</p>";
        fieldCode += "'" + object + "." + field + "',";
        getters += "\n    get " + field.toLowerCase() + "() {\n        return this." + object.toLowerCase() + ".data.fields." + field + ".value;\n    }\n";
    });
    const dashboard = "\n\"steps\": {\n    \"lens_1\": {\n        \"type\": \"soql\",\n        \"query\": \"" + query + "\",\n        \"numbers\": [],\n        \"strings\": [],\n        \"groups\": [],\n        \"selectMode\": \"single\"\n    }\n},\n";
    const markup = "\n\n<template>\n    <p>Hello World -  {title} </p>\n    \n    <h3>Results from  Query</h3>\n    <p>{output}</p>\n</template>\n\n    ";
    const compMetadata = "\n   <?xml version=\"1.0\" encoding=\"UTF-8\"?>\n   <LightningComponentBundle xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n       <apiVersion>\n           51.0\n       </apiVersion>\n       <isExposed>\n           true\n       </isExposed>\n       <masterLabel>\n          TCRM LWC \n       </masterLabel>\n       <description>\n           LWC component \n       </description>\n       <targets>\n           <target>\n               analytics__Dashboard\n           </target>\n       </targets>\n       <targetConfigs>\n           <targetConfig targets=\"analytics__Dashboard\">\n               <hasStep>\n                   true\n               </hasStep>\n               <property name=\"title\" type=\"String\" label=\"My Title\" required=\"true\">\n               </property>\n           </targetConfig>\n       </targetConfigs>\n   </LightningComponentBundle>\n   \n   \n   ";
    const compJS = "\n    \n    import { LightningElement, api } from 'lwc';\n\n    export default class TCRM extends LightningElement {\n        @api title = \"LWC!\";\n        @api results;\n    \n        get output () {\n            return JSON.stringify(this.results, null, 4);\n        }\n    }\n    ";
    markDown = "\n\n### Dashboard code\n```json\n" + dashboard + "\n```\n\n### Component Markup: " + objectCased + ".html\n```html\n" + markup + "\n```\n\n### Component Javascript: " + objectCased + ".js\n```js\n    " + compJS + "\n```\n\n### Component Metadata: " + objectCased + ".js-meta-xml\n```xml\n    " + compMetadata + "\n```\n";
    // convert to html
    const converter = new showdown.Converter();
    return converter.makeHtml(markDown);
};

const getCleanedFields = fields => {
    const fieldsList =  fields.split(',');
    return fieldsList.map(field => field.trim())
}


getEle('regex').addEventListener('change', event => {
    const reSOQL = new RegExp(event.target.value, 'gmi');
    const input =  getEle('md').value; 
    const reResults = reSOQL.exec(input);
    getEle('exec').value = JSON.stringify(reResults, null, 4); 
})

getEle('md').addEventListener('change', event => {
    const input =  event.target.value; 
    const reSOQL = new RegExp(getEle('regex').value, 'gmi'); 
    const reResults = reSOQL.exec(input);
    getEle('exec').value = JSON.stringify(reResults, null, 4); 
})

getEle('uiAPI').addEventListener('click', event => {
    const input =  getEle('md').value;
    const reSOQL = new RegExp(getEle('regex').value, 'gmi'); 
    
    const reResults = reSOQL.exec(input);
    const [query, fields, object] = reResults;
    // console.log(reResults);
    getEle('exec').value = JSON.stringify(reResults, null, 4);
    getEle('code').innerHTML = getLWCuiRecordApi(object, getCleanedFields(fields)) ;
});

getEle('apexWire').addEventListener('click', event => {
    const input =  getEle('md').value;
    const reSOQL = new RegExp(getEle('regex').value, 'gmi'); 
    const reResults = reSOQL.exec(input);
    const [query, fields, object] = reResults;
    const fieldsList =  fields.split(',');
    const cleanedFields = fieldsList.map(field => field.trim())
    
    getEle('code').innerHTML = getLWCWireApex(object, fields.split(','), query.trim()) ;
});

getEle('apexREST').addEventListener('click', event => {
    const input =  getEle('md').value;
    const reSOQL = new RegExp(getEle('regex').value, 'gmi'); 
    const reResults = reSOQL.exec(input);
    const [query, fields, object] = reResults;
    const fieldsList =  fields.split(',');
    const cleanedFields = fieldsList.map(field => field.trim())
    
    getEle('code').innerHTML = getApexREST(object, query.trim()) ;
});


getEle('tcrm').addEventListener('click', event => {
    const input =  getEle('md').value;
    const reSOQL = new RegExp(getEle('regex').value, 'gmi'); 
    const reResults = reSOQL.exec(input);
    const [query, fields, object] = reResults;
    getEle('code').innerHTML = getLWCTCRM(object, fields.split(','), query.trim()) ;
});






// bootstrap
getEle('uiAPI').click();


