// Get the canvas element and create a 2D drawing context
const canvas = document.getElementById('whiteboard');
const context = canvas.getContext('2d');

// Set the initial color to red
let currentColor = 'red';

// Handle clicks on the palette buttons
const palette = document.getElementById('palette');
palette.addEventListener('click', (event) => {
  if (event.target.id === 'red') {
    currentColor = 'red';
  } else if (event.target.id === 'green') {
    currentColor = 'green';
  } else if (event.target.id === 'blue') {
    currentColor = 'blue';
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
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
    lastX = event.offsetX;
    lastY = event.offsetY;
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
  isDrawing = false;
});

