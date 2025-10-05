const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
require('dotenv').config();

const getWordDetails = require('./utils/dictionary');
const randomWord = require('./utils/random');
const db = require('./db');
const bcrypt = require('bcrypt');

//  Express sessions
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const api = process.env.DICTIONARY_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

//  Sessions setup
const sessionStore = new MySQLStore({}, db);
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'supersecret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
        httpOnly: true,
        secure: false // set true if using HTTPS
    }
}));

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
        helpers: {
            globalIndex: (groupIndex, indexInGroup, chunkSize) =>
                groupIndex * chunkSize + indexInGroup + 1,
            inc: (value) => parseInt(value) + 1,
            math: (a, operator, b, extraOperator, c) => {
                a = parseInt(a);
                b = parseInt(b);
                c = parseInt(c);
                switch (operator) {
                    case '*':
                        return a * b + (extraOperator === '+' ? c : 0);
                    case '+':
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
                    suffix = 'th';
                } else if (n % 10 === 1) {
                    suffix = 'st';
                } else if (n % 10 === 2) {
                    suffix = 'nd';
                } else if (n % 10 === 3) {
                    suffix = 'rd';
                } else {
                    suffix = 'th';
                }

                return n + suffix;
            },
        },
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

// Login render and route
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.post('/login', async (req, res) => {
    try {
        const { user_name, password } = req.body;

        if (!user_name || !password) {
            return res
                .status(400)
                .json({ error: 'Username and password are required' });
        }

        // Look up user by username
        const [rows] = await db.query(
            'SELECT * FROM users WHERE user_name = ?',
            [user_name]
        );
        if (rows.length === 0) {
            return res
                .status(401)
                .json({ error: 'Invalid username or password' });
        }

        const user = rows[0];

        // Compare plain password with stored hash
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res
                .status(401)
                .json({ error: 'Invalid username or password' });
        }

        // Save user info into the session
        req.session.userId = user.id;
        req.session.username = user.user_name;

        res.json({
            message: `Welcome back, ${user.first_name}!`,
            userId: user.id,
            user_name: user.user_name,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});


// Sessions Middleware
function requireLogin(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
    next();
}

// Render register page
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Handle form submissions
app.post('/register', async (req, res) => {
    try {
        console.log('Incoming form data:', req.body);

        const { user_name, email, first_name, password, grade_level } =
            req.body;

        if (!first_name || !user_name || !email || !password || !grade_level) {
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
            return res
                .status(409)
                .json({ error: 'Email already registered, please sign in!' });
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (user_name, email, first_name, password_hash, grade_level) VALUES (?, ?, ?, ?, ?)',
            [user_name, email, first_name, password_hash, grade_level]
        );

        res.status(201).json({
            message: `Welcome ${first_name}!`,
            userId: result.insertId,
            user_name: user_name,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'An error occurred during registration',
        });
    }
});

app.get('/spelling', (req, res) => {
    const username = req.session.username || null;
    res.render('spelling', { title: 'spelling', username });
});

app.post('/spelling', requireLogin, async (req, res) => {
    try {
        const { score } = req.body;

        if (score === undefined) {
            return res
                .status(400)
                .json({ error: 'Score are required' });
        }

        // Insert score
        const [result] = await db.query(
            'INSERT INTO game_score (user_id, score) VALUES (?, ?)',
            [req.session.user_Id, score]
        );

        res.status(201).json({
            message: 'Score recorded successfully',
            scoreId: result.insertId,
        });
    } catch (err) {
        console.error('Error saving score:', err);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

app.get('/leaderboard', async (req, res) => {
    try {
        const [players] = await db.query(`
      SELECT u.user_name AS name, g.score
      FROM game_score g
      JOIN users u ON g.user_id = u.id
      ORDER BY g.score DESC
      LIMIT 20
    `);
        // split into groups of 25 for display
        const chunkSize = 25;
        const groupedPlayers = [];
        for (let i = 0; i < players.length; i += chunkSize) {
            groupedPlayers.push(players.slice(i, i + chunkSize));
        }
        res.render('leaderboard', { groups: groupedPlayers });
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).send('Server error');
    }
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

app.get('/api/word', async (req, res) => {
    try {
        const random = await randomWord();
        const wordData = await getWordDetails(random);

        res.send({ wordData });
    } catch (err) {
        console.error('Error fetching from dictionary API:', err.message);
        res.status(500).json({ error: 'Failed to fetch dictionary data' });
    }
});
