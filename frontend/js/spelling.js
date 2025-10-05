// State variables
let currentWord = null;
let definitions = [];
let score = 0;
let lives = 3;

// DOM variables
const wordInput = document.getElementById('word-input');
const feedbackEl = document.getElementById('feedback');
const answerBox = document.getElementById('answer-box');
const definitionEl = document.getElementById('definition');
const speakBtn = document.getElementById('speak-btn');
const submitBtn = document.getElementById('submit-btn');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');
const livesEl = document.getElementById('lives');
const scoreEl = document.getElementById('score');
const correctWordEl = document.getElementById('correct-word');
const definitionsList = document.getElementById('definitions-list');

// Helper function to build the Merriam-Webster audio URL
function getMwAudioUrl(audioId) {
    if (!audioId) return null;

    const key = audioId.toLowerCase();
    let subdir;

    if (key.startsWith('bix')) {
        subdir = 'bix';
    } else if (key.startsWith('gg')) {
        subdir = 'gg';
    } else if (/[a-z]/.test(key[0])) {
        subdir = key[0]; // use the first letter
    } else {
        subdir = 'number';
    }

    return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${audioId}.mp3`;
}

// Helper function to restart game
function restartGame() {
    score = 0;
    lives = 3;
    scoreEl.textContent = score;
    livesEl.textContent = lives;

    submitBtn.disabled = false;
    wordInput.disabled = false;

    feedbackEl.classList.add('hidden');
    restartBtn.classList.add('hidden');

    getNewWord();
}

// Core game logic
async function getNewWord() {
    // clear UI
    wordInput.value = '';
    feedbackEl.classList.add('hidden');
    answerBox.classList.add('hidden');
    restartBtn.classList.add('hidden');
    submitBtn.disabled = false;
    wordInput.disabled = false;

    try {
        // hit backend endpoint (you'd make this in server.js)
        const res = await fetch('/api/word');
        const data = await res.json();

        currentWord = data.wordData;
        definitions = currentWord.map((item) => item.definition).slice(0, 3);
        definitionEl.textContent =
            currentWord[0].definition || 'No definition available';

        console.log(currentWord);
        // Attach pronunciation (play real MW audio file)
        speakBtn.onclick = () => {
            const audioId = currentWord[0].audioId; // must come from API/backend
            const url = getMwAudioUrl(audioId);
            if (url) {
                const audio = new Audio(url);
                audio.play();
            } else {
                alert('No pronunciation available.');
            }
        };
    } catch (err) {
        console.error(err);
        definitionEl.textContent = 'Error loading word.';
    }
}

// check spelling
submitBtn.addEventListener('click', () => {
    const userInput = wordInput.value.trim().toLowerCase();

    if (!currentWord) return;

    if (userInput === currentWord[0].word.toLowerCase()) {
        feedbackEl.textContent = '✅ Correct!';
        feedbackEl.style.color = 'green';
        score++;
        scoreEl.textContent = score;
        submitBtn.disabled = true;
        wordInput.disabled = true;

        // show correct word + definitions
        correctWordEl.textContent = currentWord[0].word;
        definitionsList.innerHTML = '';
        definitions.forEach((def, idx) => {
            const li = document.createElement('li');
            li.textContent = `${idx + 1}) ${def}`;
            definitionsList.appendChild(li);
        });

        answerBox.classList.remove('hidden');
    } else {
        lives--;
        livesEl.textContent = lives;
        if (lives > 0) {
            feedbackEl.textContent = `❌ Incorrect, try again.`;
            feedbackEl.style.color = 'red';
        } else {
            feedbackEl.textContent = '💀 Game Over! Final score: ' + score;
            feedbackEl.style.color = 'red';
            submitBtn.disabled = true;
            wordInput.disabled = true;
            restartBtn.classList.remove('hidden');

            submitScore(score);
        }
    }
    feedbackEl.classList.remove('hidden');
});

// Inserts and saves score (session handles user!)
async function submitScore(score) {
    try {
        const res = await fetch('/spelling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ score })
        });

        const data = await res.json();
        if (!res.ok) {
            console.error('Error saving score:', data.error || data);
        } else {
            console.log('Score saved:', data);
        }
    } catch (err) {
        console.error('Failed to submit score:', err);
    }
}

continueBtn.addEventListener('click', getNewWord);
restartBtn.addEventListener('click', restartGame);
window.addEventListener('DOMContentLoaded', getNewWord);
