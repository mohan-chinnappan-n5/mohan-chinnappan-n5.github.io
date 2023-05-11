export class Similarity {
    constructor() { }
    tokenize = str => new Set(str.split(' '));
    intersection = (setA, setB) => new Set([...setA].filter(x => setB.has(x)));
    union = (setA, setB) => new Set([...setA, ...setB]);
    jaccardSimilarity = (strA, strB) => {
        const tokensA = this.tokenize(strA);
        const tokensB = this.tokenize(strB);
        const intersectionSize = this.intersection(tokensA, tokensB).size;
        const unionSize = this.union(tokensA, tokensB).size;
        return intersectionSize / unionSize;
    }

    extractTextData(obj) {
        // Recursively traverse the object tree and extract relevant text data
        // This example extracts text data from 'name' and 'description' fields
        const textData = new Set();
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'object') {
            textData.add(...this.extractTextData(value));
          } else if (typeof value === 'string' && (key === 'name' || key === 'description')) {
            textData.add(value);
          }
        }
        return textData;
    }

    compareJSONS(json1, json2) {
        const textData1 = this.extractTextData(json1);
        const textData2 = this.extractTextData(json2);
        return this.jaccardSimilarity([...textData1], [...textData2]);
    }

    jsonToSet(json) {
        const set = new Set();
        for (const [key, value] of Object.entries(json)) {
          if (typeof value === 'object') {
            const nestedSet = jsonToSet(value);
            nestedSet.forEach(nestedValue => set.add(nestedValue));
          } else {
            set.add(value);
          }
        }
        return set;
    }

      
}
