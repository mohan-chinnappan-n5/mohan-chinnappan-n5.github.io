// fp.js
// mohan chinnappan 

// Load thresholds from localStorage if available
window.onload = function() {
    const minimalThreshold = localStorage.getItem("minimalThreshold");
    const mediumThreshold = localStorage.getItem("mediumThreshold");
    if (minimalThreshold) document.getElementById("minimalThreshold").value = minimalThreshold;
    if (mediumThreshold) document.getElementById("mediumThreshold").value = mediumThreshold;
}

// Store thresholds in localStorage
document.getElementById("minimalThreshold").addEventListener('input', function() {
    localStorage.setItem("minimalThreshold", this.value);
});

document.getElementById("mediumThreshold").addEventListener('input', function() {
    localStorage.setItem("mediumThreshold", this.value);
});


// Analyze Flexipage
async function analyzeFlexipage() {
    const resultDiv = document.getElementById('result');
    const transformedContentDiv = document.getElementById('transformed-content');
    const complexityText = document.getElementById('complexity');
    const regionCountText = document.getElementById('regionCount');
    const componentCountText = document.getElementById('componentCount');
    const htmlOutput = document.getElementById('html-output');

    if (!fileInput.files.length) {
        alert("Please upload a Flexipage XML file.");
        return;
    } 

    const reader = new FileReader();
    reader.onload = async function (e) {

        // Ensure the thresholds are properly retrieved from user input or local storage
        const minimalThreshold = parseInt(document.getElementById("minimalThreshold").value, 10) || 10; // Default to 10 if not set
        const mediumThreshold = parseInt(document.getElementById("mediumThreshold").value, 10) || 50; // Default to 50 if not set

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target.result, "text/xml");

        // Analyze Flexipage
        const regions = xmlDoc.getElementsByTagName("flexiPageRegions");
        const components = xmlDoc.getElementsByTagName("componentInstance");

        const regionCount = regions.length;
        const componentCount = components.length;

        // Determine complexity
        let complexity = "Minimal";
        if (componentCount >= minimalThreshold && componentCount <= mediumThreshold) complexity = "Medium";
        if (componentCount > mediumThreshold) complexity = "Maximal";

        // Display results
        complexityText.innerHTML = `Complexity: <b>${complexity}</b>`;
        regionCountText.textContent = `Regions: ${regionCount}`;
        componentCountText.textContent = `Components: ${componentCount}`;
        resultDiv.classList.remove("hidden");

    





        // Transform XML to HTML using XSLT
        const xsl = await loadXSLT('fp.xsl'); // Load  XSLT file
        if (window.XSLTProcessor) {
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);

            // Display transformed HTML
            htmlOutput.innerHTML = "";
            htmlOutput.appendChild(resultDocument);
            transformedContentDiv.classList.remove("hidden");
        } else {
            alert("Your browser does not support XSLT transformations.");
        }
    };
    reader.readAsText(fileInput.files[0]);
}

// Function to load XSLT (load it from an external file)
async function loadXSLT(xslPath) {
    const response = await fetch(xslPath);
    const xslText = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(xslText, 'application/xml');
}

// Handle Splitter Drag
const splitter = document.getElementById('splitter');
const container = document.getElementById('split-container');

let isDragging = false;

splitter.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.body.style.cursor = 'col-resize';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = container.getBoundingClientRect();
    const offset = e.clientX - rect.left;
    const percentage = (offset / rect.width) * 100;

    // Ensure minimum and maximum widths
    if (percentage > 10 && percentage < 90) {
        container.style.gridTemplateColumns = `${percentage}% 5px ${100 - percentage - 5}%`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'default';
});