// xml2json.js
// mohan chinnappan

let initXML = `<yield>
    <fruits>
     <fruit>Mango</fruit>
     <fruit>Peach</fruit>
     <fruit>Plum</fruit>
    </fruits>
     
</yield>
`;

// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("c")) {
  await navigator.clipboard.readText().then((clipText) => {
    initXML = clipText;
  });
}

Split(["#xml", "#content"], { sizes: [50, 50] });

Split(["#je", "#cards"], { sizes: [50, 50] });
let masterLabel;

// Split(["#xmljson", "#bash" ], { sizes: [80, 20] });

const getEle = (id) => document.getElementById(id);


//------ auto complete ---
async function fetchText(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  }
  
  const repoUrl =
    "https://raw.githubusercontent.com/mohan-chinnappan-n/project-docs";
  const listDwg = await fetchText(`${repoUrl}/main/xml/list.txt`);
  const selectionMap = listDwg.trim().split("\n");
  
  
  let typeSelected = "package";
  
  async function loadData(selection) {
    const packageUrl = `${repoUrl}/main/xml/${selection}`;
    const packageData = await fetchText(packageUrl);
    xmlEditor.setValue(packageData);

   }


  function printContent(id, title) {
  const contentToPrint = getEle(id);
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`<html><head><title>${title}</title>`);

  // Include Bootstrap CSS in the print window
  printWindow.document.write(
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">'
  );

  printWindow.document.write("</head><body>");
  printWindow.document.write(contentToPrint.innerHTML);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  //printWindow.print();
}

const downloadButton = getEle("download-button");

function renderFlexiPage(flexiPageRegions) {
  const container = getEle("cardsContainer");

  flexiPageRegions.forEach((region, index) => {
    const regionCard = createCard(region, index);

    if (Array.isArray(region.itemInstances)) {
      region.itemInstances.forEach((itemInstance) => {
        const subCard = createSubCard(itemInstance.componentInstance);
        regionCard.appendChild(subCard);
      });
    } else {
      if (region.itemInstances !== undefined && region.itemInstances.componentInstance !== undefined) {
        const subCard = createSubCard(region.itemInstances.componentInstance);
        regionCard.appendChild(subCard);
      }
    }
    container.appendChild(regionCard);
  });
}
function createSubCard(componentInstance) {
  const subCard = document.createElement("div");
  subCard.className = "sub-card";
  if (componentInstance !== undefined) {
    const componentName = componentInstance.componentName || "Component Name";
    subCard.innerHTML = `
        <h3>${componentName}</h3>
    `;
    let table = `<table class='table table-bordered table-striped table-dark'>
    <thead class="thead-dark">
    <tr><th>name</th><th>value</th></tr>
    </thead>
    `;
    if (Array.isArray(componentInstance.componentInstanceProperties)) {
      componentInstance.componentInstanceProperties.forEach((cip) => {
        if (cip.value !== undefined) {
          table += `<tr><td>${cip.name}</td><td>${cip.value}</td></tr>`;
        } else if (cip.valueList) {
          table += `<tr><td>${cip.name}</td><td>${cip.valueList.valueListItems.value}</td></tr>`;
        }
      });
    } else {
      const cip = componentInstance.componentInstanceProperties;
      if (cip && cip.name && cip.value) {
        table += `<tr><td>${cip.name}</td><td>${cip.value}</td></tr>`;
      }
    }
    table += "</table>";

    let visibilityRule = "";

    if (componentInstance.visibilityRule) {
      visibilityRule += `<pre>${JSON.stringify(
        componentInstance.visibilityRule,
        null,
        4
      )}</pre>`;
    }
    subCard.innerHTML += table + visibilityRule;
  }
  return subCard;
}

function createCard(region, index) {
  const card = document.createElement("div");
  card.className = "card";

  const regionName = region.name || "Region Name";
  const regionType = region.type || "Region Type";

  card.innerHTML = `<h2>(${
    index + 1
  }) ${regionName} </h2><h5>${regionType}</h5>`;

  return card;
}

const jqScript = `
## Exploring Flexipage
## run:
### bash this_script.sh <input.json>
input=$1
numberRegions=\`cat  $input| jq '.FlexiPage.flexiPageRegions' | jq 'length'\`
echo "=== number of Regions = $numberRegions ==="
cat  $input |   jq -c  '.FlexiPage.masterLabel' 
cat  $input |   jq -c  '.FlexiPage.sobjectType' 
echo "======================================="
for ((i = 0; i < $numberRegions; i++)); do
    cat  $input |   jq -c --argjson i "$i"    '.FlexiPage.flexiPageRegions[$i].type' 
    cat  $input |   jq -c --argjson i "$i"    '.FlexiPage.flexiPageRegions[$i].name' 
    cat  $input |   jq -c --argjson i "$i"    '.FlexiPage.flexiPageRegions[$i].itemInstances.componentInstance.componentName'
    echo "$i----------------"
done`;

let xmlEditor;
let jsonEditor;

// create the editor
const container = getEle("jsoneditor");
const options = {
  mode: "tree",
  modes: ["code", "form", "text", "tree", "view", "preview"], // allowed modes
  onModeChange: function (newMode, oldMode) {
    console.log("Mode switched from", oldMode, "to", newMode);
  },
  autocomplete: {
    applyTo: ["value"],
    filter: "contain",
    trigger: "focus",
    getOptions: function (text, path, input, editor) {
      return new Promise(function (resolve, reject) {
        const options = extractUniqueWords(editor.get());
        if (options.length > 0) {
          resolve(options);
        } else {
          reject();
        }
      });
    },
  },
};

// helper function to extract all unique words in the keys and values of a JSON object
function extractUniqueWords(json) {
  return _.uniq(
    _.flatMapDeep(json, function (value, key) {
      return _.isObject(value) ? [key] : [key, String(value)];
    })
  );
}

const editor = new JSONEditor(container, options);

require.config({ paths: { vs: "https://unpkg.com/monaco-editor/min/vs" } });
require(["vs/editor/editor.main"], function () {
  xmlEditor = monaco.editor.create(getEle("editor-xml"), {
    value: initXML,
    language: "xml",
    theme: "vs-dark",
  });

  jsonEditor = monaco.editor.create(getEle("editor-json"), {
    value: "",
    language: "json",
    theme: "vs-dark",
  });

  const x2js = new X2JS();
  function convertXmlToJson() {
    const xmlValue = xmlEditor.getValue();
    try {
      const jsonObj = x2js.xml_str2json(xmlValue);
      jsonEditor.setValue(JSON.stringify(jsonObj, null, 4));
      editor.set(jsonObj);
      if (jsonObj.FlexiPage) {
        masterLabel = jsonObj.FlexiPage.masterLabel;
        getEle("print-cards").style.display = "block";
        getEle("print-cards").addEventListener("click", (event) => {
          printContent(
            "printable",
            `flexiPage-${masterLabel.replace(/ /g, "_")}`
          );
        });
        getEle(
          "masterLabel"
        ).innerHTML = `MasterLabel: <b>${masterLabel} (${jsonObj.FlexiPage.flexiPageRegions.length})</b>
                <br>sObjectType: <b>${jsonObj.FlexiPage.sobjectType}</b>
                <br>templateName:<b> ${jsonObj.FlexiPage.template.name} </b>
                <br>type:<b> ${jsonObj.FlexiPage.type} </b>
                
                `;
        getEle("jq").value = jqScript;
        getEle("jq").style.display = "block";
        renderFlexiPage(jsonObj.FlexiPage.flexiPageRegions);
      }
    } catch (error) {
      console.error("Error converting XML to JSON:", error);
      jsonEditor.setValue("Error converting XML to JSON");
    }
  }
  xmlEditor.onDidChangeModelContent(convertXmlToJson);

  convertXmlToJson();

  //--------
  function downloadJson() {
    const jsonContent = jsonEditor.getValue();
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadButton.addEventListener("click", downloadJson);
});

const jsonFileInput = getEle("jsonFileInput");
jsonFileInput.addEventListener("change", function (event) {
  var file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var content = e.target.result;
      xmlEditor.setValue(content);
    };
  }
  reader.readAsText(file);
});

// Function to handle file drop
function handleFileDrop(e) {
  e.preventDefault();

  const files = e.dataTransfer.files;

  if (files.length > 0) {
    const file = files[0];

    // Check if the dropped file is a text file (you can adjust the condition)
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result;
      xmlEditor.setValue(fileContent);
    };

    reader.readAsText(file);
  }
}

// Function to prevent the default behavior of drag-and-drop
function preventDefault(e) {
  e.preventDefault();
}

// Add event listeners to the drop area
const dropArea = getEle("dropArea");
dropArea.addEventListener("dragenter", preventDefault, false);
dropArea.addEventListener("dragover", preventDefault, false);
dropArea.addEventListener("drop", handleFileDrop, false);

// autocomplete

const acConfigMtype = {
    placeHolder: "Search for XML files...",
    selector: "#autoCompleteMtype",
    data: {
      src: selectionMap,
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