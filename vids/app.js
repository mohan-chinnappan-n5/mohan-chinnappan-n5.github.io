const categoriesElement = document.getElementById("categories");
const videoListElement = document.getElementById("video-list");
const categoryTitleElement = document.getElementById("category-title");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Handle category click event
function loadVideos(category) {
  const categoryData = data.categories.find((cat) => cat.name === category);
  categoryTitleElement.textContent = category;
  videoListElement.innerHTML = ""; // Clear previous videos

  // Loop through videos in the selected category and create video elements
  categoryData.videos.forEach((video) => {
    const videoElement = document.createElement("div");
    videoElement.classList.add(
      "bg-white",
      "dark:bg-gray-800",
      "shadow-md",
      "rounded-lg",
      "overflow-hidden"
    );
    videoElement.innerHTML = `
            <iframe class="w-full h-48" src="https://www.youtube.com/embed/${video.youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <div class="p-4">
              <h3 class="font-semibold">${video.title}</h3>
            </div>
          `;
    videoListElement.appendChild(videoElement);
  });
}

// Populate categories on the left pane and preload the first category
function populateCategories() {
  data.categories.forEach((category, index) => {
    const categoryItem = document.createElement("li");
    categoryItem.classList.add(
      "cursor-pointer",
      "hover:bg-gray-200",
      "dark:hover:bg-gray-700",
      "hover:text-gray-900",
      "dark:hover:text-white",
      "p-2",
      "rounded",
      "font-semibold"
    );
    categoryItem.textContent = category.name;
    categoryItem.addEventListener("click", () => loadVideos(category.name));
    categoriesElement.appendChild(categoryItem);

    // Automatically load the first category
    if (index === 0) {
      loadVideos(category.name);
    }
  });
}

// Sync the dark mode state with the checkbox
function syncDarkModeWithCheckbox() {
  const isDarkMode = document.body.classList.contains("dark");
  darkModeToggle.checked = isDarkMode; // Set checkbox state based on body class
}

// Toggle dark mode based on the checkbox
darkModeToggle.addEventListener("change", (event) => {
  if (event.target.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("dark-mode", "true"); // Store preference
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("dark-mode", "false"); // Store preference
  }
});

// Check the dark mode preference from localStorage
function checkDarkModePreference() {
  const storedPreference = localStorage.getItem("dark-mode");
  if (storedPreference === "true") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

// Initialize the app
window.addEventListener("DOMContentLoaded", () => {
  checkDarkModePreference(); // Apply stored dark mode preference
  syncDarkModeWithCheckbox(); // Sync checkbox with the current dark mode state
  populateCategories(); // Populate categories and load the first one
});