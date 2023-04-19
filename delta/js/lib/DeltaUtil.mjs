/*
-----------------------------

XML delta util class 

- mchinnappan

-----------------------------
*/

import { sectionsObj } from "./SectionsData.mjs";

export class DeltaUtil {
  mtype;
  //----------------
  constructor(mtype) {
    this.mtype = mtype;
  }

  //----------------
  getMType = () => this.mtype;

  //----------------
  addWrapper(diffData) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<${this.getMType()} xmlns="http://soap.sforce.com/2006/04/metadata">
${diffData}
</${this.getMType()}>
`;
  }

  //----------------
  isObject(object) {
    return object != null && typeof object === "object";
  }

  //----------------
  shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  //----------------
  deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = this.isObject(val1) && this.isObject(val2);
      if (
        (areObjects && !this.deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }

  //----------------
  xml2json = (xml) => {
    const x2js = new X2JS();
    return x2js.xml_str2json(xml);
  };

  //----------------
  isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === "function";
  }

  //----------------
  getSection(section, mtype, payload) {
    const sections = Object.keys(sectionsObj[mtype]);
    if (
      sections.includes(section) &&
      Object.keys(payload[mtype]).includes(section)
    ) {
      return payload[mtype][section];
    }
    return [];
  }

  //----------------
  findDeltas(section, items1, items2, key) {
    const diffItems = [];
    const newItems = [];

    let found = false;
    if (!this.isIterable(items1)) {
      items1 = [items1];
    }
    if (!this.isIterable(items2)) {
      items2 = [items2];
    }

    for (const item1 of items1) {
      let keyField = item1[key];
      // console.error(`keyField: ${keyField}`)
      found = false;
      const keyValue1 = item1[key];
      for (const item2 of items2) {
        const keyValue2 = item2[key];

        //console.error(`${keyValue1}, ${keyValue2}`)
        if (keyValue1 === keyValue2) {
          found = true;
          if (!this.deepEqual(item1, item2)) {
            // console.error(`diff:: ${JSON.stringify(item1)} and ${JSON.stringify(item2)}`)
            diffItems.push(item1);
          } else {
            // equal
            // console.error(`same:: ${JSON.stringify(item1)} and ${JSON.stringify(item2)}`)
          }
        }
      }
      if (!found) {
        // console.error(`new item - not in the org ${JSON.stringify(item1)}`) ;
        newItems.push(item1);
      }
    }

    return { section, diffItems, newItems };
  }

  //----------------
  deltaInfo2XML(deltaInfo) {
    let xmlout = "";
    for (const diffItem of deltaInfo.diffItems) {
      xmlout += `<!-- Diff item -->\n`;
      xmlout += `<${deltaInfo.section}>\n`;
      for (const item of Object.keys(diffItem)) {
        xmlout += `\t<${item}>${diffItem[item]}</${item}>\n`;
      }
      xmlout += `</${deltaInfo.section}>\n`;
    }

    for (const newItem of deltaInfo.newItems) {
      xmlout += `<!-- New item -->\n`;
      xmlout += `<${deltaInfo.section}>\n`;
      for (const item of Object.keys(newItem)) {
        xmlout += `\t<${item}>${newItem[item]}</${item}>\n`;
      }
      xmlout += `</${deltaInfo.section}>\n`;
    }
    return xmlout;
  }
}
