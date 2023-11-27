// package bundler builder
// mohan chinnappan
//-----------------------

const urlParams = new URLSearchParams(window.location.search);
const getEle = (id) => document.getElementById(id);

Split(["#code", "#pkg", "#sh"], {
  sizes: [20, 40, 40],
});


 // Load previous input from localStorage
 const savedData = JSON.parse(localStorage.getItem('envData'));
if (savedData) {
  getEle('templateName').value = savedData.templateName;
  getEle('fromFolder').value = savedData.fromFolder;
  getEle('branchName').value = savedData.branchName;
  getEle('userName').value = savedData.userName;
  getEle('testClassList').value = savedData.testClassList;
}

// b0baef6

//import { Types } from "https://cdn.jsdelivr.net/gh/mohan-chinnappan-n/buildv2@b0baef6/bundler/Types.js";
// import { Util  } from "https://cdn.jsdelivr.net/gh/mohan-chinnappan-n/buildv2@b0baef6/bundler/Util.js";
// ref: https://stackoverflow.com/questions/17341122/link-and-execute-external-javascript-file-hosted-on-github/18049842#18049842

import { Types } from "./Types.js?v=101";
import { Util  } from "./Util.js?v=101";

if (urlParams.has("d")) {
  getEle("jsonEditor").style.display = "block";
}

let initData = `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
<version>58.0</version>
    <types>
        <members>GreenPlant</members>
        <members>BrownPaper</members>
        <name>ApexClass</name>
        </types>
    <types>
        <members>HomePage</members>
        <name>FlexiPage</name>
    </types>
</Package>
`;

if (urlParams.has("c")) {
  await navigator.clipboard.readText().then((clipText) => {
    initData = clipText;
  });
}

let bashEditor;
let xmlEditor;

require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
  },
});
require(["vs/editor/editor.main"], function () {
   xmlEditor = monaco.editor.create(document.getElementById("xmlEditor"), {
    value: initData,
    language: "xml",
    theme: "vs-dark",
  });

  var jsonEditor = monaco.editor.create(document.getElementById("jsonEditor"), {
    value: "",
    language: "json",
    theme: "vs-dark",
  });

  var xmlResultEditor = monaco.editor.create(
    document.getElementById("xmlResultEditor"),
    {
      value: "",
      language: "markdown",
      minimap: {
        enabled: false, // This disables the minimap (outline view)
      },
    }
  );

  bashEditor = monaco.editor.create(document.getElementById("bashEditor"), {
    value: `#-------------------------------------------------------------------------
# After clicking the Process button above,
#  Download this bash script by clicking Download Script Button above
#-------------------------------------------------------------------------
`,

    language: "shell",
    theme: "vs-dark",
    minimap: {
      enabled: false, // This disables the minimap (outline view)
    },
  });

  document
    .getElementById("xmlFileInput")
    .addEventListener("change", function (event) {
      var file = event.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          xmlEditor.setValue(e.target.result);
        };
        reader.readAsText(file);
      }
    });

  document
    .getElementById("xmlResultFileInput")
    .addEventListener("change", function (event) {
      var file = event.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          xmlResultEditor.setValue(e.target.result);
        };
        reader.readAsText(file);
      }
    });

  document
    .getElementById("processButton")
    .addEventListener("click", function () {


      var xmlContent = xmlEditor.getValue();
      // Convert XML to JSON (you should implement this logic)
      const {
        json,
        summary,
        copyScript,
        readme,
        pkgFilesCopy,
        envVars,
        zipper,
      } = convertXmlToJson(xmlContent,getEle('templateName').value, getEle('fromFolder').value, getEle('branchName').value,
      getEle('testClassList').value, getEle('userName').value);
      jsonEditor.setValue(json);

      // Convert JSON to Bash (you should implement this logic)
      bashEditor.setValue(`
# Download this bash script by clicking Download Script Button  
#-------------------------------------------------------------------------
# Fill in for TEMPLATE_NAME, FROM_FOLDER, TEST_CLASS_LIST and USERNAME
# run it:  bash  bundle-script.sh 
#  - in a folder where you have package.xml and destructiveChanges
#-------------------------------------------------------------------------
# this script will create zip bundle file and a README.md file
#-------------------------------------------------------------------------
## Modify the following to match your needs as shown above
## ---------------------
${envVars} 
## ---------------------

${pkgFilesCopy}           
${copyScript}
${zipper}

cat << EOF  > README.md

${readme}
EOF

sed -i '' 's/------------------------/\`\`\`/g' README.md

        
`);
      xmlResultEditor.setValue(readme);
    });
});

const xml2json = (xml) => {
  const x2js = new X2JS();
  return x2js.xml_str2json(xml);
};

function convertXmlToJson(xml, templateName, fromFolder, branchName, testClassList, userName ) {
  try {
    const jsonObj = xml2json(xml);
    const typeAndMembers = [];
    const types = jsonObj.Package.types;
    if (Array.isArray(types)) {
      types.forEach((type) => {
        if (Array.isArray(type.members)) {
          typeAndMembers.push({
            type: type.name,
            members: type.members,
          });
        } else {
          typeAndMembers.push({
            type: type.name,
            members: [type.members],
          });
        }
      });
    }
    const summary = [];

    //------------------ to be collected from a from
    const TEMPLATE_NAME = templateName;
    const FROM = fromFolder;
    const TO = "${TO_FOLDER}";

    const TEST_CLASS_LIST = testClassList
    const USERNAME = userName;
    const packageXmlPath = "./package.xml";
    const destructiveXmlPath = "./destructiveChanges.xml";
    // --------------------------------------------

    const copyScript = Util.generateCopyScript(
      `${FROM}`,
      `${TO}`,
      typeAndMembers,
      Types.typeInfoMap,
      summary
    );
    const readme = Util.getReadme(
      `${TEMPLATE_NAME}`,
      TEST_CLASS_LIST,
      USERNAME
    );
    const pkgFilesCopy = Util.copyPkgXmls(
      TEMPLATE_NAME,
      packageXmlPath,
      destructiveXmlPath
    );
    const envVars = Util.getEnvVars(templateName, fromFolder, branchName,testClassList, userName);
    const zipper = Util.getZipper(TEMPLATE_NAME);

    return {
      json: JSON.stringify(typeAndMembers, null, 4),
      summary,
      copyScript,
      readme,
      pkgFilesCopy,
      envVars,
      zipper,
    };
  } catch (error) {
    console.error("Error converting XML to JSON:", error);
    return "Error converting XML to JSON";
  }
}
// init
getEle("processButton").click();

// Function to download the file
function downloadFile() {
  const fileContent = bashEditor.getValue(); // Get the content from Monaco Editor
  const blob = new Blob([fileContent], { type: "text/plain" }); // Create a Blob

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);

  // Set the file name with the input extension
  // a.download = `downloaded_file.${inputExtension}`;
  // Set the file name with the original uploaded file name and extension
  a.download = "bundle-script.sh";
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
}

getEle("downloadScript").addEventListener("click", downloadFile);
let originalFileName;
// drag n drop
// Function to handle file drop
function handleFileDrop(e) {
    e.preventDefault();
  
    const files = e.dataTransfer.files;
  
    if (files.length > 0) {
      const file = files[0];
      // Store the original uploaded file name
      originalFileName = file.name;
  
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
  const dropArea = document.getElementById("dropArea");
  dropArea.addEventListener("dragenter", preventDefault, false);
  dropArea.addEventListener("dragover", preventDefault, false);
  dropArea.addEventListener("drop", handleFileDrop, false);
  
