// pkcreateApp.js
// mohan chinnappan
//-------------------

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const metadataParam = urlParams.get('m');
const itemsParam = urlParams.get('i');

// Pre-fill the form if parameters exist
if (metadataParam) {
    document.getElementById('metadata').value = metadataParam;
}

if (itemsParam) {
    document.getElementById('items').value = itemsParam;
}




document.getElementById('generateBtn').addEventListener('click', () => {
    const metadata = document.getElementById('metadata').value.trim();
    const items = document.getElementById('items').value.trim();

    if (!metadata || !items) {
        alert('Please provide both metadata type and items.');
        return;
    }

    const itemsArray = items.split(',').map(item => item.trim());
    let xmlOutput = '<types>\n';

    itemsArray.forEach(item => {
        xmlOutput += `\t<members>${item}</members>\n`;
    });

    xmlOutput += `\t<name>${metadata}</name>\n`;
    xmlOutput += '</types>';

    document.getElementById('output').classList.remove('hidden');
    document.getElementById('xmlOutput').textContent = xmlOutput;
});

// Automatically generate XML if parameters are provided
if (metadataParam && itemsParam) {
    document.getElementById('generateBtn').click(); 
}


