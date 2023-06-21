window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    let currentTool = 'select';
    let startX, startY;
    
    // Function to draw a line
    function drawLine(x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
    
    // Function to draw a circle
    function drawCircle(x, y, radius) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.stroke();
    }
    
    // Function to handle mouse down event
    function handleMouseDown(event) {
        startX = event.clientX - canvas.offsetLeft;
        startY = event.clientY - canvas.offsetTop;
    }
    
    // Function to handle mouse up event
    function handleMouseUp(event) {
        const endX = event.clientX - canvas.offsetLeft;
        const endY = event.clientY - canvas.offsetTop;
        
        switch (currentTool) {
            case 'select':
                // Handle selection logic
                break;
            case 'line':
                drawLine(startX, startY, endX, endY);
                break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                drawCircle(startX, startY, radius);
                break;
            case 'text':
                const text = prompt('Enter text:');
                if (text) {
                    context.fillText(text, startX, startY);
                }
                break;
        }
    }
    
    // Function to handle tool selection
    function selectTool(tool) {
        currentTool = tool;
        canvas.style.cursor = (tool === 'select') ? 'default' : 'crosshair';
    }
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    document.getElementById('selectTool').addEventListener('click', () => selectTool('select'));
    document.getElementById('lineTool').addEventListener('click', () => selectTool('line'));
    document.getElementById('circleTool').addEventListener('click', () => selectTool('circle'));
    document.getElementById('textTool').addEventListener('click', () => selectTool('text'));
});

