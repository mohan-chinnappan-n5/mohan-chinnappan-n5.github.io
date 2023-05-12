//app.js
// mchinnappan
const getEle = (id) => document.getElementById(id);

Split(["#menu", "#content"], { sizes: [30, 70] });

let editor = ace.edit("passage");
editor.setTheme("ace/theme/tomorrow_night");
editor.session.setMode("ace/mode/json");
editor.setOptions({
  fontSize: "12pt",
});

const inputs1 = {
  queries: ["How are you feeling today?", "What is capital of USA?"],
  responses: [
    "I'm not feeling very well.",
    "Washington DC is the capital of USA."
  ],
};
editor.setValue(JSON.stringify(inputs1, null, 4));

let answersEditor = ace.edit("answers");
answersEditor.setTheme("ace/theme/tomorrow_night");
answersEditor.session.setMode("ace/mode/json");
answersEditor.setOptions({
  fontSize: "12pt",
});

const model = await use.load();

getEle("answerBtn").addEventListener("click", async (event) => {
  const inputs = JSON.parse(editor.getValue());
  console.log(inputs);
  const embeddings = await model.embed(inputs);
  console.log(embeddings)

  // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
  // So in this example `embeddings` has the shape [2, 512].
  //embeddings.print(true /* verbose */);
  // answersEditor.setValue(JSON.stringify(embeddings.arraySync(), null, 4));

  let scores = [];
  const embed_query = embeddings["queryEmbedding"].arraySync();
  const embed_responses = embeddings["responseEmbedding"].arraySync();
  // compute the dotProduct of each query and response pair.
  for (let i = 0; i < input["queries"].length; i++) {
    for (let j = 0; j < input["responses"].length; j++) {
      scores.push(dotProduct(embed_query[i], embed_responses[j]));
    }
  }
  answersEditor.setValue(JSON.stringify(scores, null, 4));
});

// Calculate the dot product of two vector arrays.
const dotProduct = (xs, ys) => {
  const sum = (xs) => (xs ? xs.reduce((a, b) => a + b, 0) : undefined);

  return xs.length === ys.length
    ? sum(zipWith((a, b) => a * b, xs, ys))
    : undefined;
};

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith = (f, xs, ys) => {
  const ny = ys.length;
  return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x, i) => f(x, ys[i]));
};
