const fs = require('fs');
const book = JSON.parse(fs.readFileSync('quran_en_old.json', 'utf-8'));
const output = []
for (const chapter in book) {
    for (const verse of book[chapter]) {
        output.push ({chapter: verse.chapter, verse: verse.verse, text: verse.text})
    }
}
console.log(JSON.stringify(output));



