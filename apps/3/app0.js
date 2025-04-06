import sections from './sections.js?v=2';

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

      const title = document.createElement('h3');
      title.className = 'text-xl font-semibold text-white-800 dark:text-white-400';
      title.textContent = section.title;

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

      const title = document.createElement('h3');
      title.className = 'text-xl font-semibold text-white-800 dark:text-white-400';
      title.textContent = section.title;

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
    });
    categoriesContainer.appendChild(categoryItem);
  });
}

// Function to filter categories based on search input
function filterCategories2() {
  const searchInput = document.getElementById('category-search');
  const searchTerm = searchInput.value.toLowerCase();
  const categoryItems = document.querySelectorAll('#categories li');
  if (!searchInput) {
    createCatalog();
    return;
  }

  categoryItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
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

const mediaAppsCount = 12;
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
  
  document.getElementById('category-search').addEventListener('input', filterCategories);
  updateTotalLinks(); // Update total links bubble
}

document.addEventListener('DOMContentLoaded', init);
