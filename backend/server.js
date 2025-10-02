const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
require("dotenv").config();

const getWordDetails = require("./utils/dictionary");
const randomWord = require("./utils/random");

const api = process.env.DICTIONARY_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve static frontend assets (css, js, images)
app.use(express.static(path.join(__dirname, "../frontend")));

// 3. Set up Handlebars as the view engine
app.engine(
	"handlebars",
	exphbs.engine({
		defaultLayout: false,
		layoutsDir: false,
		partialsDir: path.join(__dirname, "views/partials"),
		helpers: {
			globalIndex: (groupIndex, indexInGroup, chunkSize) => groupIndex * chunkSize + indexInGroup + 1,
			inc: (value) => parseInt(value) + 1,
			math: (a, operator, b, extraOperator, c) => {
				a = parseInt(a);
				b = parseInt(b);
				c = parseInt(c);
				switch (operator) {
					case "*":
						return a * b + (extraOperator === "+" ? c : 0);
					case "+":
						return a + b;
					default:
						return 0;
				}
			},

			// ordinal helper using if/else
			ordinal: (n) => {
				n = parseInt(n, 10);
				let suffix;

				if (n % 100 === 11 || n % 100 === 12 || n % 100 === 13) {
					suffix = "th";
				} else if (n % 10 === 1) {
					suffix = "st";
				} else if (n % 10 === 2) {
					suffix = "nd";
				} else if (n % 10 === 3) {
					suffix = "rd";
				} else {
					suffix = "th";
				}

				return n + suffix;
			},
		},
	})
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 4. Routes
app.get("/", (req, res) => {
	res.render("index", { title: "Welcome to Child Literacy App" });
});

app.get("/about", (req, res) => {
	res.render("about", { title: "About Us" });
});

app.get("/login", (req, res) => {
	res.render("login", { title: "Login" });
});

app.get("/register", (req, res) => {
	res.render("register", { title: "Register" });
});

app.get("/spelling", (req, res) => {
	res.render("spelling", { title: "spelling" });
});

app.get("/leaderboard", async (req, res) => {
	try {
		// create 75 sample players
		const players = [];
		for (let i = 0; i < 75; i++) {
			players.push({
				name: `Player ${i + 1}`,
				score: Math.floor(Math.random() * 100),
				rank: i + 1, // global rank across all groups
			});
		}

		// split into groups of 25 for display
		const chunkSize = 25;
		const groupedPlayers = [];
		for (let i = 0; i < players.length; i += chunkSize) {
			groupedPlayers.push(players.slice(i, i + chunkSize));
		}

		res.render("leaderboard", { groups: groupedPlayers });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

//try catch function

app.get("/resources", async (req, res) => {
	res.render("resources", { title: "Resources" });
	//try catch function for resources
});
//Use to grab audio info //pajama02 as the plug in value using the parsed json data
// https://media.merriam-webster.com/audio/prons/en/us/mp3/p/pajama02.mp3

// 5. Start server
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/api/word", async (req, res) => {
	try {
		const random = await randomWord();
		const wordData = await getWordDetails(random);

		res.send({ wordData });
	} catch (err) {
		console.error("Error fetching from dictionary API:", err.message);
		res.status(500).json({ error: "Failed to fetch dictionary data" });
	}
});
