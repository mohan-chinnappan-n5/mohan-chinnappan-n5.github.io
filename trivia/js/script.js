// --------------------------------------
// Trivia App
// Mohan Chinnappan
// --------------------------------------


// Create a URLSearchParams object with the current URL
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the "cat" parameter
const catParameter = urlParams.get('cat');

let _CAT = 'trivia';
if (catParameter === 'sf') _CAT = 'sf';

// Function to fetch trivia data from the JSON file
async function fetchTriviaData(source) {
    try {
        const response = await fetch(source);
        const triviaData = await response.json();
        return triviaData;
    } catch (error) {
        console.error('Error fetching trivia data:', error);
        return [];
    }
}

// Function to remove duplicate questions based on their "question" field
function removeDuplicates(trivia) {
    const uniqueQuestions = [];
    const questionSet = new Set();
    trivia.forEach(question => {
        if (!questionSet.has(question.question)) {
            uniqueQuestions.push(question);
            questionSet.add(question.question);
        }
    });
    return uniqueQuestions;
}

// Function to shuffle the array of trivia questions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Define global variables
let trivia = [];
let currentIndex = 0;
let score = 0;

// Function to display a random trivia question
function displayQuestion() {
    questionElement.textContent = trivia[currentIndex].question;
    choicesElement.innerHTML = "";
    trivia[currentIndex].choices.forEach(choice => {
        const choiceButton = document.createElement("button");
        choiceButton.textContent = choice;
        choiceButton.classList.add("choice");
        choiceButton.addEventListener("click", () => selectChoice(choice));
        choicesElement.appendChild(choiceButton);
    });
}

// Function to select a choice
function selectChoice(choice) {
    const correctAnswer = trivia[currentIndex].answer;
    if (choice === correctAnswer) {
        score++;
        trivia[currentIndex].correct = true;
        trivia[currentIndex].answered = true;
        
    } else {
        trivia[currentIndex].correct = false;
        trivia[currentIndex].answered = true;

    }
    currentIndex++;
    if (currentIndex < trivia.length) {
        displayQuestion();
    } else {
        displayScore();
    }
}

// Function to display a list of questions with a given heading
function displayQuestionList(heading, questions) {
    const headingElement = document.createElement("h2");
    headingElement.textContent = heading;
    choicesElement.appendChild(headingElement);

    const questionList = document.createElement("ul");
    questions.forEach(question => {
        const listItem = document.createElement("li");
        listItem.textContent = question.question;
        questionList.appendChild(listItem);
    });
    choicesElement.appendChild(questionList);
}


// Function to display the final score and draw a pie chart
function displayScore() {
    questionElement.textContent = "Quiz Completed!";
    choicesElement.innerHTML = "";
    scoreElement.textContent = `Your Score: ${score} / ${trivia.length}`;
    doneButton.style.display = "none";

    // Count correct, incorrect, and unanswered questions
    let correctCount = trivia.filter(question => question.correct).length;
    let incorrectCount = trivia.filter(question => !question.correct && question.answered).length;
    let unansweredCount = trivia.length - (correctCount + incorrectCount);

    console.log(correctCount, incorrectCount, unansweredCount)

    // Draw pie chart
    const chartData = {
        labels: ["Correct", "Incorrect", "Unanswered"],
        datasets: [{
            data: [correctCount, incorrectCount, unansweredCount],
            backgroundColor: ["green", "red", "gray"]
        }]
    };

    const ctx = document.getElementById("scoreChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: chartData
    });

    // Display list of incorrect or not answered questions
    const incorrectQuestions = trivia.filter(question => !question.correct && question.answered);
    const notAnsweredQuestions = trivia.filter(question => !question.answered);
    
    if (incorrectQuestions.length > 0) {
        displayQuestionList("Incorrect Questions", incorrectQuestions);
    }
    
    if (notAnsweredQuestions.length > 0) {
       // displayQuestionList("Not Answered Questions", notAnsweredQuestions);
    }
}
 



// Get elements
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const scoreElement = document.getElementById("score");
const doneButton = document.getElementById("done");

// Event listener for the "Done" button
doneButton.addEventListener("click", displayScore);


// Load trivia data when the page loads
window.onload = async function () {
    trivia = await fetchTriviaData(`js/${_CAT}.json`);
    trivia = removeDuplicates(trivia);
    trivia = shuffle(trivia);
    displayQuestion();
};
