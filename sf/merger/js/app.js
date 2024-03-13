/*

 package.xml merger
 author: Mohan Chinnappan

*/

const sample1 = `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
  <version>56.0</version>

<types>
	<members>Green</members>
	<members>Blue</members>
	<name>ApexClass</name>
</types>

<types>
	<members>ABC</members>
	<members>XYZ</members>
	<name>LightningComponentBundle</name>
</types>

</Package>
`;

const sample2 = `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
  <version>56.0</version>

<types>
	<members>Green</members>
	<members>Blue</members>
	<name>ApexClass</name>
</types>

<types>
	<members>MMM</members>
	<members>NNN</members>
	<name>LightningComponentBundle</name>
</types>

</Package>
`;



const urlParams = new URLSearchParams(window.location.search);
const getEle = (id) => document.getElementById(id);
Split(["#one", "#two", '#three'], {
    sizes: [33, 33, 34],
});

let editor1;
let editor2;
let editor3;

// Function to download the file
function downloadFile() {
    const fileContent = editor3.getValue(); // Get the content from Monaco Editor
    const blob = new Blob([fileContent], { type: "text/xml" }); // Create a Blob
    console.log(blob)
    const a = document.getElementById('downloadLink');

    a.href = URL.createObjectURL(blob);

    // Set the file name with the input extension
    // a.download = `downloaded_file.${inputExtension}`;
    // Set the file name with the original uploaded file name and extension
    a.download = "merged-package.xml";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

}

getEle("download").addEventListener("click", downloadFile);




const xml2json = (xml) => {
    const x2js = new X2JS();
    return x2js.xml_str2json(xml);
};

function jsonToXml(json) {
    let xml = '';

    for (const key in json) {
        if (key === 'Package') {
            xml += '<Package xmlns="http://soap.sforce.com/2006/04/metadata">';
            xml += jsonToXml(json[key]);
            xml += '</Package>';
        } else if (key === 'types') {
            for (const type of json[key]) {
                xml += '<types>';
                xml += `<name>${type.name}</name>`;
                for (const member of type.members) {
                    xml += `<members>${member}</members>`;
                }
                xml += '</types>';
            }
        } else if (key === '_xmlns') {
            continue; // Skip _xmlns property
        } else {
            xml += `<${key}>${json[key]}</${key}>`;
        }
    }

    return xml;
}

function prettifyXml(xmlString) {
    const xmlDoc = new DOMParser().parseFromString(xmlString, 'application/xml');
    const xsltDoc = new DOMParser().parseFromString([
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:output method="xml" indent="yes"/>',
        '  <xsl:template match="/">',
        '    <xsl:copy-of select="."/>',
        '  </xsl:template>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');
    const processor = new XSLTProcessor();
    processor.importStylesheet(xsltDoc);
    const resultDoc = processor.transformToDocument(xmlDoc);
    const resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
}







require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs' } });
require(['vs/editor/editor.main'], function () {
    editor1 = monaco.editor.create(document.getElementById('editor1'), {
        value: sample1,
        language: 'xml',
        theme: 'vs-dark'
    });

    editor2 = monaco.editor.create(document.getElementById('editor2'), {
        value: sample2,
        language: 'xml',
        theme: 'vs-dark'
    });

    editor3 = monaco.editor.create(document.getElementById('editor3'), {
        value: '',
        language: 'xml',
        theme: 'vs-dark'
    });




    const fileInput1 = document.getElementById('fileInput1');
    const fileInput2 = document.getElementById('fileInput2');
    const mergeButton = document.getElementById('mergeButton');

    fileInput1.addEventListener('change', function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            editor1.setValue(reader.result);
            //editor1.setValue(JSON.stringify( xml2json(editor1.getValue()), null, 4));

        };
        reader.readAsText(file);

        // checkMergeAvailability();
    });


    fileInput2.addEventListener('change', function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            editor2.setValue(reader.result);
            // editor2.setValue(JSON.stringify( xml2json(editor2.getValue()), null, 4));
        };
        reader.readAsText(file);
        checkMergeAvailability();
    });

    function checkMergeAvailability() {
        mergeButton.disabled = false;
    }

    function mergeJSON(json1, json2) {
        // Ensure both JSON objects have the same structure
        if (!json1 || !json1.Package || !json1.Package.types ||
            !json2 || !json2.Package || !json2.Package.types) {
            return null; // Return null if structures are invalid
        }

        // Create a map to store merged types by name
        const mergedTypesMap = new Map();

        // Merge types from json1
        for (const type of json1.Package.types) {
            const name = type.name;
            if (!mergedTypesMap.has(name)) {
                mergedTypesMap.set(name, type.members.slice());
            } else {
                mergedTypesMap.get(name).push(...type.members.filter(member => !mergedTypesMap.get(name).includes(member)));
            }
        }

        // Merge types from json2
        for (const type of json2.Package.types) {
            const name = type.name;
            if (!mergedTypesMap.has(name)) {
                mergedTypesMap.set(name, type.members.slice());
            } else {
                mergedTypesMap.get(name).push(...type.members.filter(member => !mergedTypesMap.get(name).includes(member)));
            }
        }

        // Construct the merged JSON object
        const mergedJSON = {
            "Package": {
                "version": json1.Package.version,
                "types": Array.from(mergedTypesMap.entries()).map(([name, members]) => ({
                    "members": members,
                    "name": name
                })),
                "_xmlns": "http://soap.sforce.com/2006/04/metadata"
            }
        };

        return mergedJSON;
    }


    mergeButton.addEventListener('click', function () {
        const json1 = xml2json(editor1.getValue());
        const json2 = xml2json(editor2.getValue());
        const mergedJSON = mergeJSON(json1, json2);
        const mergedXML = jsonToXml(mergedJSON);
        editor3.setValue('<?xml version="1.0" encoding="UTF-8"?>\n' + prettifyXml(mergedXML));

    });
    mergeButton.click();


});