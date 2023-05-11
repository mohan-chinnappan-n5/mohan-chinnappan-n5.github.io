// app.js 
// mchinnappan

Split(["#menu", "#content"], { sizes: [30, 70] });

let editor = ace.edit("passage");
editor.setTheme("ace/theme/tomorrow_night");
editor.session.setMode("ace/mode/text");
editor.setOptions({
  fontSize: "12pt",
});

let question = ace.edit("question");
question.setTheme("ace/theme/tomorrow_night");
question.session.setMode("ace/mode/text");
question.setOptions({
  fontSize: "12pt",
});

let answersEditor = ace.edit("answers");
answersEditor.setTheme("ace/theme/tomorrow_night");
answersEditor.session.setMode("ace/mode/json");
answersEditor.setOptions({
  fontSize: "12pt",
});

editor.setValue(
  "Ken thompson wrote UNIX operating system. Dennis Ritchie wrote  C language"
);
question.setValue("Who wrote UNIX Operating system ?");

const getEle = (id) => document.getElementById(id);
// load the model
const model = await qna.load();
const getQNA = async (question, passage) => {
  console.log(question, passage);
  await model.findAnswers(question, passage).then(async (answers) => {
    answersEditor.setValue(JSON.stringify(answers, null, 4));
  });
};

getEle("answerBtn").addEventListener("click", async (event) => {
  const q = question.getValue();
  const p = editor.getValue();
  await getQNA(q, p);
});
