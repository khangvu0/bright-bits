const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
require('dotenv').config();
const dictionaryData = require('./utils/dictionary');

const api = process.env.DICTIONARY_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve static frontend assets (css, js, images)
app.use(express.static(path.join(__dirname, '../frontend')));

// 3. Set up Handlebars as the view engine
app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: false,
        layoutsDir: false,
        partialsDir: path.join(__dirname, 'views/partials'),
    })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 4. Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to Child Literacy App' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

app.get('/spelling', async (req, res) => {
    try {
        const word = 'Road';
        const wordData = await dictionaryData(word);
        res.json(wordData);
    } catch (err) {
        console.error('Error fetching from dictionary API:', err.message);
        res.status(500).json({ error: 'Failed to fetch dictionary data' });
    }
});

app.get('/leaderboard', async (req, res) => {
    res.render('leaderboard', { title: 'Leaderboard' });
    //try catch function
});

app.get('/resources', async (req, res) => {
    res.render('resources', { title: 'Resources' });
    //try catch function for resources
});
//Use to grab audio info //pajama02 as the plug in value using the parsed json data
// https://media.merriam-webster.com/audio/prons/en/us/mp3/p/pajama02.mp3

// 5. Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
