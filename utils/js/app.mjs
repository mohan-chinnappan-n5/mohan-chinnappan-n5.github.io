// app.mjs
// mchinnappan

import { Util } from './util.mjs';
import { Similarity } from './similarity.mjs';

const util = new Util();
const sim = new Similarity();

const resultsEle = util.getEle('results');
resultsEle.value = "";


let params = util.getUrlParams();


if (params.has('age')) {
    const dob = params.get('age');
    if (util.isBirthDay(dob)) {
        resultsEle.value += "Happy Birthday!!!\n";
    }
    const age = util.getAge(dob);
    resultsEle.value += `Age for the DOB: ${dob} : ${age}`;
}

if (params.has('instance')) {
    const instance= params.get('instance');
    // instance 
    const result = await util.getDataCenter(instance);
    resultsEle.value +=  "\n" + JSON.stringify(result, null, 4);
}

if (params.has('math')) {
    const math = params.get('math');
    const result = await util.doMatch(math)
    resultsEle.value +=  "\n" + result;
}

if (params.has('sim')) {
    const items  = params.get('sim').split('|');
    const result = sim.jaccardSimilarity(items[0], items[1])
    resultsEle.value +=  items.join('\n') +  "\n\nSimilarity: " + result;
}




