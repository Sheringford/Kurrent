// Define the path to your text file
const filePath = 'sentences.txt';

// References to elements
const loadButtonWords = document.getElementById('load-word');
const wordElement = document.getElementById('word');
const answerSection = document.getElementById('answer-section');
const userAnswer = document.getElementById('user-answer');
const submitButton = document.getElementById('submit-answer-word');
const feedback = document.getElementById('feedback');
const nextWordButton = document.getElementById('next-word');
const solutionButton = document.getElementById('solution');
const solutionSection = document.getElementById('solution-section')

let currentWord = ''; // Store the current word for validation
let score = 0;

// Event listener for the "Load Word" button
loadButtonWords.addEventListener('click', () => {
    // Hide the "Load Word" button
    loadButtonWords.style.display = 'none';

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Read the response as text
        })
        .then(data => {
            // Split the file content into words
            const words = data.match(/\b\w+\b/g);

            if (words && words.length > 0) {
                // Pick a random word
                currentWord = words[Math.floor(Math.random() * words.length)].trim();
                
                // Display the random word
                wordElement.innerText = currentWord;
                
                // Show the answer section
                answerSection.style.display = 'block';
                
                // Clear previous input and feedback
                userAnswer.value = '';
                feedback.innerText = ''; // Clear feedback text
            } else {
                wordElement.innerText = 'No words found in the file.';
                answerSection.style.display = 'none';
                loadButtonWords.style.display = 'block'; // Re-show the button if no words are found
            }
        })
        .catch(error => {
            console.error('Error fetching the text file:', error);
            wordElement.innerText = 'Failed to load content.';
            answerSection.style.display = 'none';
            loadButtonWords.style.display = 'block'; // Re-show the button if an error occurs
        });
});

// Event listener for the "Submit" button
submitButton.addEventListener('click', () => {
    const userInput = userAnswer.value.trim();

    if (userInput === currentWord) {
        feedback.innerText = 'Richtig!';
        feedback.style.color = 'green';
        score += 5;
        feedback.innerText = 'Richtig! Dein aktueller Score ist: ' + score;
    } else {
        feedback.style.color = 'red';
        // Show the "Solution" button
        solutionButton.style.display = 'block';
        score -= 1;
        feedback.innerText = 'Falsch! Dein aktueller Score ist: ' + score;
    }

    // Show the "Next Word" button
    nextWordButton.style.display = 'block';
});

// Event listener for the "Solution" button
solutionButton.addEventListener('click', () => {
        
    // Display correct answer
    solutionSection.innerText = currentWord;

    // Show the solution section
    solutionSection.style.display = 'block';
});

// Event listener for the "Next Word" button
nextWordButton.addEventListener('click', () => {
    // Fetch a new random word
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const words = data.match(/\b\w+\b/g);

            if (words && words.length > 0) {
                currentWord = words[Math.floor(Math.random() * words.length)].trim();
                wordElement.innerText = currentWord;
                userAnswer.value = '';
                feedback.innerText = '';
                solutionSection.style.display = 'none';
            } else {
                WaveShaperNodeElement.innerText = 'No words found in the file.';
                feedback.innerText = '';
            }
        })
        .catch(error => {
            console.error('Error fetching the text file:', error);
            wordElement.innerText = 'Failed to load content.';
        });

    // Reset visibility of buttons
    nextWordButton.style.display = 'none';
});

// Event listener for the Enter key on the input field
userAnswer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of the Enter key
        submitButton.click(); // Simulate a click on the submit button
    }
});
