
// ssApp.js
// mohan chinnappan
// ------------
  // Get data file from query parameter
  const params = new URLSearchParams(window.location.search);
  const dataFile = params.get('data');

  // Fetch JSON data and render slideshow
  async function renderSlideshow() {
    if (!dataFile) {
      document.getElementById('slideshow').innerHTML =
        "<p class='text-center text-red-500'>No data file provided in the query parameter.</p>";
      return;
    }

    try {
      const response = await fetch(dataFile);
      const images = await response.json();
      const slideshow = document.getElementById('slideshow');

      // Generate slides
      images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
          <img src="${image.url}" alt="${image.title}" class="block">
          <div class="slide-title">${image.title}</div>
        `;
        slideshow.appendChild(slide);
      });

      // Add navigation controls
      const prevButton = document.createElement('button');
      prevButton.id = 'prev';
      prevButton.className = 'nav-button';
      prevButton.textContent = '❮';

      const nextButton = document.createElement('button');
      nextButton.id = 'next';
      nextButton.className = 'nav-button';
      nextButton.textContent = '❯';

      slideshow.appendChild(prevButton);
      slideshow.appendChild(nextButton);

      // Enable slideshow navigation
      let currentIndex = 0;
      const slides = document.querySelectorAll('.slide');

      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
      }

      document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
      });

      document.getElementById('next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      });
    } catch (error) {
      document.getElementById('slideshow').innerHTML =
        "<p class='text-center text-red-500'>Error loading data file.</p>";
    }
  }

  renderSlideshow();