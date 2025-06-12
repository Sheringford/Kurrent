// Define the path to your text file
const filePath = 'sentences.txt';

// References to elements
const loadButtonWord = document.getElementById('load-word');
const loadButtonTrigram = document.getElementById('load-trigram');
const loadButtonSentence = document.getElementById('load-sentence');
const wordElement = document.getElementById('word');
const trigramElement = document.getElementById('trigram');
const sentenceElement = document.getElementById('sentence');
const answerSection = document.getElementById('answer-section');
const userAnswer = document.getElementById('user-answer');
const submitButtonWord = document.getElementById('submit-answer-word');
const submitButtonTrigram = document.getElementById('submit-answer-trigram');
const submitButtonSentence = document.getElementById('submit-answer-sentence');
const feedback = document.getElementById('feedback');
const nextWordButton = document.getElementById('next-word');
const nextTrigramButton = document.getElementById('next-trigram');
const nextSentenceButton = document.getElementById('next-sentence');
const solutionButton = document.getElementById('solution');
const solutionSection = document.getElementById('solution-section');

let current = ''; // Store the current word/trigram/sentence for validation

// Initialize score from sessionStorage or set to 0
let score = parseInt(sessionStorage.getItem('userScore')) || 0;

// Update the score and save it to sessionStorage
function updateScore(increment) {
    score += increment;
    sessionStorage.setItem('userScore', score);
    return score;
}

// Display the score in the feedback section
function displayScore() {
    feedback.innerText = `Dein aktueller Score ist: ${score}`;
}

// Fetch random content based on the provided regex pattern
function fetchRandomContent(pattern, element, scoreIncrement, button, displayCallback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            const matches = data.match(pattern);
            if (matches && matches.length > 0) {
                current = matches[Math.floor(Math.random() * matches.length)].trim();
                element.innerText = current;
                answerSection.style.display = 'block';
                userAnswer.value = '';
                feedback.innerText = '';
                // REMOVE THIS LINE: updateScore(scoreIncrement);
                displayCallback && displayCallback();
            } else {
                element.innerText = 'No content found in the file.';
            }
        })
        .catch(error => {
            console.error('Error fetching content:', error);
            element.innerText = 'Failed to load content.';
        })
        .finally(() => {
            if (button) button.style.display = 'none';
        });
}

// Event listeners for load buttons
loadButtonWord?.addEventListener('click', () => {
    fetchRandomContent(/\b\w+\b/g, wordElement, 0, loadButtonWord);
});
loadButtonTrigram?.addEventListener('click', () => {
    fetchRandomContent(/\b(?:\w+\s+){2}\w+\b/g, trigramElement, 0, loadButtonTrigram);
});
loadButtonSentence?.addEventListener('click', () => {
    fetchRandomContent(/[^.!?]+[.!?]+/g, sentenceElement, 0, loadButtonSentence);
});

// Generalized submit handler
function handleSubmit(input, feedbackElement, decrementScore) {
    if (input === current) {
        updateScore(5); // Add points only for correct answers
        feedbackElement.style.color = 'green';
        feedbackElement.innerText = `Richtig! Dein aktueller Score ist: ${score}`;
    } else {
        updateScore(-1); // Subtract points for wrong answers
        feedbackElement.style.color = '#930707';
        feedbackElement.innerText = `Falsch! Dein aktueller Score ist: ${score}`;
        solutionButton.style.display = 'block';
    }
}

// Event listeners for submit buttons
submitButtonWord?.addEventListener('click', () => {
    handleSubmit(userAnswer.value.trim(), feedback, 7);
    nextWordButton.style.display = 'block';
});
submitButtonTrigram?.addEventListener('click', () => {
    handleSubmit(userAnswer.value.trim(), feedback, 70);
    nextTrigramButton.style.display = 'block';
});
submitButtonSentence?.addEventListener('click', () => {
    handleSubmit(userAnswer.value.trim(), feedback, 125);
    nextSentenceButton.style.display = 'block';
});

// Event listener for "Solution" button
solutionButton?.addEventListener('click', () => {
    solutionSection.innerText = current;
    solutionSection.style.display = 'block';
});

// Event listeners for "Next" buttons
nextWordButton?.addEventListener('click', () => {
    fetchRandomContent(/\b\w+\b/g, wordElement, 5, nextWordButton, () => {
        solutionSection.style.display = 'none';
        nextWordButton.style.display = 'none';
    });
});
nextTrigramButton?.addEventListener('click', () => {
    fetchRandomContent(/\b(?:\w+\s+){2}\w+\b/g, trigramElement, 50, nextTrigramButton, () => {
        solutionSection.style.display = 'none';
        nextTrigramButton.style.display = 'none';
    });
});
nextSentenceButton?.addEventListener('click', () => {
    fetchRandomContent(/[^.!?]+[.!?]+/g, sentenceElement, 100, nextSentenceButton, () => {
        solutionSection.style.display = 'none';
        nextSentenceButton.style.display = 'none';
    });
});

// Event listener for the Enter key on the input field
userAnswer?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (wordElement?.innerText) {
            submitButtonWord.click();
        } else if (trigramElement?.innerText) {
            submitButtonTrigram.click();
        } else if (sentenceElement?.innerText) {
            submitButtonSentence.click();
        }
    }
});

function showWord() {
    fetchRandomContent(/\b\w+\b/g, wordElement, 5, loadButtonWord, () => {
        wordElement.style.display = "inline-block";
    });
}

function showTrigram() {
    fetchRandomContent(/\b(?:\w+\s+){2}\w+\b/g, trigramElement, 50, loadButtonTrigram, () => {
        trigramElement.style.display = "inline-block";
    });
}

function showSentence() {
    fetchRandomContent(/\b(?:\w+\s+){2}\w+\b/g, sentenceElement, 100, loadButtonSentence, () => {
        sentenceElement.style.display = "inline-block";
    });
}
