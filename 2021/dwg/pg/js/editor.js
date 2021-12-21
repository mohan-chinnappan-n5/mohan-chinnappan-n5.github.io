// editor.js
// author: mohan chinnappan

const title = 'Diagram Editor Playground';
const version =  'v1.0';

getEle = id => document.getElementById(id);
getEle('title').innerHTML = `${title} <small>${version}</small>`;

// init the editor
initEditor = (id, value, language, theme) => {
    const editorEle = getEle(id);
    const editor = monaco.editor.create(editorEle, { value, language, theme });
    return editor;
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
let lang = params['l'] || 'html';
let theme = params['t'] || 'vs-dark';

let content = contentHtml;

switch (lang) {
    case 'html': 
        content = contentHtml;
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
  const graph = mermaid.mermaidAPI.render(
    className,
    graphDefinition,
    (svgCode, bindFunctions) => {
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
const fileName = 'drawing.svg';

saveBtn.addEventListener("click", (event) => {
  save(graphDivEle);
});

const triggerDownload = (imgURI, fileName) => {
  let a = document.createElement("a");

  a.setAttribute("download", fileName);
  a.setAttribute("href", imgURI);
  a.setAttribute("target", "_blank");

  a.click();
};


let save = (ele) => {
  let data = new XMLSerializer().serializeToString(ele);
  let svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  let url = URL.createObjectURL(svgBlob);
  triggerDownload(url, fileName);
};


  

// on ready
(() => {
    updateIFrame();
})();



