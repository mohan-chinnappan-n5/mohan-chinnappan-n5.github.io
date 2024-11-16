// Utility to get query parameters from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Load the Markdown content dynamically
async function loadMarkdown() {
  const markdownFile = getQueryParam("data");

  if (!markdownFile) {
    document.getElementById("markdown-content").innerHTML =
      "<p class='text-red-500'>No file specified in the 'data' parameter.</p>";
    return;
  }

  try {
    const response = await fetch(markdownFile);
    if (response.ok) {
      const markdown = await response.text();
      renderMarkdown(markdown);
    } else {
      document.getElementById("markdown-content").innerHTML =
        "<p class='text-red-500'>Failed to load the specified file.</p>";
    }
  } catch (error) {
    document.getElementById("markdown-content").innerHTML =
      "<p class='text-red-500'>Error loading file: " + error.message + "</p>";
  }
}

// Render Markdown content
function renderMarkdown(markdown) {
  const htmlContent = marked.marked(markdown); // Use Marked.js for rendering
  document.getElementById("markdown-content").innerHTML = htmlContent;

  // Ensure MathJax processes the newly added content
  if (window.MathJax) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById("markdown-content")]);
  } else {
    console.error("MathJax not loaded.");
  }
}

// Initialize
loadMarkdown();