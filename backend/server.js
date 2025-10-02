const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
require("dotenv").config();

const getWordDetails = require("./utils/dictionary");
const randomWord = require("./utils/random");
const db = require('./db');
const bcrypt = require('bcrypt');

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

// Render register page
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Handle form submissions
app.post('/register', async (req, res) => {

    try {
        console.log("Incoming form data:", req.body);

        const { user_name, email, firstName, password, grade_level } = req.body;

        if (!firstName || !user_name || !email || !password || !grade_level) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check username
        const [existingUsername] = await db.query(
            'SELECT id FROM users WHERE user_name = ?',
            [user_name]
        );
        if (existingUsername.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }


        // Check email
        const [existingEmail] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        if (existingEmail.length > 0) {
            return res.status(409).json({ error: 'Email already registered, please sign in!' });
        }


        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);


        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (user_name, email, firstName, password_hash, grade_level) VALUES (?, ?, ?, ?, ?)',
            [user_name, email, firstName, password_hash, grade_level]
        );

        res.status(201).json({
            message: `Welcome ${firstName}!`,
            userId: result.insertId,
            user_name: user_name
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

app.get("/spelling", (req, res) => {
    res.render("spelling", { title: "spelling" });
});

app.get("/leaderboard", async (req, res) => {
    res.render("leaderboard", { title: "Leaderboard" });
    //try catch function
});

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
