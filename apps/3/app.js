import sections from './sections.js';

// Function to create catalog content based on selected category
function createCatalog(selectedCategoryKey) {
  const catalogContainer = document.getElementById('catalog');
  catalogContainer.innerHTML = ''; // Clear existing content

  // Display all items if no category is selected
  if (!selectedCategoryKey) {
    Object.keys(sections).forEach(key => {
      const section = sections[key];
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'bg-white dark:bg-gray-800 p-4 rounded shadow-md';

      const title = document.createElement('h3');
      title.className = 'text-xl font-semibold text-blue-800 dark:text-blue-400';
      title.textContent = section.title;

      sectionDiv.appendChild(title);

      const list = document.createElement('ul');
      list.className = 'mt-4 space-y-2';

      section.links.forEach(link => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center space-x-2';

        const icon = document.createElement('img');
        icon.src = `https://img.icons8.com/material-outlined/24/000000/${link.icon}.png`; // Use appropriate icon URL
        icon.className = 'w-5 h-5';

        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = link.text;
        anchor.className = 'text-blue-600 dark:text-blue-400 hover:underline';

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
      title.className = 'text-xl font-semibold text-blue-800 dark:text-blue-400';
      title.textContent = section.title;

      sectionDiv.appendChild(title);

      const list = document.createElement('ul');
      list.className = 'mt-4 space-y-2';

      section.links.forEach(link => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center space-x-2';

        const icon = document.createElement('img');
        icon.src = `https://img.icons8.com/material-outlined/24/000000/${link.icon}.png`; // Use appropriate icon URL
        icon.className = 'w-5 h-5';

        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = link.text;
        anchor.className = 'text-blue-600 dark:text-blue-400 hover:underline';

        listItem.appendChild(icon);
        listItem.appendChild(anchor);

        list.appendChild(listItem);
      });

      sectionDiv.appendChild(list);
      catalogContainer.appendChild(sectionDiv);
    }
  }
}

// Function to create catalog content
function createCatalog2() {
  const catalogContainer = document.getElementById('catalog');
  catalogContainer.innerHTML = ''; // Clear existing content

  Object.keys(sections).forEach(key => {
    const section = sections[key];
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'catalog-item'; // Apply the new class

    // Create and append thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.src = section.thumbnail || 'https://via.placeholder.com/150'; // Placeholder if no thumbnail
    thumbnail.alt = 'Item Thumbnail';
    thumbnail.className = 'w-full h-40 object-cover rounded-lg mb-4';
    sectionDiv.appendChild(thumbnail);

    // Create and append title
    const title = document.createElement('h3');
    title.className = 'text-xl font-semibold text-blue-500 dark:text-blue-400 mb-2';
    title.textContent = section.title;
    sectionDiv.appendChild(title);

    // Create and append description
    const description = document.createElement('p');
    description.className = 'text-gray-300 dark:text-gray-400';
    description.textContent = section.description || 'No description available.';
    sectionDiv.appendChild(description);

    catalogContainer.appendChild(sectionDiv);
  });
}

// Function to create category list
function createCategories() {
  const categoriesContainer = document.getElementById('categories');
  categoriesContainer.innerHTML = ''; // Clear existing content

  Object.keys(sections).forEach(key => {
    const section = sections[key];
    const categoryItem = document.createElement('li');
    categoryItem.className = 'cursor-pointer text-blue-600 dark:text-blue-400 hover:underline';
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
function filterCategories() {
  const searchInput = document.getElementById('category-search');
  const searchTerm = searchInput.value.toLowerCase();
  const categoryItems = document.querySelectorAll('#categories li');

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

// Initialize the page
function init() {
  createCategories();
  createCatalog(); // Display all items initially
  document.getElementById('category-search').addEventListener('input', filterCategories);
  updateTotalLinks(); // Update total links bubble
}

document.addEventListener('DOMContentLoaded', init);