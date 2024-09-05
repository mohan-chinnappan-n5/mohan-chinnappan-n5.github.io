let verses = [];
let currentVerseIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  //fetch(chrome.runtime.getURL('data/gita.json'))
 fetch('data/gita.json')
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
        verse.text.toLowerCase().includes(query) ||
        verse.title.toLowerCase().includes(query) ||
        verse.transliteration.toLowerCase().includes(query) ||
        verse.word_meanings.toLowerCase().includes(query)
      );

      displaySearchResults(searchResults);
    } else {
      document.getElementById('searchResults').innerHTML = '';
    }
  });
});

function displayVerse(index) {
  const verse = verses[index];
  document.getElementById('title').textContent = verse.title;
  document.getElementById('text').textContent = verse.text;
  document.getElementById('transliteration').textContent = verse.transliteration;
  document.getElementById('word_meanings').textContent = verse.word_meanings;
}

function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = '';

  results.forEach(result => {
    const resultDiv = document.createElement('div');
    resultDiv.innerHTML = `
      <strong>${result.title}</strong>
      <p>${result.text}</p>
      <p class="italic">${result.transliteration}</p>
      <p>${result.word_meanings}</p>
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