

// url Parameters handling
const urlParams = new URLSearchParams(window.location.search);
const count = urlParams.get('c') || 3;
const getEle = id => document.getElementById(id);

// Define a schema for generating fake data
const schema = `{
firstName: faker.name.firstName(),
lastName: faker.name.lastName(),
email: faker.internet.email(),
age: faker.random.number({ min: 18, max: 65 })
}`;

Split(["#menu", "#content"], { sizes: [50, 50] });

const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/json");
const data = [{ "name": "unix", "authors": "ken and dmr" }, { "name": "c", "authors": "dmr" }
];
editor.setValue(JSON.stringify(data, null, '\t'));

const editorSQL = ace.edit("commands");
editorSQL.setTheme("ace/theme/monokai");
editorSQL.setValue(schema);

getEle('execute').addEventListener('click', event => {
    // Execute the schema as JavaScript code within a controlled environment
    let fakeData = [];
    try {
        for (let i = 0; i < count; i++) {
            fakeData.push(eval("(" + editorSQL.getValue() + ")"));
        }
        editor.setValue(JSON.stringify(fakeData, null, 2));

    } catch (error) {
        getEle('errors').value = "Invalid schema format";
    }
});
getEle('execute').click();




const convertAndDownload = jsonData => {
    // Convert JSON to CSV
    const csvData = Papa.unparse(jsonData);

    // Generate download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
}


function convertAndCopyToClipboard(jsonData) {
    // Convert JSON to CSV
    const csvData = Papa.unparse(jsonData);

    // Copy CSV data to clipboard
    navigator.clipboard.writeText(csvData)
        .then(() => {
            console.log('CSV data copied to clipboard!');
        })
        .catch((error) => {
            console.error('Failed to copy CSV data to clipboard:', error);
        });
}

getEle('tocsv').addEventListener('click', event => {
    convertAndDownload(editor.getValue());

});

getEle('viewcsv').addEventListener('click', event => {
    // Convert JSON to CSV
    convertAndCopyToClipboard(editor.getValue());
    window.location.href = `https://mohan-chinnappan-n5.github.io/viz/datatable/dt.html?c=csv`;
});
