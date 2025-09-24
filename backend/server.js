const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
require("dotenv").config();

const api = process.env.DICTIONARY_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve static frontend assets (css, js, images)
app.use(express.static(path.join(__dirname, "../frontend")));

// 3. Set up Handlebars as the view engine
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 4. Routes
app.get("/", (req, res) => {
	res.render("home", { title: "Welcome to Child Literacy App" });
});

app.get("/about", (req, res) => {
	res.render("about", { title: "About Us" });
});

// Example API route (for frontend app.js to fetch from)
app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello from the backend!" });
});

// 5. Start server
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/about2", async (req, res) => {
	try {
		const url = `https://www.dictionaryapi.com/api/v3/references/sd2/json/pizza?key=${api}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`);
		}

		const data = await response.json();
		res.json(data); // ✅ send back the API response
	} catch (err) {
		console.error("Error fetching from dictionary API:", err.message);
		res.status(500).json({ error: "Failed to fetch dictionary data" });
	}
});
