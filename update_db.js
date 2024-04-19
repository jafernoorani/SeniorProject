const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

// Parsing middlware
app.use(bodyParser.josn());

// Create database connection
let connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
});

// Verify database connection
connection.getConnection((err, connection) => {
	if (err) throw err;
	console.log('Connected as ID ' + connection.threadId);
	connection.release();
});

app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});

// Check if email or username exists and register user

// Register endpoint
app.post('/register', (req, res) => {
	console.log(req.body);
	var fullName = req.body.fullname;
	var emailAddr = req.body.email;
	var userName = req.body.username;
	var pass = req.body.password;
	
	connection.query('SELECT * FROM patientData WHERE username = ? OR email = ?', [username, email], (err, results) => {
		if (err) throw err;
		if (results.length > 0) {
			res.send('Username or email already exists');
		} else {
			connection.query('INSERT INTO patientData (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, results) => {
				if (err) throw err;
				res.send('User registered successfully');
			});
		}
	});
});

// Login endpoint
app.get('/login', (req, res) => {
	var patientID = "1"; // need to get from req body
	connection.query('SELECT * FROM vitalData WHERE patientID = ? AND vitalType = ?', [patientId, "BloodSugar - Morning"], (err, results) => {
		if (err) throw err;

		if (results.length > 0) {
			res.redirect('/dashboard.html');
		} else {
			res.send('Wrong username or password');
		}
	});
});

// Dashboard data endpoint
app.post('/data', (req, res) => {
	connection.query('SELECT * FROM vitalData WHERE patientID = ? AND vitalType = ?', [patientId, "BloodSugar - Morning"], (err, results) => {
		if (err) throw err;
		res.json(results);
	}); 
});

// Submit blood sugar levels
app.post('/submit-levels', (req, res) => {
	console.log(req.body);
	var morning = req.body.morningLevel;
	var afternoon = req.body.afternoonLevel;
	var evening = req.body.eveningLevel;
	var date = req.body.vitalsTaken;
	/* PatientID likely will NOT be included with form
	 * Username WILL likely be included with form
	 * Will need to connection.query('SELECT patientID from patientData WHERE username = ?', username, (err, results) => {** err handling **});
	 * */
	var patientID = req.body.patientId;

	connection.query('INSERT INTO vitalData (patientID, vitalsTakenDate, vitalType, vitalValue) VALUES (?, ?, ?, ?)', [patientID, date, "BloodSugar - Morning", morning], (err, results) => {
		if (err) throw err;
		res.send('Morning data submitted succefully');
	});
	connection.query('INSERT INTO vitalData (patientID, vitalsTakenDate, vitalType, vitalValue) VALUES (?, ?, ?, ?)', [patientID, date, "BloodSugar - Afternoon", afternoon], (err, results) => {
		if (err) throw err;
		res.send('Afternoon data submitted succefully');
	});
	connection.query('INSERT INTO vitalData (patientID, vitalsTakenDate, vitalType, vitalValue) VALUES (?, ?, ?, ?)', [patientID, date, "BloodSugar - Evening", evening], (err, results) => {
		if (err) throw err;
		res.send('Evening data submitted succefully');
	});
	
});
