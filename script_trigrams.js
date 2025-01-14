// Define the path to your text file
const filePath = 'sentences.txt';

// References to elements
const loadButton = document.getElementById('load-sentence');
const sentenceElement = document.getElementById('sentence');
const answerSection = document.getElementById('answer-section');
const userAnswer = document.getElementById('user-answer');
const submitButton = document.getElementById('submit-answer');
const feedback = document.getElementById('feedback');
const nextSentenceButton = document.getElementById('next-sentence');
const solutionButton = document.getElementById('solution');
const solutionSection = document.getElementById('solution-section');

let currentSentence = ''; // Store the current sentence for validation
let score = 0;

// Event listener for the "Load Sentence" button
loadButton.addEventListener('click', () => {
    // Hide the "Load Sentence" button
    score += 50;
    loadButton.style.display = 'none';

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
                // Pick a random index for the word
                const randomIndex = Math.floor(Math.random() * (words.length - 2)); // Ensure room for two following words
                
                // Get the random word and the next two words
                const selectedWords = words.slice(randomIndex, randomIndex + 3).join(' '); // Join the 3 words
                
                // Display the random sentence
                sentenceElement.innerText = selectedWords;
                
                // Show the answer section
                answerSection.style.display = 'block';
                
                // Clear previous input and feedback
                userAnswer.value = '';
                feedback.innerText = ''; // Clear feedback text

                // Store the selected sentence for validation
                currentSentence = selectedWords;
            } else {
                sentenceElement.innerText = 'No words found in the file.';
                answerSection.style.display = 'none';
                loadButton.style.display = 'block'; // Re-show the button if no words are found
            }
        })
        .catch(error => {
            console.error('Error fetching the text file:', error);
            sentenceElement.innerText = 'Failed to load content.';
            answerSection.style.display = 'none';
            loadButton.style.display = 'block'; // Re-show the button if an error occurs
        });
});

// Event listener for the "Submit" button
submitButton.addEventListener('click', () => {
    const userInput = userAnswer.value.trim();

    if (userInput === currentSentence) {
        feedback.style.color = 'green';
        feedback.innerText = 'Richtig! Dein aktueller Score ist: ' + score;
    } else {
        feedback.style.color = 'red';
        // Show the "Solution" button
        solutionButton.style.display = 'block';
        score -= 60;
        feedback.innerText = 'Falsch! Dein aktueller Score ist: ' + score;
    }

    // Show the "Next Sentence" button
    nextSentenceButton.style.display = 'block';
});

// Event listener for the "Solution" button
solutionButton.addEventListener('click', () => {
    // Display correct answer
    solutionSection.innerText = currentSentence;

    // Show the solution section
    solutionSection.style.display = 'block';
});

// Event listener for the "Next Sentence" button
nextSentenceButton.addEventListener('click', () => {
    // Fetch a new random sentence
    score += 50;
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
                const randomIndex = Math.floor(Math.random() * (words.length - 2)); // Ensure room for two following words
                currentSentence = words.slice(randomIndex, randomIndex + 3).join(' '); // Get the next sentence
                sentenceElement.innerText = currentSentence;
                userAnswer.value = '';
                feedback.innerText = '';
                solutionSection.style.display = 'none';
            } else {
                sentenceElement.innerText = 'No words found in the file.';
                feedback.innerText = '';
            }
        })
        .catch(error => {
            console.error('Error fetching the text file:', error);
            sentenceElement.innerText = 'Failed to load content.';
        });

    // Reset visibility of buttons
    nextSentenceButton.style.display = 'none';
});

// Event listener for the Enter key on the input field
userAnswer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of the Enter key
        submitButton.click(); // Simulate a click on the submit button
    }
});
