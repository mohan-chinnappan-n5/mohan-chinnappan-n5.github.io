
// dwgt.css
// mohan chinnappan

function downloadSVG() {
  const svg = document.querySelector("#mermaid-diagram svg");

  if (!svg) {
    alert("No diagram found!");
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "diagram.svg";
  link.click();
}

// divider related
const divider = document.getElementById("divider");
const markdownPane = document.getElementById("markdown-pane");
const mermaidPane = document.getElementById("mermaid-pane");

let isDragging = false;

divider.addEventListener("mousedown", (e) => {
  isDragging = true;
  document.body.style.cursor = "col-resize";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  // Calculate new widths for the panes
  const totalWidth = divider.parentElement.offsetWidth;
  const offsetX = e.clientX - divider.parentElement.offsetLeft;

  const leftPaneWidth = Math.max(
    100,
    Math.min(offsetX, totalWidth - 100)
  ); // Min: 100px, Max: totalWidth - 100px
  const rightPaneWidth = totalWidth - leftPaneWidth - divider.offsetWidth;

  markdownPane.style.width = `${(leftPaneWidth / totalWidth) * 100}%`;
  mermaidPane.style.width = `${(rightPaneWidth / totalWidth) * 100}%`;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.cursor = "default";
});

// theme support

function toggleTheme() {
  const body = document.body;
  const toggleButton = document.getElementById("theme-toggle");
  const isDarkMode = body.classList.contains("dark");

  if (isDarkMode) {
    body.classList.remove("dark");
    body.classList.add("light");
    toggleButton.innerText = "Enable Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
    toggleButton.innerText = "Enable Light Mode";
    localStorage.setItem("theme", "dark");
  }
}

// Initialize theme on page load
window.onload = function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);
  const toggleButton = document.getElementById("theme-toggle");
  toggleButton.innerText =
    savedTheme === "dark" ? "Enable Light Mode" : "Enable Dark Mode";
  loadContent(); // Existing function to load content
};