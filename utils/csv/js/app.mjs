//app.js
// mchinnappan
const getEle = (id) => document.getElementById(id);
const urlParams = new URLSearchParams(window.location.search);
const sobject = urlParams.get("so") || "Account";
getEle("sobject").value = sobject;

let outputFilename = "output.json";

Split(["#menu", "#content", "#content2"], { sizes: [30, 30, 30] });

document
  .getElementById("csvFile")
  .addEventListener("change", handleFileSelect, false);

function handleFileSelect(event) {
  const file = event.target.files[0];
  outputFilename = `${file.name}.json`;
  getEle("outfile").value = outputFilename;

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true, // Skip empty lines

    complete: function (results) {
      const jsonData = results.data;
      getEle("json").value = JSON.stringify(jsonData, null, 4);
      json2sfData(jsonData, sobject);
    },
  });
}

const json2sfData = (data, sobject) => {
  for (const [index, element] of data.entries()) {
    const ref = `${sobject}Ref${index}`;
    element["attributes"] = { type: sobject, referenceId: ref };
  }
  const wrapped_data = { records: data };

  getEle("sfjson").value = JSON.stringify(wrapped_data, null, 4);

  getEle("plan").value = JSON.stringify(
    getPlanFile(outputFilename, sobject),
    null,
    4
  );
  getEle("copy").style.display = "block";
  getEle("code").style.display = "block";
};

const getPlanFile = (fileName, sobject) => {
  const plan = [
    {
      sobject: `${sobject}`,
      saveRefs: true,
      resolveRefs: false,
      files: [`${fileName}`],
    },
  ];
  getEle(
    "code"
  ).value = ` sfdx data:tree:import -u  $UN -p plan-${outputFilename}`;

  return plan;
};
getEle("download").addEventListener("click", (event) => {
  const content = getEle("sfjson").value;

  // Create a new Blob object with the content
  const blob = new Blob([content], { type: "text/plain" });

  // Create a temporary anchor element
  const anchor = document.createElement("a");
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = outputFilename;

  // Programmatically click the anchor to trigger the download
  anchor.click();

  // Clean up the temporary anchor
  window.URL.revokeObjectURL(anchor.href);
  anchor.remove();
});

getEle("downloadPlan").addEventListener("click", (event) => {
  const content = getEle("plan").value;

  // Create a new Blob object with the content
  const blob = new Blob([content], { type: "text/plain" });

  // Create a temporary anchor element
  const anchor = document.createElement("a");
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = `plan-${outputFilename}`;

  // Programmatically click the anchor to trigger the download
  anchor.click();

  // Clean up the temporary anchor
  window.URL.revokeObjectURL(anchor.href);
  anchor.remove();
});

getEle("copy").addEventListener("click", (event) => {
  const content = getEle("code").value;

  navigator.clipboard
    .writeText(content)
    .then(() => {
      console.log("Text copied to clipboard");
      // Optionally, you can show a success message or perform other actions
    })
    .catch((error) => {
      console.error("Failed to copy text to clipboard:", error);
      // Optionally, you can show an error message or handle the error
    });
});
