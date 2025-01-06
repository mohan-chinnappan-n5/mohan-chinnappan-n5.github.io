// dcApp.js
// mohan chinnappan
//------------------
document.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const msg = urlParams.get('msg') || 'Greetings';
      const person = urlParams.get('person') || 'Friend';
      const delay = parseInt(urlParams.get('del')) * 1000 || 1000; // Delay in ms, default 1s
      const count = parseInt(urlParams.get('c'))  || 3; // count of images to show 


      // Set the greeting message
      document.getElementById('greeting').textContent = `Happy ${msg} to ${person}!`;

      // Load images dynamically with delay
      const imageContainer = document.getElementById('imageContainer');
      let currentImage = 1;

      const loadImages = () => {
        // Clear the container for a single image at a time
        imageContainer.innerHTML = '';

        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/mohan-chinnappan-n5/ai-images/main/${msg}/${currentImage}.jpg`;
        img.alt = `Image ${currentImage}`;
        img.classList = 'w-full h-full object-cover rounded shadow';
        imageContainer.appendChild(img);

        // Cycle images, go back to 1 after 3
        currentImage = currentImage < count ? currentImage + 1 : 1;

        setTimeout(loadImages, delay); // Delay for next image
      };

      loadImages();
});
