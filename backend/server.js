const express = require('express');
const html = require('html');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'backend')));


// Middleware for session management
app.use(session({
    secret: 'your_secret_keyS6fJ2v@Czn!g8*wQx3uYzRt7#hEaP5',
    resave: false,
    saveUninitialized: true
}));



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
    // http://localhost:3000/createAccount
    // res.sendFile(__dirname + '/index.html');
    res.sendFile(path.join(__dirname, '/../frontend/createAccount.html'));

});



app.post('/createAccount', (req, res) => {
    res.status(200).send(req.body);
    
});

// Display the form
app.get('/saveBloodSugarData', (req, res) => {
    // Assuming you have a file named 'blood_sugar_form.html' that contains your form HTML
    res.sendFile(path.join(__dirname, '/../frontend/dashboard.html'));
});

// Handle form submission
app.post('/saveBloodSugarData', (req, res) => {
    const { morningLevel, afternoonLevel, eveningLevel, selectedDate } = req.body;

    // Retrieve the patientID from the session
    const patientID = req.session.patientID;

    // Log the received data for debugging
    console.log("Received blood sugar data:");
    console.log("Morning Level:", morningLevel);
    console.log("Afternoon Level:", afternoonLevel);
    console.log("Evening Level:", eveningLevel);
    console.log("Selected Date:", selectedDate);
    console.log("Patient ID:", patientID);

    // Insert blood sugar data into MySQL database
    const sql = 'INSERT INTO vitalData (patientID, vitalsTakenDate, vitalType, vitalValue) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)';
    const values = [
        patientID, selectedDate, 'BloodSugar - Morning', morningLevel,
        patientID, selectedDate, 'BloodSugar - Afternoon', afternoonLevel,
        patientID, selectedDate, 'BloodSugar - Evening', eveningLevel
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            // Log the database error for debugging
            console.error("Error saving blood sugar data:", err);
            res.status(500).send('Error saving blood sugar data');
            return;
        }
        // Log the successful data insertion for debugging
        console.log("Blood sugar data saved successfully");
        res.status(200).send('Blood sugar data saved successfully');
    });
});




//get me to this html form
//http://localhost:3000/user/4
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
// app.post('/loginAccount', (req, res) => {
//     res.status(200).send(req.body);
//     //logic for verifying username and password
//     //select query and check if the result has a value


//     //if yes --> update patientTable --> isLoggedIn
//     //then send them to the next paoge
// });


// Login endpoint
app.post('/loginAccount', (req, res) => {
    const { username, password } = req.body;

    // Execute a SQL query to find the user
    const query = `SELECT patientID FROM patientData WHERE username = ? AND password = ?`;
    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error("Error finding user:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        if (result.length === 0) {
            // No user found with the provided credentials
            res.status(401).send("Invalid username or password");
            return;
        }

        // Retrieve the patientID from the query result
        const patientID = result[0].patientID;

        // Store the patientID in the session
        req.session.patientID = patientID;

        // Log the session ID and patientID
        console.log("Session ID:", req.sessionID);
        console.log("Patient ID:", req.session.patientID);

        // Redirect the user to the dashboard
        res.redirect('/dashboard.html');
    });
});







//get me to this html form
app.get('/loginAccount', (req, res) => {
    // http://localhost:3000/createAccount
    res.sendFile(path.join(__dirname, '/../frontend/login.html'));

});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/dashboard.html'));
});



function isLoggedIn(patientID) {
    //check if paitentID exists 
    //check if patientId is loggedin 
    //if both of these are true 
        //return true 

    //else return false

    //if logged in --> go to dahsboard.html
    //if else go to login.html
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
