const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create connection to MySQL database
const db = mysql.createConnection({
    host: '54.226.103.123',
    port: 3306,
    user: 'author',
    password: 'authorpass123',
    database: 'SugarDaddy'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

// Route to handle form submission
app.post('/saveData', (req, res) => {
    const { fullName, emailAddress, password, username } = req.body;

    // Hash the password for security
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).send('Error hashing password');
            throw err;
        }

        // Insert user data into MySQL database
        const sql = 'INSERT INTO patientData (fullName, emailAddress, password, userName) VALUES (?, ?, ?, ?)';
        db.query(sql, [fullName, emailAddress, hashedPassword, username], (err, result) => {
            if (err) {
                res.status(500).send('Error saving user data');
                throw err;
            }
            res.status(200).send('User registered successfully');
        });
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
