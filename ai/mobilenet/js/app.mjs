// app.js
// mchinnappan
Split(["#menu", "#content"], { sizes: [40, 60] });

let answersEditor = ace.edit("answers");
answersEditor.setTheme("ace/theme/tomorrow_night");
answersEditor.session.setMode("ace/mode/json");
answersEditor.setOptions({
    fontSize: "12pt",
});

const getEle = id => document.getElementById(id);

const inputElement = document.getElementById("imageUpload");
const imageElement = document.getElementById("img");
const dropzone = document.getElementById("dropzone");

// ------- DnD route

// Prevent the default drag behaviors when an image is dragged over the dropzone
dropzone.addEventListener("dragover", function(event) {
    event.preventDefault();
  });

  // Handle the image drop event
  dropzone.addEventListener("drop", function(event) {
    // Prevent the default drop behavior
    event.preventDefault();

    // Get the dropped file from the event data transfer object
    const file = event.dataTransfer.files[0];

    // Create a new FileReader object
    const reader = new FileReader();

    // Set the onload event handler to update the image display with the dropped file
    reader.onload = function() {
        imageElement.src = reader.result;
    }

    // Read the dropped file as a data URL
    reader.readAsDataURL(file);
  });


// ------- upload route
inputElement.addEventListener("change", function () {
    // Get the selected file from the input element
    const file = inputElement.files[0];

    // Create a new FileReader object
    const reader = new FileReader();

    // Set the onload event handler to update the image element with the selected file
    reader.onload = function () {
        imageElement.src = reader.result;
    }

    // Read the selected file as a data URL
    reader.readAsDataURL(file);
});
// Notice there is no 'import' statement. 'mobilenet' and 'tf' is
// available on the index-page because of the script tag above.

const img = document.getElementById('img');

// Load the model.
const model = await mobilenet.load();


// Classify the image.
getEle('detect').addEventListener('click', event => {
    model.classify(img).then(predictions => {
        //console.log('Predictions: ');
        //console.log(predictions);
        answersEditor.setValue(JSON.stringify(predictions, null, 4));
    });

});

getEle('detect').click();