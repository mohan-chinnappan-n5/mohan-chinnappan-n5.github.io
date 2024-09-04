let verses = [];
let currentVerseIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/tk3.csv')
    .then(response => response.text())
    .then(data => {
      const parsedData = Papa.parse(data, { header: true }).data;
      verses = parsedData;
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
    const searchResults = verses.filter(verse =>
      verse.ChapterName.toLowerCase().includes(query) ||
      verse.SectionName.toLowerCase().includes(query) ||
      verse.Verse.toLowerCase().includes(query) ||
      verse.Translation.toLowerCase().includes(query) ||
      verse.Explanation.toLowerCase().includes(query)
    );

    displaySearchResults(searchResults);
  });
});

function displayVerse(index) {
  const verse = verses[index];
  document.getElementById('chapter-name').textContent = verse.ChapterName;
  document.getElementById('section-name').textContent = verse.SectionName;

  // Display the serial number
  document.getElementById('verse-number').textContent = `${index + 1} of ${verses.length}`;



  // Ensure the verse is split into two lines
  const formattedVerse = formatVerse(verse.Verse);
  document.getElementById('verse').textContent = formattedVerse;

  document.getElementById('translation').textContent = verse.Translation;
  document.getElementById('explanation').textContent = verse.Explanation;
}

function formatVerse(verseText) {
  // Split the verse into two lines using a newline character
  const verseLines = verseText.split('			');
  return verseLines.join('\n');
}

function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = '';

  results.forEach(result => {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'bg-gray-200 p-2 my-2 rounded';
    resultDiv.innerHTML = `
      <strong>${result.ChapterName} - ${result.SectionName}</strong>
      <p>${formatVerse(result.Verse)}</p>
      <p class="italic">${result.Translation}</p>
      <p>${result.Explanation}</p>
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