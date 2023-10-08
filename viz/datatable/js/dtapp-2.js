
// dynamic datatable
// mohan chinnappan

let editor;
let input = `
[
    {
        "name": "peach",
        "qty": 200,
        "quality": "good"
    },
    {
        "name": "peach",
        "qty": 300,
        "quality": "good"
    },
    {
        "name": "mango",
        "qty": 700,
        "quality": "awesome"
    },

    {
        "name": "mango",
        "qty": 300,
        "quality": "awesome"
    },
    {
        "name": "plum",
        "qty": 200,
        "quality": "awesome"
    }

]
`;
let c;

// editor setup
//Function to set Monaco Editor's language mode based on the file extension
function setEditorLanguage(extension) {
    const supportedLanguages = monaco.languages.getLanguages();

    const languageId = supportedLanguages.find((lang) =>
        lang.extensions?.includes(`.${extension}`)
    );

    if (languageId) {
        monaco.editor.setModelLanguage(editor.getModel(), languageId.id);
    }
}

require.config({
    paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs" },
});

require(["vs/editor/editor.main"], async function () {
    editor = monaco.editor.create(document.getElementById("editor"), {
        value: JSON.stringify(JSON.parse(input), null, 4),
        language: "json",
        theme: "vs-dark",
    });

    // Handle content change event
    editor.onDidChangeModelContent(function () {
        // getEle('drawWC').click();
        const editorValue = editor.getValue();
        renderDataTable(editorValue);
    });
    //------- via clipboardx
    c = params.get("c");
    //console.log(c);
    if (c === null ) {
        editor.setValue(JSON.stringify(JSON.parse(input), null, 4),);
    }
    else if (c !== null && c === '') {
       
        await navigator.clipboard.readText().then((clipText) => {
            input = clipText;
            editor.setValue(input);
        });
    }
    else if (c !== null && c === 'csv') {
        await navigator.clipboard.readText().then((clipText) => {
            input = clipText;
        })
        input = JSON.stringify(d3.csvParse(input), null, 4);
        editor.setValue(input);
     
    }
    else if (c !== null && c === 'tsv') {
        await navigator.clipboard.readText().then((clipText) => {
            input = clipText;
        })
        console.log(input);
        input = JSON.stringify(d3.tsvParse(input), null, 4);
        console.log(input);
        editor.setValue(input);
     
    }

});



const getEle = (id) => document.getElementById(id);

// Get references to the select elements
const xAxisSelect = getEle("x-axis-select");
const yAxisSelect = getEle("y-axis-select");

// Check if a value is already stored in local storage
const storedXValue = localStorage.getItem("XValue");
const storedYValue = localStorage.getItem("YValue");
//console.log(storedXValue, storedYValue);

// Add a change event listener to the dropdown
xAxisSelect.addEventListener("change", function () {
    // Store the selected value in local storage
    localStorage.setItem("XValue", this.value);
});
yAxisSelect.addEventListener("change", function () {
    // Store the selected value in local storage
    localStorage.setItem("YValue", this.value);
});

const drawBtn = getEle("draw");

let width = 960;
let height = 600;
let type = "bar";
//const chartTypes = ["arc", "area", "bar", "line", "circle"];

const queryEle = getEle("query");
const runEle = getEle("run");
const thsEle = getEle("header");

let params = new URL(document.location).searchParams;

//------------ can be called with this parameter d
if (params.get("d") !== null) {
    // got it via query param d
    input = atob(params.get("d"));
    editor.setValue(input);
}



if (params.get("w") !== null) {
    width = parseInt(params.get("w"));
}
if (params.get("h") !== null) {
    height = parseInt(params.get("h"));
}

let yAggregate = null;
let xAggregate = null;

if (params.get("xa") !== null) {
    xAggregate = params.get("xa");
}
if (params.get("ya") !== null) {
    yAggregate = params.get("ya");
}
if (params.get("t") !== null) {
    type = params.get("t");
}
//console.log(type);

 

const prepareData = (input) => {
    const data = JSON.parse(input);
    console.log(data);
    let columns = Object.keys(data[0]);
    let fieldsData = [];
    let ths = "";
    thsEle.innerHTML = "";
    for (const col of columns) {
        //console.log(col);
        fieldsData.push({ data: col });
        ths += `<th>${col}</th>`;
    }
    thsEle.innerHTML = ths;
    return { data, fieldsData };
};

const renderDataTable = (input) => {
    let data, fieldsData;
    ({ data, fieldsData } = prepareData(input));
    // alert(JSON.stringify(fieldsData));
    // console.log(data, fieldsData);
    const dt = $("#dt").DataTable({
        destroy: true,
        bDestroy: true,
        data: data,
        columns: fieldsData,
        dom: "Blfrtip",
        buttons: ["copy", "csv", "excel", "pdf", "print"],
    });
    for (let i = 0; i < dt.columns().nodes().length; i++) {
        dt.columns(i).header().to$().text(fieldsData[i].data);
    }

    dt.columns.adjust().draw();

    const fieldTypes = determineFieldType(data);
    // console.log(fieldTypes);
    setupDropdowns(data);

    drawBtn.addEventListener("click", (event) => {
        drawChart(data, type, fieldTypes, xAxisSelect.value, yAxisSelect.value);
        getEle("vizBar").focus();
    });

    drawChart(data, type, fieldTypes, xAxisSelect.value, yAxisSelect.value);
};

//-----------

function determineFieldType(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return "Invalid input data";
    }

    const firstObject = data[0];

    if (typeof firstObject !== "object") {
        return "Invalid input data";
    }

    const fieldTypes = {};

    for (const key in firstObject) {
        if (firstObject.hasOwnProperty(key)) {
            const value = firstObject[key];

            if (typeof value === "string") {
                // Check if the field is nominal (contains non-numeric values)
                fieldTypes[key] = data.every(
                    (item) => typeof item[key] === "string" && isNaN(parseInt(item[key]))
                )
                    ? "nominal"
                    : "quantitative";
            } else if (typeof value === "number") {
                // Check if the field is quantitative (contains numeric values)
                fieldTypes[key] = data.every(
                    (item) => typeof item[key] === "number" || !isNaN(parseInt(item[key]))
                )
                    ? "quantitative"
                    : "nominal";
            } else {
                // If the field is neither string nor number, it's considered invalid
                fieldTypes[key] = "Invalid";
            }
        }
    }

    return fieldTypes;
}

function setupDropdowns(jsonData) {

    // Remove all option elements
    while (xAxisSelect.options.length > 0) {
        xAxisSelect.remove(0);
    }
    while (yAxisSelect.options.length > 0) {
        yAxisSelect.remove(0);
    }
    // Populate the dropdowns with field names
    for (const key in jsonData[0]) {
        if (jsonData[0].hasOwnProperty(key)) {
            const optionX = document.createElement("option");
            optionX.value = key;
            optionX.textContent = key;
            xAxisSelect.appendChild(optionX);

            const optionY = document.createElement("option");
            optionY.value = key;
            optionY.textContent = key;
            yAxisSelect.appendChild(optionY);
        }
    }
    // Set the initial selection if a value is stored
    if (storedXValue) {
        xAxisSelect.value = storedXValue;
    } else {
        xAxisSelect.value = Object.keys(jsonData[0])[0];

    }
    if (storedYValue) {
        yAxisSelect.value = storedYValue;
    }else {
        yAxisSelect.value = Object.keys(jsonData[0])[1];

    }
}

// charts
const drawChart = (data, type, fieldTypes, x, y) => {
    const barSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "Chart",
        data: {
            values: data,
        },

        width: width,
        height: height,

        mark: { type: type, tooltip: true, orient: "horizontal" },
        encoding: {
            x: { field: x, type: fieldTypes[x], axis: { labelAngle: 0, grid: true } },
            y: { field: y, type: fieldTypes[y], axis: { labelAngle: 0, grid: true } },
        },
    };
    if (xAggregate) {
        barSpec.encoding.x.aggregate = xAggregate;
    }
    if (yAggregate) {
        barSpec.encoding.y.aggregate = yAggregate;
    }
    //console.log(barSpec);
    vegaEmbed("#vizBar", barSpec);
};

// auto complete stuff

//------ auto complete ---
async function fetchText(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  }
 
const repoUrl = 'https://raw.githubusercontent.com/mohan-chinnappan-n/project-diagrams';
const listDwg = await fetchText(`${repoUrl}/main/data/lis.txt`);
const selectionMap = listDwg.trim().split('\n');

async function loadData(selection) {
  const packageUrl = `${repoUrl}/main/data/${selection}`;
  // console.log(packageUrl);
  const packageData = await fetchText(packageUrl);
  editor.setValue(packageData);

}

 
let typeSelected ='package';

const acConfigMtype = {
    placeHolder: "Search for chart data...",
    selector: "#autoCompleteMtype",
    data: {
        src: selectionMap
    },
    resultItem: {
        highlight: true,
    },
 
    resultsList: {
        element: (list, data) => {
            const info = document.createElement("p");
            if (data.results.length) {
                info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
            } else {
                info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
            }
            list.prepend(info);
        },
 
        noResults: true,
        maxResults: 15,
        tabSelect: true,
    },
 
    events: {
        input: {
            selection: async (event) => {
                const selection = event.detail.selection.value;
                autoCompleteJSMtype.input.value = selection;
                typeSelected = selection;
                await loadData(typeSelected);
 
            },
        },
    },
  };
  const autoCompleteJSMtype = new autoComplete(acConfigMtype);

