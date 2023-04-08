// package.xml builder - mchinnappan

import { MdTypes } from "./mdTypes.js";
import { Utils } from "./util.js";
import { MultilineInputUtil } from "./multiinput.js";

let typeSelected = "";

const acConfigMtype = {
  placeHolder: "Search for Metadata Type...",
  selector: "#autoCompleteMtype",
  data: {
    src: MdTypes.getSupported(),
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
      selection: (event) => {
        const selection = event.detail.selection.value;
        autoCompleteJSMtype.input.value = selection;
        typeSelected = selection;
      },
    },
  },
};
const autoCompleteJSMtype = new autoComplete(acConfigMtype);

Split(["#menu", "#content"], {
  sizes: [40, 60],
});

MultilineInputUtil.initFeatures();
// event handling
document.getElementById("addMember").addEventListener("click", (e) => {
  MultilineInputUtil.addFeature();
});
document
  .getElementById("removeAll")
  .addEventListener("click", MultilineInputUtil.removeFeatures);
document.getElementById("getMembers").addEventListener("click", (e) => {
  const qEle = Utils.getEle("q");
  const qValue = qEle.value;
  if (qValue.includes("</Package>")) {
    qEle.value = qValue.replace(/<\/Package>/g, ""); // remove the old endtag
  }

  const values = MultilineInputUtil.getValues();
  let xml = "\n<types>\n";
  for (const value of values) {
    xml += `\t<members>${value.trim()}</members>\n`;
  }
  xml += `\t<name>${typeSelected.trim()}</name>\n</types>\n`;
  Utils.getEle("q").value += xml;
});

document.getElementById("getXML").addEventListener("click", (e) => {
  Utils.getEle("q").value += "\n</Package>";

  const qEle = Utils.getEle("q");
  qEle.focus();
  qEle.select();
  document.execCommand("copy");
});

//---------
