// app.js
// mohan chinnappan

import elements from './data.js'; // Importing elements from data.js

// Function to generate the periodic table
function generatePeriodicTable() {
  const table = document.getElementById('periodic-table');
  elements.forEach(element => {
    const elementDiv = document.createElement('div');
    elementDiv.className = 'element';
    elementDiv.innerHTML = `
      <div class="element-symbol">${element.symbol}</div>
      <div class="element-name">${element.name}</div>
      <div class="element-atomic-number">${element.atomicNumber}</div>
    `;

    // Mouse hover event to show info
    elementDiv.addEventListener('mouseenter', (event) => showPopup(event, element));
    elementDiv.addEventListener('mouseleave', hidePopup);

    table.appendChild(elementDiv);
  });
}

// Function to show popup with element information
function showPopup(event, element) {
  const popup = document.getElementById('popup');
  popup.innerHTML = `
    <h3 class="text-lg font-bold text-teal-600">${element.name} (${element.symbol})</h3>
    <p><strong>Atomic Number:</strong> ${element.atomicNumber}</p>
    <p><strong>Info:</strong> ${element.info}</p>
    <p><strong>Uses:</strong> ${element.uses}</p>
    <p><strong>Abundance:</strong> ${element.countries}</p>
  `;

  // Position the popup next to the element
  popup.style.left = `${event.pageX + 20}px`; // Offset to the right
  popup.style.top = `${event.pageY}px`; // Align with the mouse Y position
  popup.style.display = 'block';
}

// Function to hide the popup
function hidePopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
}

// Initialize the periodic table on page load
window.onload = function () {
  generatePeriodicTable();
};