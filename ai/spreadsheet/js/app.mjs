// app.mjs

// Get references to the input elements in the table
const inputs = document.querySelectorAll('input[type="text"]');

// Add event listeners to each input element to update the row sum
inputs.forEach((input) => {
  input.addEventListener('input', updateRowSum);
});

function updateRowSum(event) {
  // Get the row of the input element that triggered the event
  const row = event.target.parentNode.parentNode;

  // Get the input elements in the row
  const inputs = row.querySelectorAll('input[type="text"]');

  // Calculate the sum of the values in the row
  let sum = 0;
  inputs.forEach((input) => {
    if (input.value) {
      sum += parseFloat(input.value);
    }
  });

  // Display the sum in the last cell of the row
  const sumCell = row.querySelector('td:last-child');
  sumCell.textContent = sum.toFixed(2);
}

