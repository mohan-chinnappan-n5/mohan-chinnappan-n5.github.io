// object detection in browser
// based on transformers.js by xenova
// mohan chinnappan 

Split(["#stat", "#img"], { sizes: [20, 80], });

// constants 
const THRESHOLD = 0.5;
const MODEL = 'Xenova/detr-resnet-50';


import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0';

// Since we will download the model from the Hugging Face Hub, we can skip the local model check
env.allowLocalModels = false;
const getEle = id => document.getElementById(id);

// Reference the elements that we will need
const status = getEle('status');
const fileUpload = getEle('file-upload');
const imageContainer = getEle('image-container');

// Create a new object detection pipeline
status.textContent = 'Loading model...';
const detector = await pipeline('object-detection', MODEL);
status.textContent = 'Ready';

fileUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    // Set up a callback when the file is loaded
    reader.onload = function (event) {
        imageContainer.innerHTML = '';
        const image = document.createElement('img');
        image.src = event.target.result;
        imageContainer.appendChild(image);
        detect(image);
    };
    reader.readAsDataURL(file);
});

// Detect objects in the image
async function detect(img) {
    status.textContent = 'Analyzing the image...';
    const output = await detector(img.src, {
        threshold: THRESHOLD,
        percentage: true,
    });
    status.textContent = 'Done.';
    output.forEach(renderBox);
}

// Render a bounding box and label on the image
function renderBox({ box, label }) {
    const { xmax, xmin, ymax, ymin } = box;

    // Generate a random color for the box
    const color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, 0);

    // Draw the box
    const boxElement = document.createElement('div');
    boxElement.className = 'bounding-box';
    Object.assign(boxElement.style, {
        borderColor: color,
        left: 100 * xmin + '%',
        top: 100 * ymin + '%',
        width: 100 * (xmax - xmin) + '%',
        height: 100 * (ymax - ymin) + '%',
    })

    // Draw label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.className = 'bounding-box-label';
    labelElement.style.backgroundColor = color;

    boxElement.appendChild(labelElement);
    imageContainer.appendChild(boxElement);
}

// Function to handle file drop
function handleFileDrop(e) {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];

        // Check if the dropped file is a text file (you can adjust the condition)
        const reader = new FileReader();

        reader.onload = function (event) {
            imageContainer.innerHTML = '';
            const image = document.createElement('img');
            image.src = event.target.result;
            imageContainer.appendChild(image);
            detect(image);
        };

        reader.readAsDataURL(file);
    }
}

// Function to prevent the default behavior of drag-and-drop
function preventDefault(e) {
    e.preventDefault();
}

// Add event listeners to the drop area
const dropArea = document.getElementById("dropArea");
dropArea.addEventListener("dragenter", preventDefault, false);
dropArea.addEventListener("dragover", preventDefault, false);
dropArea.addEventListener("drop", handleFileDrop, false);


 
