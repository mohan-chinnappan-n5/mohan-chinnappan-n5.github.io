window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    let currentTool = 'select';
    let startX, startY;
    let selectedObject = null;
    let objects = [];
    let undoStack = [];
    let currentColor = '#000000';
    
    function drawLine(x1, y1, x2, y2, color) {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
    
    function drawCircle(x, y, radius, color) {
        context.strokeStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.stroke();
    }
    
    function drawObjects() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        for (const object of objects) {
            context.strokeStyle = object.color;
            
            if (object.type === 'line') {
                drawLine(object.startX, object.startY, object.endX, object.endY, object.color);
            } else if (object.type === 'circle') {
                drawCircle(object.x, object.y, object.radius, object.color);
            } else if (object.type === 'text') {
                context.fillStyle = object.color;
                context.fillText(object.text, object.x, object.y);
            }
        }
    }
    
    function handleMouseDown(event) {
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        
        if (currentTool === 'select') {
            selectedObject = null;
            
            for (let i = objects.length - 1; i >= 0; i--) {
                const object = objects[i];
                
                if (
                    object.type === 'line' &&
                    startX >= object.startX && startX <= object.endX &&
                    startY >= object.startY && startY <= object.endY
                ) {
                    selectedObject = object;
                    break;
                } else if (
                    object.type === 'circle' &&
                    Math.sqrt(Math.pow(startX - object.x, 2) + Math.pow(startY - object.y, 2)) <= object.radius
                ) {
                    selectedObject = object;
                    break;
                }
            }
        }
    }
    
    function handleMouseUp(event) {
        const endX = event.clientX - canvas.offsetLeft;
        const endY = event.clientY - canvas.offsetTop;
        
        if (currentTool === 'select') {
            selectedObject = null;
        } else {
            let object = null;
            
            if (currentTool === 'line') {
                object = {
                    type: 'line',
                    startX: startX,
                    startY: startY,
                    endX: endX,
                    endY: endY,
                    color: currentColor
                };
                drawLine(startX, startY, endX, endY, currentColor);
            } else if (currentTool === 'circle') {
                const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                object = {
                    type: 'circle',
                    x: startX,
                    y: startY,
                    radius: radius,
                    color: currentColor
                };
                drawCircle(startX, startY, radius, currentColor);
            } else if (currentTool === 'text') {
                const text = prompt('Enter text:');
                if (text) {
                    object = {
                        type: 'text',
                        text: text,
                        x: startX,
                        y: startY,
                        color: currentColor
                    };
                    context.fillStyle = currentColor;
                    context.fillText(text, startX, startY);
                }
            }
            
            if (object) {
                objects.push(object);
                undoStack.push(object);
            }
        }
    }
    
    function undo() {
        if (undoStack.length > 0) {
            const lastObject = undoStack.pop();
            objects = objects.filter(obj => obj !== lastObject);
            drawObjects();
        }
    }
    
    function selectColor(color) {
        currentColor = color;
        if (currentTool === 'text') {
            context.fillStyle = currentColor;
        }
    }

       // Function to handle tool selection
       function selectTool(tool) {
        currentTool = tool;
        canvas.style.cursor = (tool === 'select') ? 'default' : 'crosshair';
    }
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    document.getElementById('selectTool').addEventListener('click', () => {
        currentTool = 'select';
        canvas.style.cursor = 'default';
    });
    document.getElementById('lineTool').addEventListener('click', () => {
        currentTool = 'line';
        canvas.style.cursor = 'crosshair';
    });
    document.getElementById('circleTool').addEventListener('click', () => {
        currentTool = 'circle';
        canvas.style.cursor = 'crosshair';
    });
    document.getElementById('textTool').addEventListener('click', () => {
        currentTool = 'text';
        canvas.style.cursor = 'crosshair';
    });
    document.getElementById('moveTool').addEventListener('click', () => {
        currentTool = 'select';
        canvas.style.cursor = 'default';
    });
    document.getElementById('undoButton').addEventListener('click', undo);
    document.getElementById('colorSelect').addEventListener('change', event => selectColor(event.target.value));
    
    context.font = '14px Arial';
    context.fillStyle = currentColor;
});    