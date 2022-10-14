const { getJson } = require("./lib");

async function trivia() {
  let response = await getJson(
    "https://the-trivia-api.com/api/questions?categories=science,history,film_and_tv&limit=10"
  );
  let resp = PickRandom(response);
  choices = resp.incorrectAnswers;
  choices.push(resp.correctAnswer);
  let data = {
    question: resp.question,
    choices: shuffle(choices),
    answer: resp.correctAnswer,
    category: resp.category,
  };
  return console.log(data);
}
function PickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function shuffle(array) {
  let curId = array.length;
  while (0 !== curId) {
    let randId = Math.floor(Math.random() * curId);
    curId -= 1;
    let tmp = array[curId];
    array[curId] = array[randId];
    array[randId] = tmp;
  }
  return array;
}
