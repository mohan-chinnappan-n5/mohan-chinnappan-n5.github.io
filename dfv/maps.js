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



const drawChart = (id) => {
    const spec =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Maps",
        "height": chartHeight,
        "width": chartWidth,


        "data": {
            "url": "data/zipcodes.csv"
          },
          "transform": [{"calculate": "substring(datum.zip_code, 0, 1)", "as": "digit"}],
          "projection": {
            "type": "albersUsa"
          },
          "mark": "circle",
          "encoding": {
            "longitude": {
              "field": "longitude",
              "type": "quantitative"
            },
            "latitude": {
              "field": "latitude",
              "type": "quantitative"
            },
            "size": {"value": 5},
            "color": {"field": "digit", "type": "nominal"}
          }
    }

 
    vegaEmbed(id, spec);
};

drawChart('#viz');