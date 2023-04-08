"use strict";
exports.__esModule = true;
exports.CodeGen = void 0;
// util class for ERD diagram
var CodeGen = /** @class */ (function () {
    function CodeGen() {
    }
    CodeGen.prototype.getLWCWireApex = function (object, fields, query) {
        var objectCased = object[0].toLowerCase() + object.slice(1);
        var markDown = '';
        var markupFields = "";
        var colmuns = '';
        var fieldCode = "";
        fields.forEach(function (field) {
            markupFields += "<p>{" + field.toLowerCase() + "}</p>";
            colmuns += "{  label: '" + field + "', fieldName: '" + field + "' },\n";
        });
        var markup = "\n\n<template>\n    <lightning-card title=\"" + object + " Datatable\" icon-name=\"standard:" + object.toLowerCase() + "\">\n        <template if:true={" + object.toLowerCase() + "s.data}>\n            <lightning-datatable\n            key-field=\"id\"\n            data={" + object.toLowerCase() + "s.data}\n            columns={columns}>\n        </lightning-datatable>\n\n        </template>\n    </lightning-card>\n</template>\n\n    ";
        var compMetadata = "\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<LightningComponentBundle xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n    <apiVersion>51.0</apiVersion>\n    <isExposed>true</isExposed>\n\n    <targets>\n        <target>lightning__RecordPage</target>\n        <target>lightning__AppPage</target>\n        <target>lightning__HomePage</target>\n    </targets>\n\n</LightningComponentBundle>\n   \n   ";
        var compJS = "\n    \nimport { LightningElement,  wire } from 'lwc';\nimport get" + object + "List from '@salesforce/apex/" + object + "Controller.get" + object + "List';\n\n\nexport default class ApexWireGetRecords" + object + " extends LightningElement {\n\n    columns = [" + colmuns + "];\n    // Let\u2019s use the apex wire service to get record data and display some field names.\n    @wire(get" + object + "List)\n    " + object.toLowerCase() + "s;\n     \n}\n    ";
        var apex = "\n    \n// " + object + "Controller.cls\npublic with sharing class " + object + "Controller {    \n    @AuraEnabled(cacheable=true)\n    public static List<" + object + "> get" + object + "List() {\n        return [\n          " + query + "\n        ];\n    }\n}\n    ";
        markDown = "\n\n### Apex Controller " + objectCased + "Controller.cls\n```java\n" + apex + "\n```\n### Apex Controller " + objectCased + "Controller.cls.meta.xml\n\n```xml\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<ApexClass xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n    <apiVersion>51.0</apiVersion>\n    <status>Active</status>\n</ApexClass>\n```\n\n\n### Component Markup " + objectCased + ".html\n```html\n" + markup + "\n```\n\n### Component Javascript: " + object + ".js\n```js\n    " + compJS + "\n```\n\n### Component metadata " + objectCased + ".js-meta-xml\n```xml\n    " + compMetadata + "\n```\n";
        // convert to html
        var converter = new showdown.Converter();
        return converter.makeHtml(markDown);
    };
    CodeGen.prototype.getLWCuiRecordApi = function (object, fields) {
        var objectCased = object[0].toLowerCase() + object.slice(1);
        var markDown = '';
        var markupFields = "";
        var getters = "";
        var fieldCode = "";
        fields.forEach(function (field) {
            markupFields += "<p>{" + field.toLowerCase() + "}</p>";
            fieldCode += "'" + object + "." + field + "',";
            getters += "\n    get " + field.toLowerCase() + "() {\n        return this." + object.toLowerCase() + ".data.fields." + field + ".value;\n    }\n";
        });
        var markup = "\n\n<template>\n    <lightning-card title=\"" + object + " Record\" icon-name=\"standard:" + object.toLowerCase() + "\">\n        <template if:true={" + object.toLowerCase() + ".data}>\n\n                <template for:each={" + object.toLowerCase() + ".data} for:item=\"" + object.toLowerCase() + "\">\n                     " + markupFields + "\n                </template>\n\n            <div class=\"slds-m-around_medium\">\n            </div>\n        </template>\n    </lightning-card>\n</template>\n\n    ";
        var compMetadata = "\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<LightningComponentBundle xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n    <apiVersion>51.0</apiVersion>\n    <isExposed>true</isExposed>\n\n    <targets>\n        <target>lightning__RecordPage</target>\n        <target>lightning__AppPage</target>\n        <target>lightning__HomePage</target>\n    </targets>\n\n</LightningComponentBundle>\n   \n   ";
        var compJS = "\n    \nimport { LightningElement, api, wire } from 'lwc';\nimport { getRecord } from 'lightning/uiRecordApi';\n\nconst FIELDS = [ " + fieldCode + " ];\n\nexport default class WireGetRecord" + object + " extends LightningElement {\n    @api recordId;\n\n    // Let\u2019s use the wire service to get record data and display some field names.\n\n    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })\n    " + object.toLowerCase() + ";\n     \n    " + getters + "\n    \n}\n    ";
        markDown = "\n### Component Markup " + objectCased + ".html\n```html\n" + markup + "\n```\n\n### Component Javascript: " + objectCased + ".js\n```js\n    " + compJS + "\n```\n\n### Component metadata " + objectCased + ".js-meta-xml\n```xml\n    " + compMetadata + "\n```\n";
        // convert to html
        var converter = new showdown.Converter();
        return converter.makeHtml(markDown);
    };
    ///------------
    CodeGen.prototype.getLWCTCRM = function (object, fields, query) {
        var objectCased = object[0].toLowerCase() + object.slice(1)
        var markDown = '';
        var markupFields = "";
        var getters = "";
        var fieldCode = "";
        fields.forEach(function (field) {
            markupFields += "<p>{" + field.toLowerCase() + "}</p>";
            fieldCode += "'" + object + "." + field + "',";
            getters += "\n    get " + field.toLowerCase() + "() {\n        return this." + object.toLowerCase() + ".data.fields." + field + ".value;\n    }\n";
        });
        var dashboard = "\n\"steps\": {\n    \"lens_1\": {\n        \"type\": \"soql\",\n        \"query\": \"" + query + "\",\n        \"numbers\": [],\n        \"strings\": [],\n        \"groups\": [],\n        \"selectMode\": \"single\"\n    }\n},\n";
        var markup = "\n\n<template>\n    <p>Hello World -  {title} </p>\n    \n    <h3>Results from  Query</h3>\n    <p>{output}</p>\n</template>\n\n    ";
        var compMetadata = "\n   <?xml version=\"1.0\" encoding=\"UTF-8\"?>\n   <LightningComponentBundle xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n       <apiVersion>\n           51.0\n       </apiVersion>\n       <isExposed>\n           true\n       </isExposed>\n       <masterLabel>\n          TCRM LWC \n       </masterLabel>\n       <description>\n           LWC component \n       </description>\n       <targets>\n           <target>\n               analytics__Dashboard\n           </target>\n       </targets>\n       <targetConfigs>\n           <targetConfig targets=\"analytics__Dashboard\">\n               <hasStep>\n                   true\n               </hasStep>\n               <property name=\"title\" type=\"String\" label=\"My Title\" required=\"true\">\n               </property>\n           </targetConfig>\n       </targetConfigs>\n   </LightningComponentBundle>\n   \n   \n   ";
        var compJS = "\n    \n    import { LightningElement, api } from 'lwc';\n\n    export default class TCRM extends LightningElement {\n        @api title = \"LWC!\";\n        @api results;\n    \n        get output () {\n            return JSON.stringify(this.results, null, 4);\n        }\n    }\n    ";
        markDown = "\n\n### Dashboard code\n```json\n" + dashboard + "\n```\n\n### Component Markup " + objectCased + ".html\n```html\n" + markup + "\n```\n\n### Component Javascript: " + objectCased + ".js\n```js\n    " + compJS + "\n```\n\n### Component metadata " + objectCased + ".js-meta-xml\n```xml\n    " + compMetadata + "\n```\n";
        // convert to html
        var converter = new showdown.Converter();
        return converter.makeHtml(markDown);
    };
    return CodeGen;
}());
exports.CodeGen = CodeGen;
