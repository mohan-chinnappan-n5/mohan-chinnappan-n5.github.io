//app.js
// mchinnappan
const getEle = (id) => document.getElementById(id);

Split(["#menu", "#content"], { sizes: [30, 70] });

let editor = ace.edit("passage");
editor.setTheme("ace/theme/tomorrow_night");
editor.session.setMode("ace/mode/text");
editor.setOptions({
  fontSize: "12pt",
});
editor.setValue("You suck");

let answersEditor = ace.edit("answers");
answersEditor.setTheme("ace/theme/tomorrow_night");
answersEditor.session.setMode("ace/mode/json");
answersEditor.setOptions({
  fontSize: "12pt",
});

// The minimum prediction confidence.
const threshold = 0.9;
// Load the model. Users optionally pass in a threshold and an array of
// labels to include.
const model = await toxicity.load(threshold);

getEle("answerBtn").addEventListener("click", async (event) => {
  const sentences = editor.getValue().split("\n");
  console.log(sentences);
  const predictions = await model.classify(sentences);
  answersEditor.setValue(JSON.stringify(predictions, null, 4));
});
