
const getEle = id => document.getElementById(id);


let datatype = "Phone"; // default
let params = new URL(document.location).searchParams;
if (params.get("t") !== null) {
    const t = params.get("t");
    datatype = params.get("t");
}

const dataTypeSpecUrl = 'js/datatype.json?v=4';

const response = await fetch(dataTypeSpecUrl);
const dataTypeSpec = await response.json();
//console.log(dataTypeSpec.dataTypes);

const getFieldInfo = fieldName => dataTypeSpec.dataTypes.filter(field => {
    return field.name === fieldName;
});


//---------

const updateUI = datatype => {
    let results = getFieldInfo(datatype);
    getEle('name').innerHTML = results[0].name;
    getEle('desc').innerHTML = results[0].description;
    getEle('shield').innerHTML = results[0].shield;
    if (results[0].url) getEle('url').innerHTML = `<a href='${results[0].url}'>More info</a>`;
    getEle('results').value = JSON.stringify(results, null, 4);

}



updateUI(datatype);


/*
  roll-up summary
  - limited
  auto-number
*/

class DataTypes {


    static getSupported() {
        return dataTypeSpec.dataTypes.map(item => item.name);

    }

}
let typeSelected = "package";

const acConfigMtype = {
    placeHolder: "Search for field data type...",
    selector: "#autoCompleteMtype",
    data: {
        src: DataTypes.getSupported(),
    },
    resultItem: {
        highlight: true,
    },

    resultsList: {
        element: (list, data) => {
            const info = document.createElement("p");
            if (data.results.length) {
                info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
            } else {
                info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
            }
            list.prepend(info);
        },

        noResults: true,
        maxResults: 15,
        tabSelect: true,
    },

    events: {
        input: {
            selection: async (event) => {
                const selection = event.detail.selection.value;
                autoCompleteJSMtype.input.value = selection;
                typeSelected = selection;
                updateUI(typeSelected);

            },
        },
    },
};
const autoCompleteJSMtype = new autoComplete(acConfigMtype);

