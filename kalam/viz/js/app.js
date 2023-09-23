//----------------------------
// Flexible chart lib
// mchinnappan
//----------------------------
const WIDTH = 400;
const HEIGHT = 400;

let initData = {
  Apple: {
    Production: 1000,
    Accepted: 800,
    Reject: 200,
  },
  Mango: {
    Production: 1200,
    Accepted: 1000,
    Reject: 200,
  },
  Peach: {
    Production: 800,
    Accepted: 700,
    Reject: 100,
  },
  Plum: {
    Production: 800,
    Accepted: 700,
    Reject: 200,
  },
};
// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('c')) {
  await navigator.clipboard.readText().then((clipText) => {
    initData = JSON.parse(clipText);
  });
}


const getEle = (id) => document.getElementById(id);

const colorScheme = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];

// Function to download SVG content as a file
function downloadSVG(content, fileName) {

   // Wrap the content in an SVG element with the appropriate namespace
   const svgData = `<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`;

  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

// Add a click event listener to the download button
const downloadBarButton = getEle("downloadButtonBar");
downloadBarButton.addEventListener("click", () => {
  // Get the SVG content from the <div> and set it in the editor
  const divElement = document.getElementById("chart");
  const svgContent = divElement.innerHTML;

  // Trigger the download of the SVG content as a file
  downloadSVG(svgContent, "barChart.svg");
});

const downloadButtonPie = getEle("downloadButtonPie");
downloadButtonPie.addEventListener("click", () => {
  // Get the SVG content from the <div> and set it in the editor
  const divElement = document.getElementById("chartPie");
  const svgContent = divElement.innerHTML;

  // Trigger the download of the SVG content as a file
  downloadSVG(svgContent, "pieChart.svg");
});


function setupSelections(jsonData) {
  d3.select("#fruitDropdown").selectAll("*").remove();

  try {
    const fruitOptions = Object.keys(jsonData);
    fruitOptions.forEach((fruit) => {
      const option = document.createElement("option");
      option.value = fruit;
      option.textContent = fruit;
      getEle("fruitDropdown").appendChild(option);
    });
  } catch (error) {
    // alert("Invalid JSON data.");
  }
}

let editor; // Declare editor variable in a global scope
// Function to update the D3.js chart based on selected fruit and JSON data
function updateBarChart(
  data,
  width = WIDTH,
  height = HEIGHT,
  gridColor = "#99ccff"
) {


  const selectedFruit = document.getElementById("fruitDropdown").value ;
  // Filter data for the selected fruit
  const chartData = data[selectedFruit];

  // Clear existing chart
  d3.select("#chart").selectAll("*").remove();

  // Create a bar chart using D3.js
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width_g = +svg.attr("width") - margin.left - margin.right;
  const height_g = +svg.attr("height") - margin.top - margin.bottom;

  const x = d3
    .scaleBand()
    .range([0, width_g])
    .padding(0.1)
    .domain(Object.keys(chartData));

  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(Object.values(chartData))]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.selectAll(".bar")
    .data(Object.entries(chartData))
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d[0]))
    .attr("y", (d) => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height_g - y(d[1]))
    .attr("fill", (d, i) => colorScheme[i % colorScheme.length]); // Apply custom colors
  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height_g})`)
    .call(d3.axisBottom(x));

  g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5));
}

function updatePieChart(
  data,
  width = 600,
  height = 600,
  gridColor = "#99ccff",
  innerRadiusRatio = 3
) {


  const selectedFruit = document.getElementById("fruitDropdown").value ; 
  // Filter data for the selected fruit
  const chartData = data[selectedFruit];

  // Extract labels and values from the JSON data
  const labels = Object.keys(chartData);
  const values = Object.values(chartData);

  // Clear existing chart
  d3.select("#chartPie").selectAll("*").remove();

  // Create a bar chart using D3.js
  const svg = d3
    .select("#chartPie")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width_g = +svg.attr("width") - margin.left - margin.right;
  const height_g = +svg.attr("height") - margin.top - margin.bottom;

  // Create a group element within the SVG and translate it to the center
  const g = svg
    .append("g")
    .attr("transform", `translate(${WIDTH / 2},${HEIGHT / 2})`);

  // Define color scale for segments
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Set the dimensions of the SVG and the radius of the pie chart
  const radius = Math.min(WIDTH, HEIGHT) / 2;

  // Create an arc generator for the pie chart
  const arc = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(radius / innerRadiusRatio);

  // Create a pie generator
  const pie = d3
    .pie()
    .sort(null) // Disable sorting for data consistency
    .value((d) => d);

  // Generate pie chart data
  const arcs = g
    .selectAll(".arc")
    .data(pie(values))
    .enter()
    .append("g")
    .attr("class", "arc");

  // Append path elements for each arc segment
  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i));

  // Add labels for each segment
  arcs
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("dx", "-1.5em")
    .attr("dy", "1.5em")
    .text((d, i) => labels[i]);
}

// Initialize Monaco Editor
require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.24.0/min/vs",
  },
});
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: JSON.stringify(initData, null, 4),
    language: "json",
    theme: "vs-dark",
  });

  editor.onDidChangeModelContent((event) => {
    // Handle the onchange event here
    const newValue = editor.getValue();
    setupSelections(JSON.parse(newValue));
    updateBarChart(JSON.parse(newValue));
    updatePieChart(JSON.parse(newValue));
  });

  const jsonData = editor.getValue();
  setupSelections(JSON.parse(jsonData));
  // Initial chart rendering
  updateBarChart(JSON.parse(jsonData));
  updatePieChart(JSON.parse(jsonData));
});

document.getElementById("fruitDropdown").addEventListener("change", (event) => {
  updateBarChart(JSON.parse(editor.getValue()));
  updatePieChart(JSON.parse(editor.getValue()));
});
