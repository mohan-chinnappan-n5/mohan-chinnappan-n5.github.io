// json2yaml.mjs
// mchinnappan

const getEle = id => document.getElementById(id);

    class YamlUtil {
      constructor() { }
      convertToJson(jsonData) {
        try {
          const yamlData = jsyaml.dump(JSON.parse(jsonData));
          return yamlData
        } catch (e) {
          alert('Error converting JSON to YAML: ' + e.message);
        }
      }
    }

    //-----
    Split(["#menu", "#content"], { sizes: [50, 50] });

    // input file reading
    // read file
    const readSingleFile = (e, to) => {
      var file = e.target.files[0];
      if (!file) {
        return;
      }
      let contents = "";
      const reader = new FileReader();
      reader.onload = function (e) {
        contents = e.target.result;
        to.value = contents;
      };
      reader.readAsText(file);
    };

    getEle('file-input1').onchange = function (e) {
      readSingleFile(e,  getEle('json-data'));

    }
    getEle('file-input1').onclick = function (e) {
      readSingleFile(e,  getEle('json-data'));

    }


    async function fetchJson(url) {
      const response = await fetch(url);
      const content = await response.json();
      return content;
    }

    async function loadData(selection) {
      const url = `https://raw.githubusercontent.com/mohan-chinnappan-n/xml-xslt/main/profile.json`;
      const data = await fetchJson(url);
      getEle('json-data').value = JSON.stringify(data, null, 4);
    }

    const yamlUtil = new YamlUtil();
    await loadData();

    const convertBtn = getEle('convert');
    convertBtn.addEventListener('click', event => {
      const jsonData = getEle('json-data').value;
      getEle('yaml-data').value = yamlUtil.convertToJson(jsonData);
    });

    convertBtn.click();

    const downloadBtn = getEle('yaml-download');
    downloadBtn.addEventListener('click', event => {
        const yamlData = getEle('yaml-data').value;
        console.log(yamlData);
    });