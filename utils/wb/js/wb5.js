const canvas = document.querySelector("#whiteboard");
const context = canvas.getContext("2d");
const colorButtons = document.querySelectorAll(".color-button");
const toolButtons = document.querySelectorAll(".tool-button");
const undoButton = document.querySelector("#undo-button");
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = "black";
let currentTool = "circle";
let currentText = "";
const actions = [];

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentColor = button.dataset.color;
  });
});

toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentTool = button.dataset.tool;
  });
});

undoButton.addEventListener("click", () => {
  actions.pop();
  context.clearRect(0, 0, canvas.width, canvas.height);
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
});

canvas.addEventListener("mousedown", (event) => {
  isDrawing = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
});

canvas.addEventListener("mousemove", (event) => {
  if (isDrawing) {
    if (currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(event.offsetX - lastX, 2) + Math.pow(event.offsetY - lastY, 2)
      );
      context.clearRect(0, 0, canvas.width, canvas.height);
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
      context.beginPath();
      context.arc(lastX, lastY, radius, 0, 2 * Math.PI);
      context.stroke();
      actions.push({
        type: "circle",
        x: lastX,
        y: lastY,
        radius,
        color: currentColor,
      });
    } else if (currentTool === "rectangle") {
      const width = event.offsetX - lastX;
      const height = event.offsetY - lastY;
      context.clearRect(0, 0, canvas.width, canvas.height);
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
      context.fillRect(lastX, lastY, width, height);
      context.strokeRect(lastX, lastY, width, height);
      actions.push({
        type: "rectangle",
        x: lastX,
        y: lastY,
        width,
        height,
        color: currentColor,
      });
    }
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  if (currentTool === "text") {
    const text = prompt("Enter text:");
    if (text) {
      context.font = "30px Arial";
      context.fillText(text, lastX, lastY);
      actions.push({
        type: "text",
        x: lastX,
        y: lastY,
        text,
        color: currentColor,
      });
    }
  }
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
