// Initialize Split.js
Split(["#left", "#right"], { sizes: [20, 80] });

// Initialize Konva.js canvas
const canvasWidth = document.getElementById('whiteboard-canvas').offsetWidth;
const canvas = new Konva.Stage({
  container: 'whiteboard-canvas',
  width: canvasWidth,
  height: 600
});
const layer = new Konva.Layer();
canvas.add(layer);

// Store items, connections, and history
let items = [];
let connections = [];
let selectedItem = null;
let history = [];
let redoStack = [];
let konvaItems = new Map();
let isDrawing = false;
let currentLine = null;
let contextMenuTarget = null;

// Context Menu
const contextMenu = document.getElementById('context-menu');
const deleteOption = document.getElementById('delete-option');
const textEditOption = document.getElementById('text-edit-option');

// Text Input for Editing
const textInput = document.getElementById('text-input');
let editingTextItem = null;

// Hide context menu and text input when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!contextMenu.contains(e.target)) {
    contextMenu.style.display = 'none';
    contextMenuTarget = null;
  }
  if (editingTextItem) {
    finishTextEditing();
  }
});

// Palette interactions
const paletteItems = document.querySelectorAll('.palette-item');
paletteItems.forEach(item => {
  if (item.dataset.type === 'freehand') {
    item.addEventListener('click', () => {
      isDrawing = !isDrawing;
      paletteItems.forEach(i => i.classList.remove('active-tool'));
      if (isDrawing) {
        item.classList.add('active-tool');
        canvas.container().style.cursor = 'crosshair';
      } else {
        item.classList.remove('active-tool');
        canvas.container().style.cursor = 'default';
      }
    });
  } else {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.type);
      isDrawing = false;
      paletteItems.forEach(i => i.classList.remove('active-tool'));
      canvas.container().style.cursor = 'default';
    });
  }
});

// Canvas drag-and-drop
const canvasContainer = canvas.container();
canvasContainer.addEventListener('dragover', (e) => e.preventDefault());
canvasContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('text/plain');
  const rect = canvasContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  addItem(type, x, y);
});

// Freehand drawing
canvasContainer.addEventListener('mousedown', (e) => {
  if (!isDrawing) return;
  const pos = canvas.getPointerPosition();
  currentLine = new Konva.Line({
    stroke: 'black',
    strokeWidth: 2,
    points: [pos.x, pos.y],
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(currentLine);
  layer.draw();

  const itemId = `item_${items.length + 1}`;
  const itemData = { id: itemId, type: 'freehand', points: [pos.x, pos.y] };
  items.push(itemData);
  konvaItems.set(itemId, { group: null, shape: currentLine, transformer: null });
  history.push({ action: 'add', item: itemData });
  redoStack = [];

  // Right-click to show context menu for freehand drawing
  currentLine.on('contextmenu', (e) => {
    e.evt.preventDefault();
    contextMenuTarget = { id: itemId, item: currentLine, itemData };
    textEditOption.style.display = 'none'; // Hide text edit for freehand
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.evt.clientX}px`;
    contextMenu.style.top = `${e.evt.clientY}px`;
  });
});

canvasContainer.addEventListener('mousemove', (e) => {
  if (!isDrawing || !currentLine) return;
  const pos = canvas.getPointerPosition();
  const item = items.find(i => i.id === `item_${items.length}`);
  if (item) {
    item.points = item.points.concat([pos.x, pos.y]);
    currentLine.points(item.points);
    layer.draw();
  }
});

canvasContainer.addEventListener('mouseup', () => {
  if (!isDrawing || !currentLine) return;
  currentLine = null;
});

// Function to add an item to the canvas
function addItem(type, x, y) {
  const item = new Konva.Group({
    x: Math.max(0, Math.min(x - 50, canvas.width() - 100)),
    y: Math.max(0, Math.min(y - 25, canvas.height() - 50)),
    draggable: true
  });

  // Define itemId early to avoid reference errors
  const itemId = `item_${items.length + 1}`;

  let shape;
  let tr;
  let handles;

  if (type === 'line') {
    shape = new Konva.Line({
      points: [0, 0, 100, 0],
      stroke: 'black',
      strokeWidth: 2
    });

    // Add handles for moving the line endpoints
    const handle1 = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 5,
      fill: 'red',
      draggable: true
    });
    const handle2 = new Konva.Circle({
      x: 100,
      y: 0,
      radius: 5,
      fill: 'red',
      draggable: true
    });

    item.add(shape, handle1, handle2);
    handles = [handle1, handle2];

    // Update line points when handles are dragged
    handle1.on('dragmove', () => {
      const points = shape.points();
      shape.points([handle1.x(), handle1.y(), points[2], points[3]]);
      layer.draw();
      updateItemPoints(itemId, [handle1.x() + item.x(), handle1.y() + item.y(), handle2.x() + item.x(), handle2.y() + item.y()]);
      history.push({ action: 'moveLine', itemId, points: [handle1.x() + item.x(), handle1.y() + item.y(), handle2.x() + item.x(), handle2.y() + item.y()] });
      redoStack = [];
      snapToNearestItem(handle1, item);
    });

    handle2.on('dragmove', () => {
      const points = shape.points();
      shape.points([points[0], points[1], handle2.x(), handle2.y()]);
      layer.draw();
      updateItemPoints(itemId, [handle1.x() + item.x(), handle1.y() + item.y(), handle2.x() + item.x(), handle2.y() + item.y()]);
      history.push({ action: 'moveLine', itemId, points: [handle1.x() + item.x(), handle1.y() + item.y(), handle2.x() + item.x(), handle2.y() + item.y()] });
      redoStack = [];
      snapToNearestItem(handle2, item);
    });
  } else if (type === 'box') {
    shape = new Konva.Rect({
      width: 100,
      height: 50,
      fill: 'lightblue',
      stroke: 'black',
      strokeWidth: 1
    });
  } else if (type === 'circle') {
    shape = new Konva.Circle({
      radius: 30,
      fill: 'lightgreen',
      stroke: 'black',
      strokeWidth: 1
    });
  } else if (type === 'text') {
    shape = new Konva.Text({
      text: 'Text',
      fontSize: 20,
      fontFamily: 'Arial',
      fill: 'black'
    });
  }

  // Add transformer for resizing (except for lines)
  if (type !== 'line') {
    tr = new Konva.Transformer({
      nodes: [shape],
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 20 || newBox.height < 20) {
          return oldBox;
        }
        return newBox;
      }
    });
  }

  item.add(shape);
  layer.add(item);
  if (tr) {
    layer.add(tr); // Ensure the transformer is added to the layer
  }
  layer.draw();

  const itemData = { 
    id: itemId, 
    type, 
    x: item.x(), 
    y: item.y(), 
    width: shape.width(), 
    height: shape.height(),
    points: type === 'line' ? [item.x(), item.y(), item.x() + 100, item.y()] : undefined,
    text: type === 'text' ? 'Text' : undefined
  };
  items.push(itemData);
  konvaItems.set(itemId, { group: item, shape, transformer: tr, handles: handles });
  history.push({ action: 'add', item: itemData });
  redoStack = [];

  // Click to select and show transformer or connect
  item.on('click', (e) => {
    e.evt.stopPropagation(); // Prevent event bubbling to the stage
    if (e.evt.shiftKey) { // Shift-click to connect
      if (selectedItem) {
        const fromId = selectedItem;
        const toId = itemId;
        if (fromId !== toId && !connections.some(c => c.from === fromId && c.to === toId)) {
          connections.push({ from: fromId, to: toId });
          history.push({ action: 'connect', from: fromId, to: toId });
          redoStack = [];
          drawConnection(fromId, toId);
          selectedItem = null;
          clearSelection();
        }
      } else {
        selectedItem = itemId;
        shape.stroke('yellow').strokeWidth(3);
        layer.draw();
      }
    } else if (type !== 'text') { // Regular click to show transformer (except for text)
      layer.find('Transformer').forEach(t => t.detach());
      if (tr) {
        tr.nodes([shape]);
        layer.add(tr);
      }
      layer.draw();
    }
  });

  // Double-click to edit text (no delete functionality)
  item.on('dblclick', () => {
    if (type === 'text') {
      startTextEditing(item, shape, itemData);
    }
  });

  // Right-click to show context menu
  item.on('contextmenu', (e) => {
    e.evt.preventDefault();
    contextMenuTarget = { id: itemId, item, itemData };
    textEditOption.style.display = (type === 'text') ? 'block' : 'none';
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.evt.clientX}px`;
    contextMenu.style.top = `${e.evt.clientY}px`;
  });

  // Drag move
  item.on('dragmove', () => {
    updateItemPosition(itemId, item.x(), item.y());
    history.push({ action: 'move', itemId, x: item.x(), y: item.y() });
    redoStack = [];
    if (type === 'line') {
      updateItemPoints(itemId, [item.x(), item.y(), item.x() + 100, item.y()]);
    }
    redrawConnections();
  });

  // Resize via transformer
  if (type !== 'line') {
    shape.on('transform', () => {
      history.push({ action: 'resize', itemId, width: shape.width() * shape.scaleX(), height: shape.height() * shape.scaleY() });
      redoStack = [];
      updateItemSize(itemId, shape.width() * shape.scaleX(), shape.height() * shape.scaleY());
      shape.scaleX(1);
      shape.scaleY(1);
      redrawConnections();
    });
  }
}

// Function to start text editing
function startTextEditing(group, shape, itemData) {
  editingTextItem = { group, shape, itemData };
  const absPos = group.getAbsolutePosition();
  textInput.style.display = 'block';
  textInput.style.left = `${absPos.x}px`;
  textInput.style.top = `${absPos.y}px`;
  textInput.value = itemData.text || 'Text';
  textInput.focus();
}

// Function to finish text editing
function finishTextEditing() {
  if (!editingTextItem || !editingTextItem.itemData || !editingTextItem.shape) {
    textInput.style.display = 'none';
    editingTextItem = null;
    return;
  }
  const { shape, itemData } = editingTextItem;
  const newText = textInput.value.trim();
  if (newText) {
    shape.text(newText);
    itemData.text = newText;
    history.push({ action: 'editText', itemId: itemData.id, text: newText });
    redoStack = [];
  }
  textInput.style.display = 'none';
  layer.draw();
  editingTextItem = null;
}

// Handle text input events
textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    finishTextEditing();
  }
});

// Function to snap line handles to nearest item
function snapToNearestItem(handle, lineGroup) {
  const handlePos = { x: handle.x() + lineGroup.x(), y: handle.y() + lineGroup.y() };
  let closestPoint = null;
  let minDistance = Infinity;

  items.forEach(item => {
    if (item.type === 'box' || item.type === 'circle') {
      const centerX = item.x + (item.type === 'circle' ? item.width / 2 : item.width / 2);
      const centerY = item.y + (item.type === 'circle' ? item.height / 2 : item.height / 2);
      const points = [
        { x: item.x, y: item.y }, // Top-left
        { x: item.x + item.width, y: item.y }, // Top-right
        { x: item.x, y: item.y + item.height }, // Bottom-left
        { x: item.x + item.width, y: item.y + item.height }, // Bottom-right
        { x: centerX, y: item.y }, // Top-center
        { x: centerX, y: item.y + item.height }, // Bottom-center
        { x: item.x, y: centerY }, // Left-center
        { x: item.x + item.width, y: centerY } // Right-center
      ];

      points.forEach(point => {
        const distance = Math.sqrt(Math.pow(handlePos.x - point.x, 2) + Math.pow(handlePos.y - point.y, 2));
        if (distance < minDistance && distance < 20) { // Snap within 20 pixels
          minDistance = distance;
          closestPoint = point;
        }
      });
    }
  });

  if (closestPoint) {
    handle.x(closestPoint.x - lineGroup.x());
    handle.y(closestPoint.y - lineGroup.y());
    const konvaItem = konvaItems.get(lineGroup.id());
    if (konvaItem) {
      const points = konvaItem.shape.points();
      const handleIndex = konvaItem.handles[0] === handle ? 0 : 2;
      points[handleIndex] = handle.x();
      points[handleIndex + 1] = handle.y();
      konvaItem.shape.points(points);
      updateItemPoints(lineGroup.id(), [points[0] + lineGroup.x(), points[1] + lineGroup.y(), points[2] + lineGroup.x(), points[3] + lineGroup.y()]);
    }
    layer.draw();
  }
}

// Function to update item position
function updateItemPosition(itemId, x, y) {
  const item = items.find(i => i.id === itemId);
  if (item) {
    item.x = x;
    item.y = y;
    if (item.type === 'line' && item.points) {
      const dx = x - (item.points[0] - item.points[2] / 2);
      const dy = y - (item.points[1] - item.points[3] / 2);
      item.points = [item.points[0] + dx, item.points[1] + dy, item.points[2] + dx, item.points[3] + dy];
    }
  }
}

// Function to update item size
function updateItemSize(itemId, width, height) {
  const item = items.find(i => i.id === itemId);
  if (item) {
    item.width = width;
    item.height = height;
  }
}

// Function to update line points
function updateItemPoints(itemId, points) {
  const item = items.find(i => i.id === itemId);
  if (item) {
    item.points = points;
  }
}

// Function to draw a connection with plus icon
function drawConnection(fromId, toId) {
  const fromItem = items.find(i => i.id === fromId);
  const toItem = items.find(i => i.id === toId);
  if (!fromItem || !toItem) return;

  const fromPos = { x: fromItem.x + (fromItem.type === 'circle' ? fromItem.width / 2 : fromItem.width / 2), y: fromItem.y + (fromItem.type === 'circle' ? fromItem.height / 2 : fromItem.height / 2) };
  const toPos = { x: toItem.x + (toItem.type === 'circle' ? toItem.width / 2 : toItem.width / 2), y: toItem.y + (toItem.type === 'circle' ? toItem.height / 2 : toItem.height / 2) };

  const midPoint = {
    x: (fromPos.x + toPos.x) / 2,
    y: (fromPos.y + toPos.y) / 2
  };

  const line = new Konva.Line({
    points: [fromPos.x, fromPos.y, midPoint.x, midPoint.y, toPos.x, toPos.y],
    stroke: 'black',
    strokeWidth: 2
  });

  const plusIcon = new Konva.Group({
    x: midPoint.x - 10,
    y: midPoint.y - 10
  });
  const plusCircle = new Konva.Circle({
    radius: 10,
    fill: 'white',
    stroke: 'gray',
    strokeWidth: 1
  });
  const plusText = new Konva.Text({
    text: '+',
    fontSize: 14,
    fontFamily: 'Arial',
    fill: 'gray',
    width: 20,
    height: 20,
    align: 'center',
    verticalAlign: 'middle'
  });
  plusIcon.add(plusCircle, plusText);

  layer.add(line, plusIcon);
  layer.draw();
}

// Function to clear selection highlight
function clearSelection() {
  layer.find('Rect, Circle, Line').forEach(shape => {
    shape.stroke('black').strokeWidth(shape instanceof Konva.Line ? 2 : 1);
  });
  layer.draw();
}

// Function to redraw connections
function redrawConnections() {
  layer.find('Line, .plus-icon').forEach(element => {
    if (!element.points || element.points().length < 4) element.destroy();
  });
  connections.forEach(conn => {
    drawConnection(conn.from, conn.to);
  });
  layer.draw();
}

// Handle context menu delete action
deleteOption.addEventListener('click', () => {
  if (!contextMenuTarget) return;
  const { id, item, itemData } = contextMenuTarget;
  if (item) {
    item.destroy();
  }
  connections = connections.filter(c => c.from !== id && c.to !== id);
  layer.draw();
  items = items.filter(i => i.id !== id);
  konvaItems.delete(id);
  history.push({ action: 'delete', item: itemData });
  redoStack = [];
  redrawConnections();
  contextMenu.style.display = 'none';
  contextMenuTarget = null;
});

// Handle context menu text edit action
textEditOption.addEventListener('click', () => {
  if (!contextMenuTarget) return;
  const { id, item, itemData } = contextMenuTarget;
  const konvaItem = konvaItems.get(id);
  if (konvaItem && itemData.type === 'text') {
    startTextEditing(item, konvaItem.shape, itemData);
  }
  contextMenu.style.display = 'none';
  contextMenuTarget = null;
});

// Undo function
document.getElementById('undo-btn').addEventListener('click', () => {
  if (history.length === 0) return;
  const lastAction = history.pop();
  redoStack.push(lastAction);

  if (lastAction.action === 'add') {
    const itemId = lastAction.item.id;
    const konvaItem = konvaItems.get(itemId);
    if (konvaItem) {
      if (konvaItem.group) konvaItem.group.destroy();
      else if (konvaItem.shape) konvaItem.shape.destroy();
      konvaItems.delete(itemId);
    }
    items = items.filter(i => i.id !== itemId);
    connections = connections.filter(c => c.from !== itemId && c.to !== itemId);
    redrawConnections();
  } else if (lastAction.action === 'delete') {
    const itemData = lastAction.item;
    if (itemData.type === 'freehand') {
      const line = new Konva.Line({
        stroke: 'black',
        strokeWidth: 2,
        points: itemData.points,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(line);
      items.push(itemData);
      konvaItems.set(itemData.id, { group: null, shape: line, transformer: null });

      line.on('contextmenu', (e) => {
        e.evt.preventDefault();
        contextMenuTarget = { id: itemData.id, item: line, itemData };
        textEditOption.style.display = 'none';
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.evt.clientX}px`;
        contextMenu.style.top = `${e.evt.clientY}px`;
      });
    } else {
      addItem(itemData.type, itemData.x, itemData.y);
      const konvaItem = konvaItems.get(itemData.id);
      if (konvaItem) {
        konvaItem.shape.width(itemData.width);
        konvaItem.shape.height(itemData.height);
        konvaItem.group.x(itemData.x);
        konvaItem.group.y(itemData.y);
        if (itemData.type === 'text') {
          konvaItem.shape.text(itemData.text);
        }
        if (itemData.type === 'line' && itemData.points) {
          const points = itemData.points;
          konvaItem.shape.points([points[0] - itemData.x, points[1] - itemData.y, points[2] - itemData.x, points[3] - itemData.y]);
          if (konvaItem.handles) {
            konvaItem.handles[0].position({ x: points[0] - itemData.x, y: points[1] - itemData.y });
            konvaItem.handles[1].position({ x: points[2] - itemData.x, y: points[3] - itemData.y });
          }
        }
      }
    }
    redrawConnections();
  } else if (lastAction.action === 'move') {
    const itemId = lastAction.itemId;
    const item = items.find(i => i.id === itemId);
    const konvaItem = konvaItems.get(itemId);
    if (item && konvaItem) {
      const prevAction = history.findLast(h => (h.action === 'move' || h.action === 'add') && h.itemId === itemId && h !== lastAction);
      const prevX = prevAction ? (prevAction.x || prevAction.item.x) : item.x;
      const prevY = prevAction ? (prevAction.y || prevAction.item.y) : item.y;
      item.x = prevX;
      item.y = prevY;
      konvaItem.group.x(prevX);
      konvaItem.group.y(prevY);
      if (item.type === 'line' && item.points) {
        const dx = prevX - lastAction.x;
        const dy = prevY - lastAction.y;
        item.points = item.points.map((p, i) => i % 2 === 0 ? p + dx : p + dy);
        const points = item.points;
        konvaItem.shape.points([points[0] - prevX, points[1] - prevY, points[2] - prevX, points[3] - prevY]);
        if (konvaItem.handles) {
          konvaItem.handles[0].position({ x: points[0] - prevX, y: points[1] - prevY });
          konvaItem.handles[1].position({ x: points[2] - prevX, y: points[3] - prevY });
        }
      }
      redrawConnections();
    }
  } else if (lastAction.action === 'resize') {
    const itemId = lastAction.itemId;
    const item = items.find(i => i.id === itemId);
    const konvaItem = konvaItems.get(itemId);
    if (item && konvaItem) {
      const prevAction = history.findLast(h => (h.action === 'resize' || h.action === 'add') && h.itemId === itemId && h !== lastAction);
      const prevWidth = prevAction ? (prevAction.width || prevAction.item.width) : item.width;
      const prevHeight = prevAction ? (prevAction.height || prevAction.item.height) : item.height;
      item.width = prevWidth;
      item.height = prevHeight;
      if (item.type === 'circle') {
        konvaItem.shape.radius(prevWidth / 2);
        item.height = prevWidth; // Keep circle proportional
      } else {
        konvaItem.shape.width(prevWidth);
        konvaItem.shape.height(prevHeight);
      }
      redrawConnections();
    }
  } else if (lastAction.action === 'connect') {
    connections = connections.filter(c => !(c.from === lastAction.from && c.to === lastAction.to));
    redrawConnections();
  } else if (lastAction.action === 'editText') {
    const itemId = lastAction.itemId;
    const item = items.find(i => i.id === itemId);
    const konvaItem = konvaItems.get(itemId);
    if (item && konvaItem) {
      const prevAction = history.findLast(h => (h.action === 'editText' || h.action === 'add') && h.itemId === itemId && h !== lastAction);
      const prevText = prevAction ? (prevAction.text || prevAction.item.text) : item.text;
      item.text = prevText;
      konvaItem.shape.text(prevText);
      layer.draw();
    }
  } else if (lastAction.action === 'moveLine') {
    const itemId = lastAction.itemId;
    const item = items.find(i => i.id === itemId);
    const konvaItem = konvaItems.get(itemId);
    if (item && konvaItem) {
      const prevAction = history.findLast(h => (h.action === 'moveLine' || h.action === 'add') && h.itemId === itemId && h !== lastAction);
      const prevPoints = prevAction ? (prevAction.points || prevAction.item.points) : item.points;
      item.points = prevPoints;
      konvaItem.shape.points([prevPoints[0] - item.x, prevPoints[1] - item.y, prevPoints[2] - item.x, prevPoints[3] - item.y]);
      if (konvaItem.handles) {
        konvaItem.handles[0].position({ x: prevPoints[0] - item.x, y: prevPoints[1] - item.y });
        konvaItem.handles[1].position({ x: prevPoints[2] - item.x, y: prevPoints[3] - item.y });
      }
      layer.draw();
    }
  }
  layer.draw();
});

// Redo function
document.getElementById('redo-btn').addEventListener('click', () => {
  if (redoStack.length === 0) return;
  const action = redoStack.pop();
  history.push(action);

  if (action.action === 'add') {
    const itemData = action.item;
    if (itemData.type === 'freehand') {
      const line = new Konva.Line({
        stroke: 'black',
        strokeWidth: 2,
        points: itemData.points,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(line);
      items.push(itemData);
      konvaItems.set(itemData.id, { group: null, shape: line, transformer: null });

      line.on('contextmenu', (e) => {
        e.evt.preventDefault();
        contextMenuTarget = { id: itemData.id, item: line, itemData };
        textEditOption.style.display = 'none';
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.evt.clientX}px`;
        contextMenu.style.top = `${e.evt.clientY}px`;
      });
    } else {
      addItem(itemData.type, itemData.x, itemData.y);
      const konvaItem = konvaItems.get(itemData.id);
      if (konvaItem) {
        konvaItem.shape.width(itemData.width);
        konvaItem.shape.height(itemData.height);
        konvaItem.group.x(itemData.x);
        konvaItem.group.y(itemData.y);
        if (itemData.type === 'text') {
          konvaItem.shape.text(itemData.text);
        }
        if (itemData.type === 'line' && itemData.points) {
          const points = itemData.points;
          konvaItem.shape.points([points[0] - itemData.x, points[1] - itemData.y, points[2] - itemData.x, points[3] - itemData.y]);
          if (konvaItem.handles) {
            konvaItem.handles[0].position({ x: points[0] - itemData.x, y: points[1] - itemData.y });
            konvaItem.handles[1].position({ x: points[2] - itemData.x, y: points[3] - itemData.y });
          }
        }
      }
    }
    redrawConnections();
  } else if (action.action === 'delete') {
    const itemId = action.item.id;
    const konvaItem = konvaItems.get(itemId);
    if (konvaItem) {
      if (konvaItem.group) konvaItem.group.destroy();
      else if (konvaItem.shape) konvaItem.shape.destroy();
      konvaItems.delete(itemId);
    }
    items = items.filter(i => i.id !== itemId);
    connections = connections.filter(c => c.from !== itemId && c.to !== itemId);
    redrawConnections();
  } else if (action.action === 'move') {
    const itemId = action.itemId;
    const item = items.find(i => i.id === itemId);
    const konvaItem = konvaItems.get(itemId);
    if (item && konvaItem) {
      item.x = action.x;
      item.y = action.y;
      konvaItem.group.x(action.x);
      konvaItem.group.y(action.y);
      if (item.type === 'line' && item.points) {
        const dx = action.x - (item.points[0] - item.points[2] / 2);
        const dy = action.y - (item.points[1] - item.points[3] / 2);
        item.points = [item.points[0] + dx, item.points[1] + dy, item.points[2] + dx, item.points[3] + dy];
        const points = item.points;
        konvaItem.shape.points([points[0] - action.x, points[1] - action.y, points[2] - action.x, points[3] - action.y]);
        if (konvaItem.handles) {
          konvaItem.handles[0].position({ x: points[0] - action.x, y: points[1] - action.y });
          konvaItem.handles[1].position({ x: points[2] - action.x, y: points[3] - action.y });
        }
      }
      redrawConnections();
    }
  } else if (action.action === 'resize') {
    const itemId = action.itemId;
    const item = items.find(i => i.id === itemId);
    const konvaItem = konvaItems.get(itemId);
    if (item && konvaItem) {
      item.width = action.width;
      item.height = action.height;
      if (item.type === 'circle') {
        konvaItem.shape.radius(action.width / 2);
        item.height = action.width; // Keep circle proportional
      } else {
        konvaItem.shape.width(action.width);
        konvaItem.shape.height(action.height);
      }
      redrawConnections();
    }
  } else if (action.action === 'connect') {
    connections.push({ from: action.from, to: action.to });
    redrawConnections();
  } else if (action.action === 'editText') {
    const itemId = action.itemId;
    const item = items.find(i => i.id === itemId);
    const konvaItem = konvaItems.get(itemId);
    if (item && konvaItem) {
      item.text = action.text;
      konvaItem.shape.text(action.text);
      layer.draw();
    }
  } else if (action.action === 'moveLine') {
    const itemId = action.itemId;
    const item = items.find(i => i.id === itemId);
    const konvaItem = konvaItems.get(itemId);
    if (item && konvaItem) {
      item.points = action.points;
      konvaItem.shape.points([action.points[0] - item.x, action.points[1] - item.y, action.points[2] - item.x, action.points[3] - item.y]);
      if (konvaItem.handles) {
        konvaItem.handles[0].position({ x: action.points[0] - item.x, y: action.points[1] - item.y });
        konvaItem.handles[1].position({ x: action.points[2] - item.x, y: action.points[3] - item.y });
      }
      layer.draw();
    }
  }
  layer.draw();
});

// Download as PNG
document.getElementById('download-png-btn').addEventListener('click', () => {
  const dataURL = canvas.toDataURL({
    mimeType: 'image/png',
    quality: 1
  });
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'whiteboard.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Download as SVG
document.getElementById('download-svg-btn').addEventListener('click', () => {
  let svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width()}" height="${canvas.height()}">
  `;
  items.forEach(item => {
    if (item.type === 'freehand') {
      const pointsStr = item.points.reduce((acc, val, idx) => {
        return acc + (idx % 2 === 0 ? (idx === 0 ? '' : ' ') + val : ',' + val);
      }, '');
      svgContent += `<polyline points="${pointsStr}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
    } else if (item.type === 'line') {
      svgContent += `<line x1="${item.points[0]}" y1="${item.points[1]}" x2="${item.points[2]}" y2="${item.points[3]}" stroke="black" stroke-width="2" />`;
    } else if (item.type === 'box') {
      svgContent += `<rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" fill="lightblue" stroke="black" stroke-width="1" />`;
    } else if (item.type === 'circle') {
      svgContent += `<circle cx="${item.x + item.width / 2}" cy="${item.y + item.height / 2}" r="${item.width / 2}" fill="lightgreen" stroke="black" stroke-width="1" />`;
    } else if (item.type === 'text') {
      svgContent += `<text x="${item.x}" y="${item.y + 20}" font-size="20" font-family="Arial" fill="black">${item.text}</text>`;
    }
  });
  connections.forEach(conn => {
    const fromItem = items.find(i => i.id === conn.from);
    const toItem = items.find(i => i.id === conn.to);
    if (fromItem && toItem) {
      const fromPos = { x: fromItem.x + (fromItem.type === 'circle' ? fromItem.width / 2 : fromItem.width / 2), y: fromItem.y + (fromItem.type === 'circle' ? fromItem.height / 2 : fromItem.height / 2) };
      const toPos = { x: toItem.x + (toItem.type === 'circle' ? toItem.width / 2 : toItem.width / 2), y: toItem.y + (toItem.type === 'circle' ? toItem.height / 2 : toItem.height / 2) };
      const midPoint = { x: (fromPos.x + toPos.x) / 2, y: (fromPos.y + toPos.y) / 2 };
      svgContent += `<line x1="${fromPos.x}" y1="${fromPos.y}" x2="${midPoint.x}" y2="${midPoint.y}" stroke="black" stroke-width="2" />`;
      svgContent += `<line x1="${midPoint.x}" y1="${midPoint.y}" x2="${toPos.x}" y2="${toPos.y}" stroke="black" stroke-width="2" />`;
      svgContent += `<circle cx="${midPoint.x}" cy="${midPoint.y}" r="10" fill="white" stroke="gray" stroke-width="1" />`;
      svgContent += `<text x="${midPoint.x - 5}" y="${midPoint.y + 5}" font-size="14" font-family="Arial" fill="gray">+</text>`;
    }
  });
  svgContent += `</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'whiteboard.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});