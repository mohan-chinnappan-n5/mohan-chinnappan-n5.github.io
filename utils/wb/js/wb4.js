// Get the canvas element and create a 2D drawing context
const canvas = document.getElementById("whiteboard");
const context = canvas.getContext("2d");

// Set the initial color to red and the initial tool to circle
let currentColor = "red";
let currentTool = "circle";
let currentText = "";

// Handle clicks on the palette buttons
const palette = document.getElementById("palette");
palette.addEventListener("click", (event) => {
  if (event.target.id === "red") {
    currentColor = "red";
  } else if (event.target.id === "green") {
    currentColor = "green";
  } else if (event.target.id === "blue") {
    currentColor = "blue";
  } else if (event.target.id === "circle") {
    currentTool = "circle";
  } else if (event.target.id === "rectangle") {
    currentTool = "rectangle";
  } else if (event.target.id === "text") {
    currentTool = "text";
  } else if (event.target.id === "undo") {
    undoLastAction();
  }
});

// Handle mouse events on the canvas
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let actions = [];

function undoLastAction() {
  if (actions.length > 0) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    actions.pop();
    actions.forEach((action) => {
      context.strokeStyle = action.color;
      context.fillStyle = action.color;
      if (action.type === "circle") {
        context.beginPath();
        context.arc(action.x, action.y, action.radius, 0, 2 * Math.PI);
        context.stroke();
      } else if (action.type === "rectangle") {
        context.fillRect(action.x, action.y, action.width, action.height);
        context.strokeRect(action.x, action.y, action.width, action.height);
      } else if (action.type === "text") {
        context.font = "30px Arial";
        context.fillText(action.text, action.x, action.y);
      }
    });
  }
}

canvas.addEventListener("mousedown", (event) => {
  isDrawing = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
});

canvas.addEventListener("mousemove", (event) => {
  if (isDrawing) {
    context.strokeStyle = currentColor;
    context.fillStyle = currentColor;
    if (currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(event.offsetX - lastX, 2) + Math.pow(event.offsetY - lastY, 2)
      );
      context.beginPath();
      context.arc(lastX, lastY, radius, 0, 2 * Math.PI);
      context.stroke();
      actions.push({
        type: "circle",
        x: lastX,
        y: lastY,
        radius: radius,
        color: currentColor,
      });
    } else if (currentTool === "rectangle") {
      const width = event.offsetX - lastX;
      const height = event.offsetY - lastY;
      context.fillRect(lastX, lastY, width, height);
      context.strokeRect(lastX, lastY, width, height);
      actions.push({
        type: "rectangle",
        x: lastX,
        y: lastY,
        width: width,
        height: height,
        color: currentColor,
      });
    } else if (currentTool === "text") {
      if (currentText !== "") {
        context.font = "30px Arial";
        context.fillText(currentText, event.offsetX, event.offsetY);
        actions.push({
          type: "text",
          x: event.offsetX,
          y: event.offsetY,
          text: currentText,
          color: currentColor,
        });
        currentText = "";
      }
    }
    lastX = event.offsetX;
    lastY = event.offsetY;
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});
