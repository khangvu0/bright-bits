# 🌟 Bright Bits

**Bright Bits** is a full-stack web application designed to promote **child literacy** for students in **grades 3–5** through interactive spelling games, progress tracking, and educational resources.
It provides a fun, engaging way for young learners to practice spelling while allowing teachers and parents to monitor performance through a built-in leaderboard.

---

## 📖 Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Setup & Installation](#setup--installation)
-   [Environment Variables](#environment-variables)
-   [Deployment (Railway)](#deployment-railway)
-   [Screenshots](#screenshots)
-   [Future Improvements](#future-improvements)
-   [Author](#author)

---

## 🧩 Overview

Bright Bits tackles the issue of **child literacy** by turning spelling practice into an engaging game.
Players can register, log in, play the spelling game powered by the Merriam-Webster API, and see their scores displayed on a public leaderboard.
Teachers, parents, and students alike can explore resources that encourage stronger reading and writing habits.

---

## ✨ Features

### 🎮 Spelling Game

-   Fetches random words from the **Merriam-Webster Elementary Dictionary API**
-   Validates spelling input in real time
-   Tracks and records scores to a MySQL database

### 🏆 Leaderboard

-   Displays top players and their scores
-   Ranks students dynamically using Handlebars helpers

### 👤 Authentication

-   Register and login with password hashing using **bcrypt**
-   Session management with **express-session** and **MySQLStore**

### 🌐 Pages

| Page              | Description                                          |
| ----------------- | ---------------------------------------------------- |
| **Home**          | Hero section introducing Bright Bits and its mission |
| **About**         | Overview of the project’s purpose and goals          |
| **Spelling Game** | Core interactive feature for literacy practice       |
| **Leaderboard**   | Displays player rankings                             |
| **Register**      | User profile creation                                |
| **Login**         | User authentication                                  |

---

## 🛠️ Tech Stack

**Frontend:**

-   HTML5, CSS3, JavaScript (Vanilla)
-   Handlebars templating engine
-   Responsive design (mobile-first)

**Backend:**

-   Node.js + Express.js
-   Express-Handlebars for dynamic rendering
-   MySQL with `mysql2` and `express-mysql-session`
-   bcrypt for password hashing
-   dotenv for environment configuration

**Hosting & Tools:**

-   Deployed on **Railway**
-   Merriam-Webster API for random word data
-   GitHub for version control

---

## 📁 Project Structure

```
bright-bits/
│
├── backend/
│   ├── db.js                 # MySQL connection pool
│   ├── server.js             # Express server setup and routes
│   ├── utils/
│   │   ├── dictionary.js     # Fetches word definitions from API
│   │   └── random.js         # Generates random word selections
│   └── views/
│       ├── layouts/partials  # Handlebars partials
│       ├── index.handlebars
│       ├── about.handlebars
│       ├── spelling.handlebars
│       ├── leaderboard.handlebars
│       ├── register.handlebars
│       └── login.handlebars
│
├── frontend/
│   ├── css/                  # Stylesheets
│   ├── js/                   # Frontend scripts (validation, UI)
│   └── images/               # Static assets
│
├── .env                      # Environment variables (not committed)
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone git@github.com:khangvu0/bright-bits.git
cd bright-bits
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your `.env` file (see below)

### 4. Start the development server

```bash
npm run dev
```

Server will run at:
**[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306
SESSION_SECRET=your_session_secret
DICTIONARY_API_KEY=your_merriam_webster_api_key
```

---

## 🚀 Deployment (Railway)

Bright Bits is hosted on **[Railway](https://railway.app)**.

To deploy your own instance:

1. Push your repo to GitHub.
2. Go to **Railway → New Project → Deploy from GitHub repo**.
3. Set the **Root Directory** to `/` (since `package.json` is at root).
4. Add your environment variables in the **Variables** tab.
5. Ensure your start script is:

    ```json
    "start": "node ./backend/server.js"
    ```

6. Deploy!
   Your app will be live at:

    ```
    https://<your-project-name>.up.railway.app
    ```

---

## 🖼️ Screenshots

**Homepage** – Welcomes users and introduces the project
![Homepage preview](/frontend/images/preview-home.png)
**Spelling Game** – Interactive gameplay interface
![Spelling page preview](/frontend/images/preview-spelling.png)
**Leaderboard** – Displays top players and scores
![leaderboard preview](/frontend/images/preview-leaderboard.png)
**Register** – Create player account
![leaderboard preview](/frontend/images/preview-register.png)
**Login** – Login into player account
![leaderboard preview](/frontend/images/preview-login.png)

---

## 🔮 Future Improvements

-   Add profile pages with user statistics
-   Implement teacher dashboards for class tracking
-   Expand API integration for definitions, hints, and audio
-   Add accessibility and multilingual support

---

## 👨‍💻 Authors

**Khang Vu**
GitHub: [@khangvu0](https://github.com/khangvu0)
**Kaia Bryant**
GitHub: [@KaiaBryant](https://github.com/KaiaBryant)
**Michael Howey**
GitHub: [@Mhowey19](https://github.com/Mhowey19)
**Amy Gutierrez**
GitHub: [@amyxgm2](https://github.com/amyxgm2)

---

> “Bright Bits aims to make learning to spell as fun as playing a game — one word at a time.”
