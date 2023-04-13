// import fs from "fs";

// pert chart util
// mchinnappan
// inspirations from  Dr. Sisay Chala for pert calc

const dotPre = `digraph g {
        node [height=.1 shape=Mrecord style=rounded]
        rankdir=LR
        node [shape=Mrecord]
      `;

// ref: https://graphviz.org/doc/info/shapes.html
export class PertChart {
  constructor() {}

  getInput(filename) {
    return JSON.parse(fs.readFileSync(filename));
  }
  getInputFromString(str) {
    return JSON.parse(str);
  }
  calculateValues(taskList) {
    for (const [key, value] of Object.entries(taskList)) {
      // console.log(`${key}: ${JSON.stringify(value)}`);
      const pred = taskList[key]["pred"];
      let start = taskList[key]["start"];
      let duration = taskList[key]["duration"];

      if (pred[0] === "START") {
        taskList[key]["end"] = start + duration;
      } else if (pred.length === 1) {
        const pred1 = pred[0]; // predecessor
        start = taskList[pred1]["end"];
        taskList[key]["start"] = start;
        taskList[key]["end"] = start + duration;
      } else if (pred.length > 1) {
        const ends = [];
        for (const p of pred) {
          ends.push(taskList[p]["end"]);
        }
        taskList[key]["start"] = Math.max(...ends);
        taskList[key]["end"] = taskList[key]["start"] + duration;
      }
    }
    return taskList;
  }

  getDot(taskList, color = "black", fillcolor = "grey93", style = "filled") {
    let nodes = dotPre;
    let edges = "";

    for (const [key, value] of Object.entries(taskList)) {
      const id = taskList[key]["Tid"];
      const start = taskList[key]["start"];
      const duration = taskList[key]["duration"];
      const end = taskList[key]["end"];
      const responsible = taskList[key]["responsible"];

      if (id === "END") {
        continue;
      }
      nodes += `"${id}"  [label="<f0> ${id} |{${start}|${duration}|${end}}|<f2>${responsible}" color=${color} fillcolor=${fillcolor} style=${style}]
          `;
    }

    for (const [key, value] of Object.entries(taskList)) {
      const id = taskList[key]["Tid"];
      const predecessors = taskList[key]["pred"];

      if (id === "END") {
        if (predecessors.length > 1) {
          for (const pred of predecessors) {
            edges += `"${pred}" -> "${id}"
                `;
          }
        } else {
          edges += `"${predecessors[0]}" -> "FINISH"
                `;
        }
      } else {
        if (predecessors.length > 1) {
          for (const pred of predecessors) {
            edges += `"${pred}" -> "${id}"
                  `;
          }
        } else {
          edges += `"${predecessors[0]}" -> "${id}"
                  `;
        }
      }
    }

    return nodes + edges + "}";
  }
}

/*
node usage:
      const pc = new PertChart();
      const taskList = pc.getInput(process.argv[2]);
      const calculatedTaskList = pc.calculateValues(taskList);
      console.log(calculatedTaskList);
      console.log(pc.getDot(calculatedTaskList, "blue", "steelblue", "filled"));
*/

const getEle = (id) => document.getElementById(id);

const dotEle = getEle("dot");
const processBtn = getEle("process");
const drawBtn = getEle("draw");
const jsonEle = getEle("json");
const saveBtn = getEle("save");

const pert1Url =
  "https://raw.githubusercontent.com/mohan-chinnappan-n/cli-dx/master/charts/pert1.json";

async function fetchJSON(url) {
  const response = await fetch(url);
  const content = await response.json();
  return content;
}

const pertData = await fetchJSON(pert1Url);
jsonEle.value = JSON.stringify(pertData, null, 4);

Split(["#menu", "#content"], { sizes: [30, 70] });
const pc = new PertChart();

processBtn.addEventListener("click", (e) => {
  const taskList = pc.getInputFromString(jsonEle.value);
  const calculatedTaskList = pc.calculateValues(taskList);
  dotEle.value = pc.getDot(calculatedTaskList);
});

// viz stuff

import Viz from "https://unpkg.com/@aduh95/viz.js";

const locateFile = (fileName) =>
  "https://unpkg.com/@aduh95/viz.js/dist/" + fileName;
const onmessage = async function (event) {
  if (this.messageHandler === undefined) {
    // Lazy loading actual handler
    const { default: init, onmessage } = await import(
      Module.locateFile("render.browser.js")
    );
    // Removing default MessageEvent handler
    removeEventListener("message", onmessage);
    await init(Module);
    this.messageHandler = onmessage;
  }
  return this.messageHandler(event);
};
const vizOptions = {
  workerURL: URL.createObjectURL(
    new Blob(
      [
        "const Module = { locateFile:",
        locateFile.toString(),
        "};",
        "onmessage=",
        onmessage.toString(),
      ],
      { type: "application/javascript" }
    )
  ),
};

async function dot2svg(dot, options) {
  const viz = new Viz(vizOptions);
  return viz.renderString(dot, options);
}

drawBtn.addEventListener("click", (e) => {
  processBtn.click();
  const graph = dotEle.value;
  dot2svg(graph)
    .then(
      (str) =>
        new DOMParser().parseFromString(str, "image/svg+xml").documentElement
    )
    .then((el) => {
      $("#graphviz").empty().append(el);
      saveBtn.style.display = "block";
    })
    .catch((err) => console.warn(err));
});

//-----------------------
// SVG Save functions
//-----------------------
let svgFileName = "pertChart.svg";
saveBtn.addEventListener("click", (event) => {
  save(getEle("graphviz"));
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
