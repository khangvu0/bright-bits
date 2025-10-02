// Set up node to connect to database 
const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const dbPool = mysql.createPool({
    host: process.env.DB_HOST, //'localhost',
    user: process.env.DB_USER, //'root',
    database: process.env.DB_NAME, //'bright_bits',
    password: process.env.DB_PASSWORD, //"password",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true
    // connectionLimit: 10,
    // queueLimit: 0
});

// Use promise
const promisePool = dbPool.promise();

// Test conenction 
promisePool.query('SELECT 1')
    .then(() => {
        console.log('Database connected successfully!');
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
    });

module.exports = promisePool;
