let verses = [];
let currentVerseIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/t_bbe.csv")
    .then((response) => response.text())
    .then((data) => {
      const parsedData = Papa.parse(data, { header: true }).data;
      verses = parsedData;
      displayVerse(currentVerseIndex);
    });

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentVerseIndex > 0) {
      currentVerseIndex--;
      displayVerse(currentVerseIndex);
    }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentVerseIndex < verses.length - 1) {
      currentVerseIndex++;
      displayVerse(currentVerseIndex);
    }
  });

  document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();

    // Only perform search if query has at least 3 characters
    if (query.length >= 3) {
      const searchResults = verses.filter(
        (verse) => verse.verse && verse.verse.toLowerCase().includes(query)
      );

      displaySearchResults(searchResults);
    } else {
      // Clear the search results if the query is less than 3 characters
      document.getElementById("searchResults").innerHTML = "";
    }
  });
});

function displayVerse(index) {
  const verse = verses[index];
  document.getElementById(
    "book-chapter"
  ).textContent = `${verse.book} ${verse.chapter}`;
  document.getElementById("verse-number").textContent = `Verse ${
    index + 1
  } of ${verses.length}`;
  document.getElementById("verse").textContent = verse.verse;
}

function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById("searchResults");
  searchResultsContainer.innerHTML = "";

  results.forEach((result) => {
    const resultDiv = document.createElement("div");
    resultDiv.className = "bg-gray-200 p-2 my-2 rounded";
    resultDiv.innerHTML = `
      <strong>${result.book} ${result.chapter}</strong>
      <p>${result.verse}</p>
    `;
    resultDiv.addEventListener("click", () => {
      currentVerseIndex = verses.indexOf(result);
      displayVerse(currentVerseIndex);
      document.getElementById("searchInput").value = "";
      searchResultsContainer.innerHTML = "";
    });
    searchResultsContainer.appendChild(resultDiv);
  });
}
