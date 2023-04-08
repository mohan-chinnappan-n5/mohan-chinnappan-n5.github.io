// dynamic datatable
// mohan chinnappan

const WC_MAX_LENGTH = 40000;
// read query params
const query = location.search.substr(1);
let qresult = {};
query.split("&").forEach(function (part) {
  const item = part.split("=");
  qresult[item[0]] = decodeURIComponent(item[1]);
});

const getEle = id => document.getElementById(id);
const runEle = getEle("run");
const thsEle = getEle("header");


let inputFile = "scpl_wc.psv";

let xAxisField = 0;
let yAxisField = null;
let chartWidth = 400;
let chartHeight = 300;
let chartType = "bar";
let chartNeeded = 1;
let colorField = 1;
let colorDimNeeded = 0;
let searchString = "";
let xBin = false;
let yBin = false;
let wcField = null;


const typeExpand = (t) => {
  switch (t) {
    case "q":
      return "quantitative";
    case "o":
      return "ordinal";
    case "n":
      return "nominal";
    case "t":
      return "temporal";
  }
};
let xType = "ordinal";
let yType = "ordinal";
if (qresult.d) {
  inputFile = qresult.d;
}
if (qresult.x) {
  xAxisField = parseInt(qresult.x);
}
if (qresult.y) {
  yAxisField = parseInt(qresult.y);
}

if (qresult.cf) {
  colorField = parseInt(qresult.cf);
}

if (qresult.cw) {
  chartWidth = parseInt(qresult.cw);
}
if (qresult.ch) {
  chartHeight = parseInt(qresult.ch);
}
if (qresult.ct) {
  chartType = qresult.ct;
}
if (qresult.c) {
  chartNeeded = parseInt(qresult.c);
}
if (qresult.cc) {
  colorDimNeeded = parseInt(qresult.cc);
}
if (qresult.s) {
  searchString = qresult.s;
}

if (qresult.xbin) {
  xBin = parseInt(qresult.xbin) === 1;
}
if (qresult.ybin) {
  yBin = parseInt(qresult.ybin) === 1;
}

if (qresult.xt) {
  xType = typeExpand(qresult.xt);
}
if (qresult.yt) {
  yType = typeExpand(qresult.yt);
}
if (qresult.wc) {
  wcField = parseInt(qresult.wc);
}


// rule stuff

let mf = '';
let mfa = '';
let mfc = '';
let rule = false;

if (qresult.rule) {
  rule = parseInt(qresult.rule) === 1;
}
if (rule) {
  if (qresult.mf) { mf = qresult.mf }
  if (qresult.mfa) { mfa = qresult.mfa }
  if (qresult.mfc) { mfc = qresult.mfc }
}





const fileExt2Delim = {
  tsv: "\t",
  csv: ",",
  psv: "|",
};

let fileData = "";
let FD = '';
let fileExt;
let data = "";
let fieldsData;


const  readSingleFile =  async (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    fileData = e.target.result;
     renderDataTable(inputFile);

    
    fileExt = file.name.split(".").pop();
    FD = fileExt2Delim[fileExt] || "|"; 
  
  };
  reader.readAsText(file);

}

getEle("inputfile").onchange = async (e) => {
  await readSingleFile(e);
};




const psv2JSON = (psv) => {
  if (FD === ",") {
    const data = d3.csvParse(psv);
    // console.log(data);
    return data;
  }
  if (FD === "\t") {
    const data = d3.tsvParse(psv);
    // console.log(data);
    return data;
  }
  const records = psv.split("\n");
  let jsonOutput = [];
  let ln = 0;
  let header;
  for (const record of records) {
    ln++;
    if (ln === 1) {
      header = record.split(FD);
      continue;
    }
    const dataFields = record.split(FD);
    let obj = {};
    header.forEach((field, index) => {
      obj[field] = dataFields[index];
    });
    jsonOutput.push(obj);
  }
  return jsonOutput;
};

const prepareData = async (input) => {

  async function fetchPSVFile(input) {
    const response = await fetch(input);
    const lines = await response.text();
    if (response.status === 200) return lines;
    else null;
  }
  let lines = '';
  if (fileData.trim().length > 0 ){
    lines = fileData;
    // console.log(lines);
  } else {
    fileExt = inputFile.split(".").pop();
    FD = fileExt2Delim[fileExt] || "|";
   lines = await fetchPSVFile(input);
  }

  if (!lines) {
    alert("No lines in the given file");
    throw "No lines in the given file";
  }

  let data = "";
  if (fileExt === "json") {
    data = JSON.parse(lines);
  } else data = psv2JSON(lines);

  let columns = Object.keys(data[0]);
  // console.log(columns);
  fieldsData = [];
  let ths = "";
  thsEle.innerHTML = "";
  for (const col of columns) {
    // console.log(col);
    fieldsData.push({ data: col });
    ths += `<th>${col}</th>`;
  }
  thsEle.innerHTML = ths;
  // console.log(ths);
  // getEle('tbody').innerHTML = '';

  // console.log(data, fileExt);

  return { data, fieldsData };
};



const renderDataTable = async (input) => {
 
  ({ data, fieldsData } = await prepareData(input));
  // alert(JSON.stringify(fieldsData));
  // console.log(data, fieldsData);
  const dt = $("#dfv").DataTable({
    destroy: true,
    bDestroy: true,
    data: data,
    columns: fieldsData,
    dom: "Blfrtip",
    buttons: ["copy", "csv", "excel", "pdf", "print"],
  });

  // dt.clear().draw();
  // dt.rows.add(data); 

  for (let i = 0; i < dt.columns().nodes().length; i++) {
    dt.columns(i).header().to$().text(fieldsData[i].data);
  }

  dt.columns.adjust().draw();

  let color = {};
  if (colorDimNeeded === 1) {
    color = {
      field: fieldsData[colorField].data,
      type: "nominal",
    };
  }
  if (chartNeeded === 1) {
    drawChart(color);
  }
  if (wcField !== null) document.getElementById('drawWC').style.display = 'block';

};

// charts
const drawChart = (color) => {
  let ySpec = { aggregate: "count", title: "Count" };
  if (yAxisField !== null) {
    ySpec = { field: fieldsData[yAxisField].data, bin: yBin, type: yType };
  }

  let ruleSpec = null;


  if (rule) {
    ruleSpec = 
    {
      "mark": "rule",
      "encoding": {
        "y": {"field": mf, "aggregate": mfa},
        "size": {"value": 2},
        "color": {"field": mfc}
      }
    }
  }

  const barSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    height: chartHeight,
    width: chartWidth,

    data: { values: data },

    layer: [
      {
        mark: { type: chartType, tooltip: true },
        encoding: {
          x: { bin: xBin, field: fieldsData[xAxisField].data, type: xType },
          y: ySpec,
          color,
        },
      },
      
      
    ],
  };
  if (rule) {
    barSpec.layer.push(ruleSpec);
  }

  // console.log(barSpec);
  vegaEmbed("#vizBar", barSpec);
};

window.addEventListener("load", (e) => {
  const input = document.getElementsByTagName("input")[0];
  input.value = searchString;
});

renderDataTable(inputFile);



async function drawWC(text) {
  const wcSpecUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n/sf-land-docs/master/vega/wc.json';
	const getWCSpec = async (url) => {
		const response = await fetch(url);
		return response.json(); 
	}

	getWCSpec(wcSpecUrl).then( data => {
	   data.data[0].values[0] = text;  
	  vegaEmbed('#wc', data);
	});

}

document.getElementById('drawWC').addEventListener('click', event => {
  const fld =  fieldsData[wcField || 1].data;
  let text = '';
   for (const rec of data) {
      text += rec[fld];
      if (text.length > WC_MAX_LENGTH) break;
   }
  drawWC(text);
  document.getElementById('drawWC').style.display = 'none';

  
})

searchString;
