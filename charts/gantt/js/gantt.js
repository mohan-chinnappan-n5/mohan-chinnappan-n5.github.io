// gantt.js
// mchinnappan


// data loading
let data = `Task Name,Start Date,End Date,Duration,Percent Completed,Dependencies
"Spring 2023","2022-12-15","2023-2-13","",100,""
"Summer 2023","2023-5-05","2023-6-10","",0,"Spring2023"
"Winter 2024","2023-8-11","2023-10-14","",0,"Summer2023"
"Spring 2024","2023-12-15","2024-2-13","",0,"Winter2024"
"Summer 2024","2024-5-05","2024-6-10","",0,"Spring2024"
"Summer 2024","2024-5-05","2024-6-10","",0,"Spring2024"
"Winter 2025","2024-8-11","2024-10-14","",0,"Summer2024"`;

const getEle = (id) => document.getElementById(id);
const inputEle = getEle("input");
const chartEle = getEle("chart_div");
const inputItems = getEle("inputItems");

// read params
const query = location.search.substr(1);
let qresult = {};
query.split("&").forEach(function (part) {
  var item = part.split("=");
  qresult[item[0]] = decodeURIComponent(item[1]);
});

const c = qresult.c;
let input = "";
if (qresult.c) {
  await navigator.clipboard.readText().then((clipText) => {
    data = clipText;
  });
}

const copyEle = getEle("copy");
copyEle.addEventListener("click", (event) => {
  inputEle.focus();
  inputEle.select();
  document.execCommand("copy");
});

const dtEle = getEle("dt");
dtEle.addEventListener("click", (event) => {
  copyEle.click();
});

Split(["#menu", "#content"], { sizes: [40, 60] });

inputEle.value = data.trim();
google.charts.load("current", { packages: ["gantt"] });
google.charts.setOnLoadCallback(drawChart);
//const dataTypes = ["string", "string", "date", "date", "number", "number", "string"];

const options = {
  height: 800,
  gantt: {
    trackHeight: 50,
    criticalPathEnabled: true,
    criticalPathStyle: {
      stroke: "#e64a19",
      strokeWidth: 5,
    },
    labelStyle: {
      fontName: "Arial",
      fontSize: 18,
      color: "#efefe",
    },
    innerGridHorizLine: {
      stroke: "#ffe0b2",
      strokeWidth: 1,
    },
    arrow: {
      angle: 100,
      width: 5,
      color: "green",
      radius: 0,
    },
    // backgroundColor: {fill: "red"}
    // innerGridTrack: {fill: '#99CCFF'},
    //innerGridDarkTrack: {fill: '#ff99cc'}
  },
};

let chart;
const formatId = (input) => `${input.replace(" ", "")}`;
const getData = (parsed) => {
  const data = new google.visualization.DataTable();
  data.addColumn("string", "Task ID");
  data.addColumn("string", "Task Name");
  data.addColumn("string", "Resource");
  data.addColumn("date", "Start Date");
  data.addColumn("date", "End Date");
  data.addColumn("number", "Duration");
  data.addColumn("number", "Percent Complete");
  data.addColumn("string", "Dependencies");
  const rows = parsed.slice(0);
  for (const row of rows) {
    const taskName = row["Task Name"];
    const taskId = formatId(taskName);
    const dataRow = [
      taskId,
      taskName,
      taskId,
      new Date(row["Start Date"]),
      new Date(row["End Date"]),
      Number(row["Duration"]),
      Number(row["Percent Completed"]),
      row["Dependencies"],
    ];
    data.addRows([dataRow]);
  }

  return data;
};

function drawChart() {
  chart = new google.visualization.Gantt(chartEle);

  google.visualization.events.addListener(chart, "ready", function () {
    // chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
    //console.log(chart_div.innerHTML);
  });
}

// SVG Save functions
let svgFileName = "drawing.svg";
const saveBtn = getEle("save");
saveBtn.addEventListener("click", (event) => {
  save(chartEle);
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

const drawEle = getEle("draw");
drawEle.addEventListener("click", (event) => {
  saveBtn.style.display ='block';
  const parsed = d3.csvParse(inputEle.value);
  const data = getData(parsed);
  chart.draw(data, options);
});
