// Get the canvas element and create a 2D drawing context
const canvas = document.getElementById('whiteboard');
const context = canvas.getContext('2d');

// Set the initial color to red and the initial tool to circle
let currentColor = 'red';
let currentTool = 'circle';

// Handle clicks on the palette buttons
const palette = document.getElementById('palette');
palette.addEventListener('click', (event) => {
  if (event.target.id === 'red') {
    currentColor = 'red';
  } else if (event.target.id === 'green') {
    currentColor = 'green';
  } else if (event.target.id === 'blue') {
    currentColor = 'blue';
  } else if (event.target.id === 'circle') {
    currentTool = 'circle';
  } else if (event.target.id === 'rectangle') {
    currentTool = 'rectangle';
  }
});

// Handle mouse events on the canvas
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (event) => {
  isDrawing = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
});

canvas.addEventListener('mousemove', (event) => {
  if (isDrawing) {
    context.strokeStyle = currentColor;
    context.fillStyle = currentColor;
    if (currentTool === 'circle') {
      const radius = Math.sqrt((event.offsetX - lastX) ** 2 + (event.offsetY - lastY) ** 2);
      context.beginPath();
      context.arc(lastX, lastY, radius, 0, 2 * Math.PI);
      context.stroke();
    } else if (currentTool === 'rectangle') {
      const width = event.offsetX - lastX;
      const height = event.offsetY - lastY;
      context.fillRect(lastX, lastY, width, height);
      context.strokeRect(lastX, lastY, width, height);
    }
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
  isDrawing = false;
});

