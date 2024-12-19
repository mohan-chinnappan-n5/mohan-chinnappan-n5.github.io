// app.js
// mohan chinnappan
//--------------------------------

const imageInput = document.getElementById('imageInput');
const originalImage = document.getElementById('originalImage');
const originalImageContainer = document.getElementById('originalImageContainer');
const originalSize = document.getElementById('originalSize');
const convertButton = document.getElementById('convertButton');
const convertedImage = document.getElementById('convertedImage');
const convertedImageContainer = document.getElementById('convertedImageContainer');
const convertedSize = document.getElementById('convertedSize');
const downloadButton = document.getElementById('downloadButton');
const savingsButton = document.getElementById('savings');


let uploadedImage;
let fromSize;
let toSize;

// Load the selected image into the left pane
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage = e.target.result; // Save the uploaded image data
      originalImage.src = uploadedImage; // Display the original image
      originalSize.textContent = `Size: ${(file.size / 1024).toFixed(2)} KB`; // Show file size
      fromSize = file.size;
      originalImageContainer.style.display = 'block'; // Show the original image container
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please upload a valid image (JPG, JPEG, PNG)');
  }
});

// Convert the image to WebP and display it in the right pane
convertButton.addEventListener('click', () => {
  if (!uploadedImage) {
    alert('Please upload an image first!');
    return;
  }

  const img = new Image();
  img.src = uploadedImage;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Convert to WebP
    canvas.toBlob((blob) => {
      const webpURL = URL.createObjectURL(blob);

      convertedImage.src = webpURL; // Display the WebP image
      convertedSize.textContent = `Size: ${(blob.size / 1024).toFixed(2)} KB`; // Show WebP size
      toSize = blob.size; 
      convertedImageContainer.style.display = 'block'; // Show the converted image container

      // Set up the download button
      downloadButton.href = webpURL;
      downloadButton.download = 'converted_image.webp';
      const savings = ((fromSize - toSize) / 1024).toFixed(2);
      savingsButton.textContent = `Savings ${savings} KB`;
       
      downloadButton.classList.remove('hidden'); // Show the download button
    }, 'image/webp');
  };
});