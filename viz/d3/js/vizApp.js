import { D3Util } from "./D3Util.js";
//const data = await D3Util.readCSV(url);

// bar chart
const langs = await D3Util.getData(
  "https://mohan-chinnappan-n5.github.io/dfv/data/plangs22.json"
);

const dbs = await D3Util.getData(
  "https://mohan-chinnappan-n5.github.io/dfv/data/dbs.json"
);

D3Util.barChart(
  "#lang",
  langs,
  "language",
  "value",
  "Most Loved Programming Languages 2022",
  "Lover Meter (%)",
  1200
);

D3Util.barChart(
  "#db",
  dbs,
  "db",
  "value",
  "Most Loved Databases  2022",
  "Lover Meter (%)",
  1200
);
