import sections from './sections.js?v=4';
const mediaAppsCount = 12
// Function to create catalog content based on selected category
function createCatalog(selectedCategoryKey) {
  const catalogContainer = document.getElementById('catalog');
  catalogContainer.innerHTML = ''; // Clear existing content
  catalogContainer.className = 'space-y-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow'; // Ensures background is applied

  // Display all items if no category is selected
  if (!selectedCategoryKey) {
    Object.keys(sections).forEach(key => {
      const section = sections[key];
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'bg-white dark:bg-gray-800 p-4 rounded shadow-md';
      sectionDiv.dataset.category = key; // Store category key for search

      const title = document.createElement('h3');
      title.className = 'text-xl font-semibold text-white-800 dark:text-white-400';
      title.textContent = section.title;
      title.dataset.searchable = section.title; // Make title searchable

      sectionDiv.appendChild(title);

      const list = document.createElement('ul');
      list.className = 'mt-4 space-y-2';

      section.links.forEach(link => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center space-x-2';

        const icon = document.createElement('img');
        icon.src = `img/${link.icon}.png`; 
        icon.className = 'w-5 h-5';

        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = link.text;
        anchor.className = 'text-white-600 dark:text-white-400 hover:underline';
        anchor.dataset.searchable = link.text; // Make link text searchable

        listItem.appendChild(icon);
        listItem.appendChild(anchor);

        list.appendChild(listItem);
      });

      sectionDiv.appendChild(list);
      catalogContainer.appendChild(sectionDiv);
    });
  } else {
    // Display items for the selected category
    const section = sections[selectedCategoryKey];
    if (section) {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'bg-white dark:bg-gray-800 p-4 rounded shadow-md';
      sectionDiv.dataset.category = selectedCategoryKey; // Store category key for search

      const title = document.createElement('h3');
      title.className = 'text-xl font-semibold text-white-800 dark:text-white-400';
      title.textContent = section.title;
      title.dataset.searchable = section.title; // Make title searchable

      sectionDiv.appendChild(title);

      const list = document.createElement('ul');
      list.className = 'mt-4 space-y-2';

      section.links.forEach(link => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center space-x-2';

        const icon = document.createElement('img');
        icon.src = `img/${link.icon}.png`; // Use appropriate icon URL
        icon.className = 'w-5 h-5';

        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = link.text;
        anchor.className = 'text-white-600 dark:text-white-400 hover:underline';
        anchor.dataset.searchable = link.text; // Make link text searchable

        listItem.appendChild(icon);
        listItem.appendChild(anchor);

        list.appendChild(listItem);
      });

      sectionDiv.appendChild(list);
      catalogContainer.appendChild(sectionDiv);
    }
  }
}

// Function to create category list
function createCategories() {
  const categoriesContainer = document.getElementById('categories');
  categoriesContainer.innerHTML = ''; // Clear existing content

  Object.keys(sections).forEach(key => {
    const section = sections[key];
    const categoryItem = document.createElement('li');
    categoryItem.className = 'cursor-pointer text-white-600 dark:white-blue-400 hover:underline';
    categoryItem.textContent = section.title;
    categoryItem.dataset.key = key; // Store the section key for reference
    categoryItem.addEventListener('click', () => {
      document.getElementById('category-title').textContent = section.title;
      createCatalog(key); // Pass the selected category key to createCatalog
      clearGlobalSearch(); // Clear global search when category changes
    });
    categoriesContainer.appendChild(categoryItem);
  });
}

// Function to filter categories based on search input
function filterCategories() {
  const searchInput = document.getElementById('category-search');
  const searchTerm = searchInput.value.toLowerCase();
  const categoryItems = document.querySelectorAll('#categories li');

  // If the user enters 'all', show all categories
  if (searchTerm === 'all') {
    categoryItems.forEach(item => {
      item.style.display = ''; // Show all categories
    });
    createCatalog(); // Display all categories in the catalog
    clearGlobalSearch(); // Clear global search when showing all categories
    return;
  }

  // Otherwise, filter categories based on the search term
  categoryItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Function to perform global search across catalog items
function globalSearch() {
  const searchTerm = document.getElementById('global-search').value.trim().toLowerCase();
  const catalogContainer = document.getElementById('catalog');
  const searchResults = document.getElementById('global-search-results');
  const clearIcon = document.getElementById('clear-search-icon');

  // Show/hide the clear icon based on input
  clearIcon.style.display = searchTerm ? 'block' : 'none';

  // Clear previous highlights
  clearHighlights();

  if (!searchTerm) {
    searchResults.textContent = "";
    return;
  }

  // Get all searchable elements (titles and links)
  const searchableElements = catalogContainer.querySelectorAll('[data-searchable]');
  let matchCount = 0;

  // Regular expression for case-insensitive search
  const regex = new RegExp(`(${searchTerm})`, "gi");

  // Iterate through searchable elements and highlight matches
  searchableElements.forEach(element => {
    const text = element.dataset.searchable.toLowerCase();
    if (text.includes(searchTerm)) {
      const originalText = element.textContent;
      element.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
      matchCount++;
    }
  });

  // Update search results
  searchResults.textContent = matchCount > 0 ? `Found ${matchCount} match${matchCount === 1 ? "" : "es"}.` : "No matches found.";

  // Scroll to the first match if any
  if (matchCount > 0) {
    const firstMatch = catalogContainer.querySelector(".highlight");
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

// Function to clear previous highlights
function clearHighlights() {
  const highlighted = document.querySelectorAll(".highlight");
  highlighted.forEach(span => {
    const parent = span.parentNode;
    parent.replaceChild(document.createTextNode(span.textContent), span);
    parent.normalize(); // Merge adjacent text nodes
  });
  document.getElementById('global-search-results').textContent = "";
}

// Function to clear the global search input and highlights
function clearGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  searchInput.value = "";
  clearHighlights();
  document.getElementById('clear-search-icon').style.display = 'none'; // Hide the X button
}

// Function to calculate and update total links bubble
function updateTotalLinks() {
  const totalLinks = Object.values(sections).reduce((total, section) => total + section.links.length, 0);
  const bubble = document.getElementById('total-links-bubble');
  bubble.textContent = totalLinks + mediaAppsCount;
}

// Function to get query parameters from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Initialize the page
function init() {
  createCategories();
  let categoryFromURL = getQueryParam('c');
  if (categoryFromURL) categoryFromURL = categoryFromURL.replace(' ',''); // Get 'c' parameter from URL

  if (categoryFromURL && sections[categoryFromURL]) {
    document.getElementById('category-title').textContent = sections[categoryFromURL].title;
    createCatalog(categoryFromURL); // Display the category passed in the URL
  } else {
    createCatalog(); // Display all items initially if no category is in the URL
  }
  
  // Event listeners for category search
  document.getElementById('category-search').addEventListener('input', filterCategories);

  // Event listeners for global search
  const globalSearchInput = document.getElementById('global-search');
  globalSearchInput.addEventListener('input', globalSearch); // Dynamic search on input
  globalSearchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      globalSearch(); // Keep Enter key functionality
    }
  });

  // Event listener for the X button inside the search box
  document.getElementById('clear-search-icon').addEventListener('click', clearGlobalSearch);

  // Event listener for the Clear button outside the search box
  document.getElementById('clear-global-search-btn').addEventListener('click', clearGlobalSearch);

  updateTotalLinks(); // Update total links bubble
}

document.addEventListener('DOMContentLoaded', init);
