// Get the container element and the generate button
const container = document.getElementById("fake-data-container");
const generateButton = document.getElementById("generate-button");

// Add click event listener to the generate button
generateButton.addEventListener("click", function() {
  // Clear the container
  container.innerHTML = "";

  ;

  // Create an unordered list to display the fake data
  const ul = document.createElement("ul");

  const count = 5;
  for (let i = 0; i < count; i++) { 
// Define a schema for generating fake data
  const schema = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    age: faker.random.number({ min: 18, max: 65 })
  }
  // Iterate over the schema properties and create list items
  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const li = document.createElement("li");
      li.textContent = key + ": " + schema[key];
      ul.appendChild(li);
    }
  }
  }

  // Append the unordered list to the container
  container.appendChild(ul);
});

