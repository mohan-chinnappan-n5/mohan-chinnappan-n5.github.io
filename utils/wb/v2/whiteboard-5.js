document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const objects = [];
    const undoStack = [];
    const redoStack = [];
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentColor = '#000000';
    let currentTool = 'select';
    let selectedObject = null;
    let offsetX = 0;
    let offsetY = 0;

    function drawObjects() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        objects.forEach(object => {
            context.fillStyle = object.color;
            if (object.type === 'line') {
                context.beginPath();
                context.moveTo(object.startX, object.startY);
                context.lineTo(object.endX, object.endY);
                context.lineWidth = object.thickness;
                context.stroke();
            } else if (object.type === 'circle') {
                context.beginPath();
                context.arc(object.centerX, object.centerY, object.radius, 0, 2 * Math.PI);
                context.fill();
            } else if (object.type === 'text') {
                context.font = `${object.size}px Arial`;
                context.fillText(object.text, object.x, object.y);
            }
        });
    }

    function handleMouseDown(event) {
        isDrawing = true;
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
        console.log(currentTool);

             const foundObject = objects.find(object => {
                if (object.type === 'line') {
                    const { startX, startY, endX, endY } = object;
                    return (
                        startX <= event.clientX &&
                        event.clientX <= endX &&
                        startY <= event.clientY &&
                        event.clientY <= endY
                    );
                } else if (object.type === 'circle') {
                    const { centerX, centerY, radius } = object;
                    const distance = Math.sqrt(
                        Math.pow(centerX - event.clientX, 2) + Math.pow(centerY - event.clientY, 2)
                    );
                    return distance <= radius;
                } else if (object.type === 'text') {
                    const { x, y, width, height } = context.measureText(object.text);
                    return (
                        object.x <= event.clientX &&
                        event.clientX <= object.x + width &&
                        object.y <= event.clientY &&
                        event.clientY <= object.y + height
                    );
                }
            });

            if (foundObject) {
                selectedObject = foundObject;
                offsetX = event.clientX - foundObject.startX;
                offsetY = event.clientY - foundObject.startY;
            }
        
    }

    function handleMouseUp(event) {
        isDrawing = false;

        if (currentTool !== 'select') {
            const endX = event.clientX - canvas.offsetLeft;
            const endY = event.clientY - canvas.offsetTop;

            let object = null;

            if (currentTool === 'line') {
                object = {
                    type: 'line',
                    startX: startX,
                    startY: startY,
                    endX: endX,
                    endY: endY,
                    thickness: document.getElementById('thicknessSelect').value,
                    color: currentColor
                };
                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(endX, endY);
                context.lineWidth = object.thickness;
                context.strokeStyle = object.color;
                context.stroke();
            } else if (currentTool === 'circle') {
                const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2;
                const centerX = startX + (endX - startX) / 2;
                const centerY = startY + (endY - startY) / 2;

                object = {
                    type: 'circle',
                    centerX: centerX,
                    centerY: centerY,
                    radius: radius,
                    thickness: document.getElementById('thicknessSelect').value,
                    color: currentColor
                };

                context.beginPath();
                context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                context.fillStyle = object.color;
                context.fill();
            } else if (currentTool === 'text') {
                const text = prompt('Enter text:');
                if (text) {
                    object = {
                        type: 'text',
                        text: text,
                        x: startX,
                        y: startY,
                        size: 16,
                        color: currentColor
                    };

                    context.font = `${object.size}px Arial`;
                    context.fillStyle = object.color;
                    context.fillText(object.text, object.x, object.y);
                }
            }

            if (object) {
                objects.push(object);
                undoStack.push(object);
                redoStack.length = 0; // Clear redo stack
            }
        } else if (selectedObject) {
            selectedObject = null;
        }

        drawObjects();
    }

    function handleMouseMove(event) {
        if (isDrawing && currentTool !== 'select') {
            drawObjects();
            const endX = event.clientX - canvas.offsetLeft;
            const endY = event.clientY - canvas.offsetTop;

            if (currentTool === 'line') {
                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(endX, endY);
                context.lineWidth = document.getElementById('thicknessSelect').value;
                context.strokeStyle = currentColor;
                context.stroke();
            } else if (currentTool === 'circle') {
                const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2;
                const centerX = startX + (endX - startX) / 2;
                const centerY = startY + (endY - startY) / 2;

                context.beginPath();
                context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                context.fillStyle = currentColor;
                context.fill();
            }
        } else if (selectedObject) {
            const x = event.clientX - offsetX;
            const y = event.clientY - offsetY;

            selectedObject.startX = x;
            selectedObject.startY = y;
            selectedObject.endX = x + selectedObject.endX - selectedObject.startX;
            selectedObject.endY = y + selectedObject.endY - selectedObject.startY;

            drawObjects();
        }
    }

    function handleUndo() {
        if (objects.length > 0) {
            redoStack.push(objects.pop());
            drawObjects();
        }
    }

    function handleRedo() {
        if (redoStack.length > 0) {
            objects.push(redoStack.pop());
            drawObjects();
        }
    }

    function handleColorSelect() {
        currentColor = document.getElementById('colorSelect').value;
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    document.getElementById('undoButton').addEventListener('click', handleUndo);
    document.getElementById('redoButton').addEventListener('click', handleRedo);
    document.getElementById('colorSelect').addEventListener('change', handleColorSelect);
});
