let currentWord = null;
let definitions = [];
let score = 0;

// ✅ Step 1: Helper to build the Merriam-Webster audio URL
function getMwAudioUrl(audioId) {
	if (!audioId) return null;

	const key = audioId.toLowerCase();
	let subdir;

	if (key.startsWith("bix")) {
		subdir = "bix";
	} else if (key.startsWith("gg")) {
		subdir = "gg";
	} else if (/[a-z]/.test(key[0])) {
		subdir = key[0]; // use the first letter
	} else {
		subdir = "number";
	}

	return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${audioId}.mp3`;
}

// Fetch first word when page loads
window.addEventListener("DOMContentLoaded", getNewWord);

async function getNewWord() {
	// clear UI
	document.getElementById("word-input").value = "";
	document.getElementById("feedback").classList.add("hidden");
	document.getElementById("answer-box").classList.add("hidden");

	try {
		// hit backend endpoint (you'd make this in server.js)
		const res = await fetch("/api/word");
		const data = await res.json();

		currentWord = data.wordData;
		definitions = currentWord.map((item) => item.definition).slice(0, 3);
		document.getElementById("definition").textContent = currentWord[0].definition || "No definition available";

		console.log(currentWord);
		// ✅ Step 2: attach pronunciation (play real MW audio file)
		document.getElementById("speak-btn").onclick = () => {
			const audioId = currentWord[0].audioId; // must come from API/backend
			const url = getMwAudioUrl(audioId);
			if (url) {
				const audio = new Audio(url);
				audio.play();
			} else {
				alert("No pronunciation available.");
			}
		};
	} catch (err) {
		console.error(err);
		document.getElementById("definition").textContent = "Error loading word.";
	}
}

// check spelling
document.getElementById("submit-btn").addEventListener("click", () => {
	const userInput = document.getElementById("word-input").value.trim().toLowerCase();
	const feedbackEl = document.getElementById("feedback");

	if (!currentWord) return;

	if (userInput === currentWord[0].word.toLowerCase()) {
		feedbackEl.textContent = "✅ Correct!";
		feedbackEl.style.color = "green";
		score++;
		document.getElementById("score").textContent = score;

		// show correct word + definitions
		document.getElementById("correct-word").textContent = currentWord[0].word;
		const list = document.getElementById("definitions-list");
		list.innerHTML = "";
		definitions.forEach((def) => {
			const li = document.createElement("li");
			li.textContent = def;
			list.appendChild(li);
		});

		document.getElementById("answer-box").classList.remove("hidden");
	} else {
		feedbackEl.textContent = "❌ Incorrect, try again.";
		feedbackEl.style.color = "red";
		score = 0; // reset streak
		document.getElementById("score").textContent = score;
	}

	feedbackEl.classList.remove("hidden");
});

// continue button
document.getElementById("continue-btn").addEventListener("click", getNewWord);
