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
    }
    currentIndex++;
    if (currentIndex < trivia.length) {
        displayQuestion();
    } else {
        displayScore();
    }
}

// Function to display the final score
// Function to display the final score and draw a pie chart
function displayScore() {
    questionElement.textContent = "Quiz Completed!";
    choicesElement.innerHTML = "";
    scoreElement.textContent = `Your Score: ${score} / ${trivia.length}`;
    doneButton.style.display = "none";

    // Draw pie chart
    const chartData = {
        labels: ["Correct Answers", "Incorrect Answers"],
        datasets: [{
            data: [score, trivia.length - score],
            backgroundColor: ["#99ffcc", "#ff99cc"]
        }]
    };

    // Set canvas width and height
    const canvas = document.getElementById("scoreChart");
    canvas.width = 200; // Set desired width
    canvas.height = 200; // Set desired height

    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: chartData
    });
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
    trivia = await fetchTriviaData('js/trivia.json');
    trivia = removeDuplicates(trivia);
    trivia = shuffle(trivia);
    displayQuestion();
};
