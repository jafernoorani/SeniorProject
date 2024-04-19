const express = require('express');
const html = require('html');

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'backend')));

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

        // Insert user data into MySQL database
        const sql = 'INSERT INTO patientData (fullName, emailAddress, password, userName) VALUES (?, ?, ?, ?)';
        db.query(sql, [fullName, emailAddress, password, username], (err, result) => {
            if (err) {
                res.status(500).send('Error saving user data');
                throw err;
            }
            res.status(200).send('User registered successfully');
        });
});


// // Route to handle form submission
// app.get('/test', (req, res) => {
//     res.status(200).send('Yay!');
// });


//get me to this html form
app.get('/createAccount', (req, res) => {
    // res.sendFile(__dirname + '/index.html');
    res.sendFile(__dirname+ '/createAccount.html');
});



app.post('/createAccount', (req, res) => {
    res.status(200).send(req.body);
});


//get me to this html form
app.get('/user/:id', (req, res) => {
    // Insert user data into MySQL database
    const sql = 'SELECT fullName, emailAddress, password, username FROM patientData WHERE patientID = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send('Error saving user data');
            throw err;
            }
            res.status(200).send(result);
        });
});



//login stuff
app.post('/loginAccount', (req, res) => {
    res.status(200).send(req.body);
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
