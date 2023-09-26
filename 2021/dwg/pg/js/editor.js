// editor.js
// author: mohan chinnappan

const title = 'Diagram Editor Playground';
const version =  'v2.0';

const getEle = id => document.getElementById(id);

const btnLoad = getEle('load');
btnLoad.addEventListener('click', event => {
  editor.setValue(editorc.value);
})


getEle('title').innerHTML = `${title} <small>${version}</small>`;

// init the editor
const initEditor = (id, value, language, theme) => {
    const editorEle = getEle(id);
    const editor = monaco.editor.create(editorEle, { value, language, theme });
    return editor;
};
// examples handling

const flowchart = `
flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]

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

const gitGraph = 
`---
title: Example Git diagram
---
gitGraph
   commit id: "1000"
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit

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

const c4context = `C4Context
title System Context diagram for Internet Banking System

Person(customerA, "Banking Customer A", "A customer of the bank, with personal bank accounts.")
Person(customerB, "Banking Customer B")
Person_Ext(customerC, "Banking Customer C")
System(SystemAA, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")

Person(customerD, "Banking Customer D", "A customer of the bank, <br/> with personal bank accounts.")

Enterprise_Boundary(b1, "BankBoundary") {

  SystemDb_Ext(SystemE, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

  System_Boundary(b2, "BankBoundary2") {
    System(SystemA, "Banking System A")
    System(SystemB, "Banking System B", "A system of the bank, with personal bank accounts.")
  }

  System_Ext(SystemC, "E-mail system", "The internal Microsoft Exchange e-mail system.")
  SystemDb(SystemD, "Banking System D Database", "A system of the bank, with personal bank accounts.")

  Boundary(b3, "BankBoundary3", "boundary") {
    SystemQueue(SystemF, "Banking System F Queue", "A system of the bank, with personal bank accounts.")
    SystemQueue_Ext(SystemG, "Banking System G Queue", "A system of the bank, with personal bank accounts.")
  }
}

BiRel(customerA, SystemAA, "Uses")
BiRel(SystemAA, SystemE, "Uses")
Rel(SystemAA, SystemC, "Sends e-mails", "SMTP")
Rel(SystemC, customerA, "Sends e-mails to")
`;

const examples = {
  flowchart,
  gantt,
  gitGraph,
  c4context,
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
  for x in range(3, 8, 2):
    print(x)

  def add(a, b):
    return a + b

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
const parseParams = () => {
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
let lang = params['l'] || 'html';
let theme = params['t'] || 'vs-dark';

async function fetchText(url) {
  const response = await fetch(url);
  const content = await response.text();
  return content;
}
const repoUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n/project-diagrams';

async function loadData(selection) {
  const packageUrl = `${repoUrl}/main/${selection}`;
  const packageData = await fetchText(packageUrl);
  // console.log(packageData);
  document.getElementById('load').disabled = false;
  editorc.value = packageData;

}

let dwgData =  contentHtml;
if (params['d']) {
  dwgData = atob(params['d']);
} else if (params['f']) {
  const file = params['f']; 
  await loadData(file);
  //console.log(dwgData);
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
getEle('load').click();



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
  //console.log(graphDefinition);
  const graph = mermaid.render( className, graphDefinition, (svgCode, bindFunctions) => {
      // console.log(svgCode);
      ele.innerHTML = svgCode;
    }
  );
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



