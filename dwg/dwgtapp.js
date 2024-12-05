// dwgtapp.js
// mohan chinnappan

import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";

// Initialize Mermaid
mermaid.initialize({ startOnLoad: true });

// Load content from URL
function loadContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const dataUrl = urlParams.get("data");
  const markdownUrl = urlParams.get("text");
  const title = urlParams.get("title") || "Mermaid Diagram";

  // Set the title dynamically
  document.getElementById("diagram-title").innerText = title;
  document.getElementById("title").innerText = title;

  // Load the Mermaid diagram
  if (dataUrl) {
    fetch(dataUrl)
      .then((response) => response.text())
      .then((data) => {
        const diagramContainer =
          document.getElementById("mermaid-diagram");
        diagramContainer.innerHTML = data;
        mermaid.init(undefined, diagramContainer);
      })
      .catch(() => alert("Failed to load the diagram data!"));
  }

  // Load the Markdown content
  if (markdownUrl) {
    fetch(markdownUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((markdown) => {
        const markdownPane = document.getElementById("markdown-pane");
        markdownPane.innerHTML = marked.parse(markdown);
        markdownPane.classList.remove("hidden");
      })
      .catch(() => alert("Failed to load the Markdown file!"));
  }
}

// Load content when the page loads
window.onload = loadContent;