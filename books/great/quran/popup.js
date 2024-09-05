let verses = [];
let currentVerseIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/quran.json')
    .then(response => response.json())
    .then(data => {
      verses = data;
      displayVerse(currentVerseIndex);
    });

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentVerseIndex > 0) {
      currentVerseIndex--;
      displayVerse(currentVerseIndex);
    }
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentVerseIndex < verses.length - 1) {
      currentVerseIndex++;
      displayVerse(currentVerseIndex);
    }
  });

  document.getElementById('searchInput').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    if (query.length >= 3) {
      const searchResults = verses.filter(verse =>
        verse.text.toLowerCase().includes(query)
      );
      displaySearchResults(searchResults);
    } else {
      document.getElementById('searchResults').innerHTML = '';
    }
  });
});

function displayVerse(index) {
  const verse = verses[index];
  document.getElementById('chapter-verse').textContent = `Chapter: ${verse.chapter}, Verse: ${verse.verse}`;
  document.getElementById('text').textContent = verse.text;
}

function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = '';

  results.forEach(result => {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'bg-gray-200 p-2 my-2 rounded';
    resultDiv.innerHTML = `
      <strong>Chapter: ${result.chapter}, Verse: ${result.verse}</strong>
      <p>${result.text}</p>
    `;
    resultDiv.addEventListener('click', () => {
      currentVerseIndex = verses.indexOf(result);
      displayVerse(currentVerseIndex);
      document.getElementById('searchInput').value = '';
      searchResultsContainer.innerHTML = '';
    });
    searchResultsContainer.appendChild(resultDiv);
  });
}