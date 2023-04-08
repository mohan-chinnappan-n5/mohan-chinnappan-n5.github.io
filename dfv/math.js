// math.js
// mohan chinnappan




// read query params
const query = location.search.substr(1);
let qresult = {};
query.split("&").forEach(function (part) {
    const item = part.split("=");
    qresult[item[0]] = decodeURIComponent(item[1]);
});

let chartWidth = 800;
let chartHeight = 300;
let chartFn = 'sin';

let start = 0;
let stop = 20;
let step = 0.1;

if (qresult.cw) { chartWidth = parseInt(qresult.cw); }
if (qresult.ch) { chartHeight = parseInt(qresult.ch); }
if (qresult.f) { chartFn = qresult.f; }

if (qresult.start) { start = qresult.start }
if (qresult.stop) { stop = qresult.stop; }
if (qresult.step) { step = qresult.step; }



const drawChart = (id, fn, start, stop, step) => {
    const spec =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Plots a function using a generated sequence.",
        "height": chartHeight,
        "width": chartWidth,


        "data": { "sequence": { "start": `${start}`, "stop": `${stop}`, "step": `${step}`, "as": "x" } },

        "transform": [{ "calculate": `${fn}(datum.x)`, "as": "y" }],
        "mark": "line",
        "encoding": {
            "x": { "field": "x", "type": "quantitative" },
            "y": { "field": "y", "type": "quantitative" }
        }
    }


    vegaEmbed(id, spec);
};

drawChart('#viz', chartFn, start, stop, step);