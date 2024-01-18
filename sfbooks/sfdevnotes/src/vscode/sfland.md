# SF Land

![logo](https://mohanchinnappan.gallerycdn.vsassets.io/extensions/mohanchinnappan/sf-land/0.0.46/1670947555426/Microsoft.VisualStudio.Services.Icons.Default)
## Welcome to the VS Code Extension - SF-LAND!

### [Install sf-land from Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=mohanChinnappan.sf-land)


## Features
### Salesforce specific - Login required
-  [Login into Salesforce and create an Auth JSON file](#login1)
-  [Login with Auth JSON File](#login2)
-  [Runs a given SOQL and provides results output in HTML](#sfquery)
    - [Select SOQL Query](#sfquery)
-  [Run anonymous Apex](#anonapex)
- [List Fields for SObject](#fieldList)

- [Delete Metadata](#deleteMetadata)
- [Load and Delete Using BulkAPI 2.0](#bulk2)

### Code Scan (Salesforce Login not required)
-  [Runs PMD Scan](#pmdscan)

### LWC Code Gen (Salesforce Login not required)
- [Create LWC for the given SOQL](#lwccodegen)

### Provide datatable view for a JSON node in the editor
- [Render datatable](#datatable1)

### Provide datatable view for a CSV File in the editor
- [Render CSV in  datatable](#datatableCSV)

### Render JSON in the Editor as Bar Chart
- [Render JSON in the editor as Bar Chart](#jsonbar)


### i18n
- [Translate Using Google Translate](#gtranslate)

### Word Cloud
- [Draw Word Cloud](#wordcloud)

### Pie Chart
- [Draw Pie Chart](#drawpie)


### GraphViz
- [Draw GraphViz Graph](#gviz)

### REST client
- [Select REST Resource](#restc)
- [Rest Client for Salesforce and Generic](#restc)

### Crypto features
- [Get JWT](#jwtget)
- [Verify JWT](#jwtverify)

### Doc features
- [Markdown to HTML Page](#md2html)
 

### More Demos
- [Named Credentials](#demo1)




---

<a name='login1'></a>
### SFL: Login into Salesforce to get Auth File
- Login into Salesforce and create an Auth JSON file
    - Uses SFDX for this operation

<a name='login2'></a>
### SFL: Login with Auth JSON File
- Login into the Salesforce Org with the given Auth JSON file

<a name='sfquery'></a>
### SFL: Run SOQL Query
- Runs a given SOQL and provides results output in HTML
    - Select **Tooling** to use Tooling query
    - You can select a SOQL from standard list using **SFL: Select SOQL Query**
![query results](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-query-results-1.png)
![query results - 2](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-query-results-2.png)

<a name='anonapex'></a>
### SFL: Run Anonymous Apex
- Runs the Anonymous Apex in the editor 

<a name='sflimits'></a>
### SFL: Run Org Limits
-  Display Limits info in your org
![limits results](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-org-limits-1.png)

---

<a name='fieldList'></a>
### SFL: List Fields for SObject

![Demo field list](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-list-fields-1.png)

---
- Field Usage Demo
![Demo Field Usage](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-fieldusage-demo-1.webm.gif)

---
<a name='bulk2'></a>

### SFL: Load Data Using BulkAPI 2.0

```
cat /tmp/case2.csv

Subject,Priority
Automobile having fuel issues,High
Automobile Auto-Pilot has input error,High

```


---

### SFL: Delete Data Using BulkAPI 2.0

```
cat /tmp/case2_del.csv

Id
5004x00000KdRUWAA3
5004x00000KdRUXAA3
```

![Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sfl-bulk2-load-delete.webm.gif)


<a name='pmdscan'></a>
### SFL: Run PMD Scan
- Runs PMD Scan
    - Setup PMD executable as per this [Doc](https://github.com/mohan-chinnappan-n/cli-dx/blob/master/mdapi/pmd-codescan.md)
- Also you can run PMD scan on the current file in the editor
    - using **SFL: Run PM Scan for File in the Editor**

- Demo
- ![PMD Report Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/kural-docs/master/img/new_pmd-report-1.gif)
---
<a name='gtranslate'></a>
### SFL: Google Translate
- Translate the current editor text using Google Translate 


<a name='wordcloud'></a>
### SFL: Draw Word Cloud
- Draws Word Cloud for  the current editor text
![WC-1](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-wc-1.png)

<a name='gviz'></a>
### SFL: Draw graphViz graph
- Draws graphViz graph for the current editor text
![WC-1](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-graphviz-1.png)

<a name='restc'></a>
### SFL: REST Client

- You can run **SFL: Select REST Resource** to select from list of standard REST resources

- input
```json
{
    "method": "SFGET",
    "url":  "sobjects/Opportunity/describe"
}
```
- Response will be rendered in a VS Code window
![Demo restc](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-restc-1.webm.gif)

---
<a name='md2html'><a>

### SFL: Render Markdown in Editor as Webpage

- Renders a Markdown document in the editor to html page

---

<a name='jwtget'></a>
### SFL:SECURITY: Create JWT

- input
```json
{
  "payload": { "user": "Dennis Ritchie"},
  "expiresIn": 3

}
```

- JWT
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiRGVubmlzIFJpdGNoaWUiLCJpYXQiOjE2NjQ5MjUzODQsImV4cCI6MzMyOTg1MDc3MX0.dEjtntdJ5anLHh8A1w8n24UBkejVeMy-c9Wru-PsMNw

```


<a name='jwtverify'></a>
### SFL:SECURITY: Verify JWT

- input
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiRGVubmlzIFJpdGNoaWUiLCJpYXQiOjE2NjQ5MjUzODQsImV4cCI6MzMyOTg1MDc3MX0.dEjtntdJ5anLHh8A1w8n24UBkejVeMy-c9Wru-PsMNw
```

- output
```json
{
    "user": "Dennis Ritchie",
    "iat": 1664925384,
    "exp": 3329850771
}

```
---

<a name='lwccodegen'></a>
### LWC Code gen
- SFL: Generate LWC for SOQL Query
- For the Given Single Object based SOQL:
```sql
SELECT Id, Name, Amount FROM Opportunity
```

![LWC code gen](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-lwc-codegen-1.png)

---
<a name='drawpie'></a>
### Draw Pie Chart
- SFL: Draw Pie Chart 
- Sample data file in the editor
```
{
    "title": "Fruits Yield",
    "name": "Yield",
    "data": [{ "Mango": 40 },
    { "Peach": 10 },
    { "Pear": 5 },
    { "Plum": 8 },
    { "Apple": 20 }
    ]
}
```
- ![Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-draw-pie-1.webm.gif)

---

<a name='datatable1'></a>
### Render Datatable
- SFL: Render Selected JSON Node in Datatable"
- Sample data file in the editor
```
{
  "title": "Fruits",

  "data": [
    { "Name": "Mango", "qty": 2000, "goodQuality": true },
    { "Name": "Apple", "qty": 3000, "goodQuality": true },
    { "Name": "Pear", "qty": 500, "goodQuality": true },
    { "Name": "Peach", "qty": 4000, "goodQuality": true }
  ]
}

```
- ![Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-datatable-1.webm.gif)
---
<a name='datatableCSV'></a>
 ## Render CSV in  datatable

 - ![Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-datatable-csv.webm.gif)

---

---
<a name='jsonbar'></a>
 ## Render JSON in the Editor as Bar Chart

 - ![Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-json-bar-1.webm.gif)

---


<a name='deleteMetadata'></a>
### Delete Metadata
![Demo](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/deleteMetadata-1.gif)


### More Demos
<a name='demo-1'></a>
- Named  Credentials 
- ![Demo - Named Cred](https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/img/sf-land-demo-named-cred-1.webm.gif)

---
#### Stay tuned... More coming...
---

**Enjoy!**
- Built by [Mohan Chinnappan](https://www.linkedin.com/in/mohan-chinnappan-232ab632/) with ♥

