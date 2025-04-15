// js/dtapp.js
// dynamic datatable
// mohan chinnappan

const getEle = (id) => document.getElementById(id);

// Get references to elements
const xAxisSelect = getEle("x-axis-select");
const yAxisSelect = getEle("y-axis-select");
const chartTypeSelect = getEle("chart-type-select");
const drawBtn = getEle("draw");
const resetBtn = getEle("reset");
const shareBtn = getEle("share");
const exportImageBtn = getEle("export-image");
const queryEditorContainer = getEle("query-editor");
const fileUpload = getEle("file-upload");
const fileNameDisplay = getEle("file-name");
const thsEle = getEle("header");
const renderDataBtn = getEle("render-data");

let width = 400;
let height = 400;
let type = chartTypeSelect?.value || "bar";
let currentData, currentFieldTypes;
let input = `[{"name": "peach", "qty": 200, "quality": "good"}, {"name":"mango", "qty":700, "quality": "good"}, {"name":"mango", "qty":300, "quality": "good"}]`;
let xAggregate = null;
let yAggregate = null;
let editor = null;

// Initialize Monaco Editor
require(["vs/editor/editor.main"], () => {
  editor = monaco.editor.create(queryEditorContainer, {
    value: input,
    language: "json",
    theme: "vs-dark",
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    tabSize: 2,
    formatOnPaste: true,
    formatOnType: true,
  });

  // Run initialization logic after editor is ready
  initializeApp();
});

// Function Definitions
const prepareData = (input) => {
  try {
    let data = JSON.parse(input);
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Data must be a non-empty array of objects.");
    }
    // Only flatten nested objects if necessary
    data = data.map((item) => {
      if (typeof item !== "object" || item === null) {
        throw new Error("Each item must be an object.");
      }
      let flattenedItem = {};
      for (let key in item) {
        // Only stringify if the value is a nested object or array (excluding null)
        flattenedItem[key] = typeof item[key] === "object" && item[key] !== null && !(item[key] instanceof Date)
          ? JSON.stringify(item[key])
          : item[key];
      }
      return flattenedItem;
    });
    let columns = Object.keys(data[0]);
    let fieldsData = [];
    let ths = "";
    if (thsEle) thsEle.innerHTML = "";
    for (const col of columns) {
      fieldsData.push({ data: col, title: col });
      ths += `<th>${col}</th>`;
    }
    if (thsEle) thsEle.innerHTML = ths;
    return { data, fieldsData };
  } catch (e) {
    console.error("prepareData error:", e, "Input:", input);
    throw new Error(`Invalid data format: ${e.message}`);
  }
};

const renderDataTable = (input) => {
  try {
    let data, fieldsData;
    ({ data, fieldsData } = prepareData(input));
    currentData = data;

    // Destroy existing DataTable if it exists
    if ($.fn.DataTable.isDataTable("#dt")) {
      $("#dt").DataTable().destroy();
    }

    // Clear table content
    $("#dt").empty();
    if (thsEle) thsEle.innerHTML = fieldsData.map(col => `<th>${col.title}</th>`).join("");

    // Initialize DataTable after a slight delay to ensure DOM is ready
    setTimeout(() => {
      try {
        const dt = $("#dt").DataTable({
          destroy: true,
          data: data,
          columns: fieldsData,
          dom: "Bfrtip",
          buttons: ["copy", "csv", "excel", "pdf", "print"],
          deferRender: true,
        });

        dt.columns.adjust().draw();

        currentFieldTypes = determineFieldType(data);
        setupDropdowns(data);

        if (xAxisSelect.value && yAxisSelect.value) {
          drawChart(data, type, currentFieldTypes, xAxisSelect.value, yAxisSelect.value);
        }
      } catch (dtError) {
        console.error("DataTable initialization error:", dtError);
        alert("Failed to initialize table.");
      }
    }, 0);
  } catch (e) {
    console.error("Error rendering DataTable:", e);
    alert(`Error rendering table: ${e.message}`);
  }
};

function determineFieldType(data) {
  if (!Array.isArray(data) || data.length === 0) return {};
  const fieldTypes = {};
  for (const key in data[0]) {
    if (data[0].hasOwnProperty(key)) {
      const value = data[0][key];
      if (typeof value === "string") {
        fieldTypes[key] = data.every((item) => typeof item[key] === "string" && isNaN(parseFloat(item[key]))) ? "nominal" : "quantitative";
      } else if (typeof value === "number") {
        fieldTypes[key] = "quantitative";
      } else {
        fieldTypes[key] = "nominal";
      }
    }
  }
  return fieldTypes;
}

function setupDropdowns(jsonData) {
  if (xAxisSelect && yAxisSelect) {
    xAxisSelect.innerHTML = '<option value="">Select X-axis</option>';
    yAxisSelect.innerHTML = '<option value="">Select Y-axis</option>';
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
    const storedXValue = localStorage.getItem("XValue");
    const storedYValue = localStorage.getItem("YValue");
    if (storedXValue) xAxisSelect.value = storedXValue;
    if (storedYValue) yAxisSelect.value = storedYValue;
  }
}

function getChartSpec(data, type, fieldTypes, x, y) {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Chart",
    data: { values: data },
    width: width,
    height: height,
    mark: { type: type, tooltip: true },
    encoding: {
      x: { field: x, type: fieldTypes[x] || "nominal", axis: { labelAngle: 0, grid: true } },
      y: { field: y, type: fieldTypes[y] || "quantitative", axis: { labelAngle: 0, grid: true } },
    },
    ...(xAggregate && { encoding: { x: { field: x, type: fieldTypes[x], aggregate: xAggregate, axis: { labelAngle: 0, grid: true } } } }),
    ...(yAggregate && { encoding: { y: { field: y, type: fieldTypes[y], aggregate: yAggregate, axis: { labelAngle: 0, grid: true } } } }),
  };
}

function drawChart(data, type, fieldTypes, x, y) {
  if (x && y && getEle("vizBar")) {
    vegaEmbed("#vizBar", getChartSpec(data, type, fieldTypes, x, y)).catch((e) => {
      console.error("Error rendering chart:", e);
      alert("Failed to render chart.");
    });
  }
}

// Initialization Logic
function initializeApp() {
  // Query parameters
  let params = new URL(document.location).searchParams;

  if (params.get("d") !== null) {
    try {
      input = atob(params.get("d"));
      JSON.parse(input); // Validate JSON
      if (editor) editor.setValue(input);
    } catch (e) {
      console.error("Error decoding or parsing query param 'd':", e);
      alert("Invalid data in query parameter 'd'.");
    }
  }

  // Handle clipboard data
  let c = params.get("c");
  let isJson = params.get("json") !== null;

  if ((c !== null || isJson) && navigator.clipboard) {
    navigator.clipboard.readText().then((clipText) => {
      if (clipText) {
        try {
          if (c !== null) {
            // Assume CSV for ?c
            const parsedCsv = d3.csvParse(clipText.trim());
            if (!parsedCsv.length) throw new Error("Empty or invalid CSV data.");
            input = JSON.stringify(parsedCsv);
            if (editor) {
              editor.setValue(input);
              monaco.editor.setModelLanguage(editor.getModel(), "json");
            }
          } else {
            // Assume JSON for ?json
            JSON.parse(clipText); // Validate JSON
            input = clipText;
            if (editor) {
              editor.setValue(input);
              monaco.editor.setModelLanguage(editor.getModel(), "json");
            }
          }
          renderDataTable(input);
        } catch (e) {
          console.error("Error processing clipboard data:", e);
          alert(`Error processing clipboard data: ${e.message}`);
        }
      } else {
        alert("Clipboard is empty.");
      }
    }).catch((e) => {
      console.error("Clipboard read error:", e);
      alert("Failed to read clipboard data.");
    });
  } else {
    // Render default or ?d data
    renderDataTable(input);
  }

  if (params.get("w") !== null) width = parseInt(params.get("w")) || 400;
  if (params.get("h") !== null) height = parseInt(params.get("h")) || 400;
  if (params.get("t") !== null && chartTypeSelect) {
    type = params.get("t");
    chartTypeSelect.value = type;
  }

  xAggregate = params.get("xa") || null;
  yAggregate = params.get("ya") || null;

  // Event Listeners
  if (xAxisSelect) {
    xAxisSelect.addEventListener("change", () => localStorage.setItem("XValue", xAxisSelect.value));
  }
  if (yAxisSelect) {
    yAxisSelect.addEventListener("change", () => localStorage.setItem("YValue", yAxisSelect.value));
  }
  if (chartTypeSelect) {
    chartTypeSelect.addEventListener("change", () => {
      type = chartTypeSelect.value;
      if (xAxisSelect.value && yAxisSelect.value && currentData) {
        drawChart(currentData, type, currentFieldTypes, xAxisSelect.value, yAxisSelect.value);
      }
    });
  }

  if (fileUpload) {
    fileUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (fileNameDisplay) fileNameDisplay.textContent = `Selected: ${file.name}`;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let data;
          if (file.name.endsWith(".json")) {
            data = JSON.parse(e.target.result);
            if (!Array.isArray(data) || data.length === 0) throw new Error("JSON must be a non-empty array of objects.");
            input = JSON.stringify(data);
            if (editor) {
              editor.setValue(input);
              monaco.editor.setModelLanguage(editor.getModel(), "json");
            }
          } else if (file.name.endsWith(".csv")) {
            data = d3.csvParse(e.target.result);
            if (!data.length) throw new Error("CSV file is empty.");
            input = JSON.stringify(data);
            if (editor) {
              editor.setValue(input);
              monaco.editor.setModelLanguage(editor.getModel(), "json");
            }
          } else {
            throw new Error("Unsupported file format. Please upload JSON or CSV.");
          }
          renderDataTable(input);
        } catch (error) {
          alert(`Error processing file: ${error.message}`);
          if (fileNameDisplay) fileNameDisplay.textContent = "";
          if (fileUpload) fileUpload.value = "";
        }
      };
      reader.onerror = () => {
        alert("Error reading file.");
        if (fileNameDisplay) fileNameDisplay.textContent = "";
        if (fileUpload) fileUpload.value = "";
      };
      reader.readAsText(file);
    });
  }

  if (renderDataBtn) {
    renderDataBtn.addEventListener("click", () => {
      const content = editor?.getValue().trim();
      if (!content) {
        alert("Data input is empty.");
        return;
      }
      try {
        // Try parsing as JSON
        try {
          const parsedJson = JSON.parse(content);
          if (Array.isArray(parsedJson) && parsedJson.length > 0 && typeof parsedJson[0] === "object") {
            input = JSON.stringify(parsedJson);
            monaco.editor.setModelLanguage(editor.getModel(), "json");
            renderDataTable(input);
            return;
          }
        } catch (e) {
          // Not valid JSON, try CSV
        }

        // Try parsing as CSV
        const parsedCsv = d3.csvParse(content);
        if (parsedCsv.length > 0) {
          input = JSON.stringify(parsedCsv);
          if (editor) {
            editor.setValue(input);
            monaco.editor.setModelLanguage(editor.getModel(), "json");
          }
          renderDataTable(input);
          return;
        }

        throw new Error("Invalid data format. Please provide valid JSON or CSV.");
      } catch (e) {
        console.error("Error rendering editor data:", e);
        alert(`Error rendering data: ${e.message}`);
      }
    });
  }

  if (drawBtn) {
    drawBtn.addEventListener("click", () => {
      drawChart(currentData, chartTypeSelect?.value || "bar", currentFieldTypes, xAxisSelect.value, yAxisSelect.value);
      getEle("vizBar")?.focus();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (xAxisSelect) xAxisSelect.value = "";
      if (yAxisSelect) yAxisSelect.value = "";
      if (chartTypeSelect) chartTypeSelect.value = "bar";
      localStorage.removeItem("XValue");
      localStorage.removeItem("YValue");
      type = "bar";
      if (getEle("vizBar")) getEle("vizBar").innerHTML = "";
      if (fileNameDisplay) fileNameDisplay.textContent = "";
      if (fileUpload) fileUpload.value = "";
      if (editor) {
        editor.setValue(input);
        monaco.editor.setModelLanguage(editor.getModel(), "json");
      }
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const params = new URLSearchParams();
      params.set("d", btoa(input));
      params.set("w", width);
      params.set("h", height);
      params.set("t", chartTypeSelect?.value || "bar");
      if (xAggregate) params.set("xa", xAggregate);
      if (yAggregate) params.set("ya", yAggregate);
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard!");
      }).catch(() => alert("Failed to copy link."));
    });
  }

  if (exportImageBtn) {
    exportImageBtn.addEventListener("click", () => {
      if (xAxisSelect.value && yAxisSelect.value) {
        vegaEmbed("#vizBar", getChartSpec(currentData, chartTypeSelect?.value || "bar", currentFieldTypes, xAxisSelect.value, yAxisSelect.value)).then((result) => {
          result.view.toImageURL("png").then((url) => {
            const link = document.createElement("a");
            link.href = url;
            link.download = "chart.png";
            link.click();
          }).catch(() => alert("Failed to export chart image."));
        });
      } else {
        alert("Please select X and Y axes to export chart.");
      }
    });
  }

  if (getEle("mobile-menu-toggle")) {
    getEle("mobile-menu-toggle").addEventListener("click", () => {
      const mobileMenu = getEle("mobile-menu");
      if (mobileMenu) mobileMenu.classList.toggle("hidden");
    });
  }
}