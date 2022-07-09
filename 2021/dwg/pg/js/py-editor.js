// editor.js
// author: mohan chinnappan

const title = 'PyScript Playground';
const version =  'v1.0';

getEle = id => document.getElementById(id);
getEle('title').innerHTML = `${title} <small>${version}</small>`;

// init the editor
initEditor = (id, value, language, theme) => {
    const editorEle = getEle(id);
    const editor = monaco.editor.create(editorEle, { value, language, theme });
    return editor;
};
// examples handling

const flowchart = `
 
# Import libraries
import pandas as pd
import matplotlib.pyplot as plt
import js
import json
import plotly
import plotly.express as px

import plotly.express as px
fig = px.scatter(x=[0, 1, 2, 3, 4], y=[0, 1, 4, 9, 16])
graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
js.plot(graphJSON,"chart1")
 

`;

const gantt = 
`gantt 
dateFormat HH:mm
axisFormat %H:%M
Initial milestone : milestone, m1, 17:49,2min
taska2 : 10min
taska3 : 5min 
Final milestone : milestone, m2, 18:14, 2min

`;

const userjourney =
`journey
title My working day
section Go to work
  Make tea: 5: Me
  Go upstairs: 3: Me
  Do work: 1: Me, Cat
section Go home
  Go downstairs: 5: Me
  Sit down: 5: Me
`;

const piechart = 
`pie
title Key elements in Product X
"Calcium" : 42.96
"Potassium" : 50.05
"Magnesium" : 10.01
"Iron" :  5`;

const erd = 
`erDiagram
CUSTOMER ||--o{ ORDER : places
CUSTOMER {
    string name
    string custNumber
    string sector
}
ORDER ||--|{ LINE-ITEM : contains
ORDER {
    int orderNumber
    string deliveryAddress
}
LINE-ITEM {
    string productCode
    int quantity
    float pricePerUnit
}`;

const seq =
`sequenceDiagram
autonumber
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!`;

const state = 
`stateDiagram
direction LR
[*] --> A
A --> B
B --> C
state B {
  direction LR
  a --> b
}
B --> D`;

const req =
`requirementDiagram

requirement test_req {
id: 1
text: the test text.
risk: high
verifymethod: test
}

element test_entity {
type: simulation
}

test_entity - satisfies -> test_req`;

const classd = 
`classDiagram
Animal <|-- Duck
Animal <|-- Fish
Animal <|-- Zebra
Animal : +int age
Animal : +String gender
Animal: +isMammal()
Animal: +mate()
class Duck{
    +String beakColor
    +swim()
    +quack()
}
class Fish{
    -int sizeInFeet
    -canEat()
}
class Zebra{
    +bool is_wild
    +run()
}`;

const examples = {
  flowchart,
  gantt,
  userjourney,
  piechart,
  erd,
  seq,
  state,
  req,
  classd,


};
const contentHtml = 
`
graph LR;
A--> B & C & D;
B--> A & E;
C--> A & E;
D--> A & E;
E--> B & C & D;
`;

const contentJSON = {
    "browsers": [
      "Chrome",
      "Safari",
      "Firefox"
    ],
    "chrome_is_best": true,
    "pollution": null,
    "pi": 3.14,
    "gems": {
      "unix": [
        "ken",
        "dmr"
      ],
      "c": [
        "dmr"
      ]
    },
    "greeting": "Hello Math!"
  };

  const contentPY = `
  # Import libraries
  import pandas as pd
  import matplotlib.pyplot as plt
  import js
  import json
  import plotly
  import plotly.express as px
  
  import plotly.express as px
  fig = px.scatter(x=[0, 1, 2, 3, 4], y=[0, 1, 4, 9, 16])
  graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
  js.plot(graphJSON,"chart1") 

  `;

  const contentGO = `
  package main
  import "fmt"
  func main() {
      fmt.Println("hello world")
  }
  `;

  const contentC = `
  #include <stdio.h>
    int main() {
       printf("Hello, World!");
       return 0;
    }
`;

const contentJS = `
// Definitions
class Person {
    constructor (name, city ) {
     this.name = name;
     this.city = city;
    }
}
class Customer extends Person {
    constructor (name, city, amount) {
        super(name, city);
        this.amount = amount;
    }
    deposit(amount) {
      this.amount += amount;
    }
    withDraw(amount) {
       this.amount -= amount;
    }
}
    
let myCust = new Customer('Johnny Appleseed','New Found Land',  100);
// deposit money 
myCust.deposit(200);
// withdraw some
myCust.withDraw(50);


`;

const contentMD = 
`
# Playground
- Name
  - Kaṇṇāṭi (கண்ணாடி) Playground 
  - Means Mirror
`;




// param parsing
parseParams = () => {
    const query = location.search.substr(1);
    let qResult = {};
    query.split("&").forEach(function(part) {
        const item = part.split("=");
        qResult[item[0]] = decodeURIComponent(item[1]);
    });
    return qResult;
}

// get the language (l) param
const params = parseParams();
let lang = params['l'] || 'py';
let theme = params['t'] || 'vs-dark';

let dwgData =  contentHtml;
if (params['d']) {
  dwgData = atob(params['d']);
}

 


let content = dwgData;

switch (lang) {
    case 'html': 
        content = dwgData;
        break;
    case 'js':
        lang = 'javascript';
        content = contentJS;
        break;
    case 'json':
        content = JSON.stringify(contentJSON, null, 4);
        break;
    case 'py':
        lang = 'python';    
        content = contentPY;
        break;
    case 'c':
        content = contentC;
        break;
    case 'go':
    content = contentGO;
    break;

    case 'md':
    content = contentMD;
    lang = 'md';
    break;

}
// console.log(lang);
// console.log(content);

const editor = initEditor('editor', content, lang, theme );
const getEditorContent = (editor) => editor.getValue();
let run = false;


// iframe update
// const  iFrame = getEle('iFrame').contentWindow.document;

const cleanIFrame = () => {
    iFrame.body.innerHTML = '';
    iFrame.writeln('<h3>Hello</h3>');
    iFrame.close();
}
const updateIFrame = () => {
    if (run) {
        cleanIFrame();
        iFrame.open();
        iFrame.writeln(getEditorContent(editor));
        iFrame.close();
    }
}
// document.body.onkeyup = () => updateIFrame();
/*
getEle('run').onclick = () => {
    run = !run;
    updateIFrame();
}
getEle('clean').onclick = () => {
  alert('clean');
  cleanIFrame();
}
*/


// draw diagram functions

const graphDivClassName = "graphDiv";
const graphDivEle = document.getElementsByClassName(graphDivClassName)[0];
const saveBtn = document.getElementById("saveBtn");


const draw = (graphDefinition, ele, className) => {
   // alert('draw');
   /*graphDivEle.innerHTML = 
  `<py-script>
   ${getEditorContent(editor)}
   </py-script> 
   `;
   */
};



getEle('run').onclick = () => {
  draw(getEditorContent(editor), graphDivEle, graphDivClassName);
  saveBtn.style.display = "block";
  // editor.setValue(`one two three`)
}

// SVG Save functions
let svgFileName = 'drawing.svg';

const savefilenameEle = document.getElementById('savefilename');


saveBtn.addEventListener("click", (event) => {
  save(graphDivEle);
});

const triggerDownload = (imgURI, fileName) => {
  let a = document.createElement("a");

  a.setAttribute("download", `${svgFileName}`);
  a.setAttribute("href", imgURI);
  a.setAttribute("target", "_blank");

  a.click();
};


let save = (ele) => {
  let data = new XMLSerializer().serializeToString(ele.childNodes[0]);
  let svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  let url = URL.createObjectURL(svgBlob);
  triggerDownload(url, svgFileName);
};




const fillExample = data => {
  editor.setValue(data);
  getEle('run').click();
}

document.querySelectorAll('.examples').forEach(item => {
  item.addEventListener('click', event => {
  const target = event.target;
  const exampleDwg = target.dataset.dwg;
  svgFileName =`${exampleDwg}.svg`;
  fillExample(examples[exampleDwg]);
  savefilenameEle.value = `${exampleDwg}.dwg`;
  });
});
  

// on ready
(() => {
    updateIFrame();
    getEle('run').click();
})();



