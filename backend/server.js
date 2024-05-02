// UNCOMMENT FOR PRODUCTION
// const dotenv = require('dotenv');
const path = require('path');
//dotenv.config({ path: path.resolve(__dirname, './.env') })
const express = require('express');
const html = require('html');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'backend')));
app.use(express.json());


// Middleware for session management
app.use(session({
    secret: 'your_secret_keyS6fJ2v@Czn!g8*wQx3uYzRt7#hEaP5',
    resave: false,
    saveUninitialized: true
}));

// Place this before your route definitions
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // adjust '*' to fit your needs
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});



// Create connection to MySQL database
const db = mysql.createConnection({
    host: '172.31.23.97',
    port: 3306,
    user: 'author',
    password: 'authorpass123',
    database: 'SugarDaddy', 
    // UNCOMMENT FOR PRODUCTION
    /*
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    */
});

// console.log(db);

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

// Route to handle form submission (for both registration and login)
app.post('/saveData', (req, res) => {
    const { fullName, emailAddress, password, username, action } = req.body;

    // Check the value of the 'action' parameter to determine the action
    if (action === 'register') {
        // Check if the username or email already exists
        const checkQuery = 'SELECT * FROM patientData WHERE username = ? OR emailAddress = ?';
        db.query(checkQuery, [username, emailAddress], (checkErr, checkResult) => {
            if (checkErr) {
                console.error("Error checking username/email:", checkErr);
                res.status(500).send("Internal Server Error");
                return;
            }

            if (checkResult.length > 0) {
                // Username or email already exists
                res.status(409).send("Username or email already exists");
                return;
            }

            // Perform registration logic here since username/email is unique
            // For example, insert the user data into the database
            const sql = 'INSERT INTO patientData (fullName, emailAddress, password, username) VALUES (?, ?, ?, ?)';
            db.query(sql, [fullName, emailAddress, password, username], (err, result) => {
                if (err) {
                    res.status(500).send('Error saving user data');
                    console.error(err);
                    return;
                }
                // Redirect after successful registration
                res.sendFile(path.join(__dirname, '/../frontend/login.html'));
            });
        });
    } else if (action === 'login') {
        // Perform login logic here
        // For example, verify the username and password against the database
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

            res.redirect('/dashboard.html');
        });
    } else {
        res.status(400).send("Invalid action");
    }
});




// Register endpoint
app.post('/createAccount', (req, res) => {
    const { fullName, emailAddress, password, username } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
            console.error("Error hashing password:", hashErr);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Check if the username already exists
        const checkQuery = 'SELECT * FROM patientData WHERE username = ?';
        db.query(checkQuery, [username], (checkErr, checkResult) => {
            if (checkErr) {
                console.error("Error checking username:", checkErr);
                res.status(500).send("Internal Server Error");
                return;
            }

            if (checkResult.length > 0) {
                // Username already exists
                res.status(409).send("Username already exists");
                return;
            }

            // If the username is unique, proceed with registration
            const insertQuery = 'INSERT INTO patientData (fullName, emailAddress, password, username) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [fullName, emailAddress, hashedPassword, username], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error("Error registering user:", insertErr);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                // Registration successful
                res.status(200).send("Registration successful");
            });
        });
    });
});

// Homepage landing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/homepage.html'));
});


// Route to serve the createAccount.html file
app.get('/createAccount', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/createAccount.html'));
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

    // Check if there are already three entries for the selected date
    const checkSql = 'SELECT COUNT(*) AS entryCount FROM vitalData WHERE patientID = ? AND vitalsTakenDate = ? AND vitalType like "BloodSugar%"';
    db.query(checkSql, [patientID, selectedDate], (checkErr, checkResult) => {
        if (checkErr) {
            console.error("Error checking existing entries:", checkErr);
            res.status(500).send('Error checking existing entries');
            return;
        }

        // Parse the count of existing entries
        const entryCount = checkResult[0].entryCount;

        // If there are already three entries, reject the new data
        if (entryCount >= 3) {
            console.log("Maximum entries reached for the selected date");
            res.status(400).send('Maximum entries reached for the selected date');
            return;
        }

        // If there are less than three entries, proceed with insertion
        const sql = 'INSERT INTO vitalData (patientID, vitalsTakenDate, vitalType, vitalValue) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)';
        const values = [
            patientID, selectedDate, 'BloodSugar - Morning', morningLevel,
            patientID, selectedDate, 'BloodSugar - Afternoon', afternoonLevel,
            patientID, selectedDate, 'BloodSugar - Evening', eveningLevel
        ];

        db.query(sql, values, (insertErr, result) => {
            if (insertErr) {
                console.error("Error saving blood sugar data:", insertErr);
                res.status(500).send('Error saving blood sugar data');
                return;
            }
            console.log("Blood sugar data saved successfully");
            res.status(200).send('Blood sugar data saved successfully');
        });
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

// Endpoint to update user account details
// Node.js/Express server setup

app.post('/updateAccount', (req, res) => {
    const { username, email, age, dob, weight, height, medicalConditions } = req.body;

    const updateQuery = `UPDATE patientData SET
                            emailAddress = ?,
                            Age = ?,
                            doB = ?,
                            Weight = ?,
                            Height_in = ?,
                            Symptoms = ?
                         WHERE username = ?;`;

    db.query(updateQuery, [email, age, dob, weight, height, medicalConditions, username], (error, results) => {
        if (error) {
            console.error('Failed to update account:', error);
            return res.status(500).send('Error updating account');
        }
        // Send a simple response text or HTML
        res.send('Account updated successfully'); // Simple text response
    });
});






app.get('/getCurrentUserData', (req, res) => {
    if (!req.session.patientID) {
        return res.status(403).send('Not authorized');
    }

    const patientID = req.session.patientID;
    const query = 'SELECT username, emailAddress, Age, doB, Weight, Height_in, Symptoms FROM patientData WHERE patientID = ?';

    db.query(query, [patientID], (err, results) => {
        if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).send('Error fetching user data');
        }

        if (results.length > 0) {
            const userData = results[0];
            res.json(userData);
        } else {
            res.status(404).send('User not found');
        }
    });
});






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

// Route to handle logout using POST method
app.post('/logout', (req, res) => {
    if (req.session && req.session.patientID) {
        const patientID = req.session.patientID;
        const query = `UPDATE patientData SET isLoggedIn = NULL WHERE patientID = ?`;

        // Update the database to set isLoggedIn to NULL
        db.query(query, [patientID], (err, result) => {
            if (err) {
                console.error("Error updating logout status in database:", err);
                return res.status(500).send("Internal Server Error");
            }

            console.log("Database updated, user logged out successfully, patientID:", patientID);

            // Now destroy the session
            req.session.destroy(sessionErr => {
                if (sessionErr) {
                    console.error("Error during session destruction:", sessionErr);
                    return res.status(500).send("Internal Server Error");
                }

                console.log("Session destroyed, user logged out successfully.");
                res.redirect('/loginAccount'); // Redirect to the login page
            });
        });
    } else {
        console.log("No active session found for user, possibly already logged out.");
        res.status(400).send("No active session found");
    }
});

// Middleware function to fetch data from the database
app.get('/api/dashboard', (req, res) => {
    if (!req.session.patientID) {
        res.status(403).send("Access Denied");
        return;
    }
    const patientID = req.session.patientID;

    // Fetch data from the database for the specific patient
    const sql = 'SELECT * FROM vitalData WHERE patientID = ? AND vitalType like "BloodSugar%"';
    db.query(sql, [patientID], (err, results) => {
        if (err) {
            console.error("Error fetching data from database:", err);
            return res.status(500).send("Internal Server Error");
        }

        // Log the fetched data to the console
        console.log("Patient's Blood Sugar Data:");
        console.log(results);

        // Send the fetched data as JSON
        res.json(results);
    });
});


// Route handler to serve the dashboard HTML file
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/dashboard.html'));
});


app.get('/weightDashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/weightDashboard.html'));
});

app.get('/weightDashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/weightDashboard.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/account.html'));
});

app.get('/analyticsWindow', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/analytics_Window.html'));
});


// Route to handle saving weight data
app.post('/saveWeightData', (req, res) => {
    const { weight, date } = req.body;
    const patientID = req.session.patientID;

    if (!weight || !date) {
        return res.status(400).send({ error: 'Both weight and date must be provided.' });
    }

    const checkQuery = 'SELECT * FROM weightData WHERE patientID = ? AND measurementDate = ?';
    db.query(checkQuery, [patientID, date], (err, results) => {
        if (err) {
            console.error('Error checking for existing weight entry:', err);
            return res.status(500).send({ error: 'Error checking for existing weight entry' });
        }
        if (results.length > 0) {
            return res.status(409).send({ error: 'Weight entry for this date already exists' });
        }

        const insertQuery = 'INSERT INTO weightData (patientID, weight, measurementDate) VALUES (?, ?, ?)';
        db.query(insertQuery, [patientID, weight, date], (insertErr, insertResults) => {
            if (insertErr) {
                console.error('Error inserting weight data:', insertErr);
                return res.status(500).send({ error: 'Error inserting weight data' });
            }
            res.status(200).send({ message: 'Weight data added successfully' });
        });
    });
});



app.get('/fetchWeightData', (req, res) => {
    const patientID = req.session.patientID; // Ensure the patientID is set correctly in session

    if (!patientID) {
        return res.status(403).send('No session found. Please log in.');
    }

    const fetchQuery = 'SELECT weight, measurementDate FROM weightData WHERE patientID = ? ORDER BY measurementDate DESC';
    db.query(fetchQuery, [patientID], (err, results) => {
        if (err) {
            console.error('Error fetching weight data:', err);
            return res.status(500).send('Error fetching weight data');
        }
        res.json(results);
    });
});

// Endpoint to fetch weight data for a logged-in user
app.get('/getWeightData', (req, res) => {
    const patientID = req.session.patientID;
    if (!patientID) {
        return res.status(403).send('Session is invalid or expired');
    }

    const query = "SELECT weight, measurementDate FROM weightData WHERE patientID = ?";
    db.query(query, [patientID], (err, results) => {
        if (err) {
            console.error('Failed to retrieve weight data:', err);
            return res.status(500).send('Failed to retrieve weight data');
        }
        console.log(results);  // Check what's actually being sent back
        res.json(results);
    });
});



// Middleware function to fetch data from the database
app.get('/api/weight', (req, res) => {
    if (!req.session.patientID) {
        res.status(403).send("Access Denied");
        return;
    }
    const patientID = req.session.patientID;

    // Fetch data from the database for the specific patient
    const sql = 'SELECT * FROM vitalData WHERE patientID = ? AND vitalType = "Weight"';
    db.query(sql, [patientID], (err, results) => {
        if (err) {
            console.error("Error fetching data from database:", err);
            return res.status(500).send("Internal Server Error");
        }

        // Log the fetched data to the console
        console.log("Patient's Weight Data:");
        console.log(results);

        // Send the fetched data as JSON
        res.json(results);
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Assuming password is hashed and checked here
    const loginQuery = 'SELECT patientID, password FROM patientData WHERE username = ?';
    db.query(loginQuery, [username], (error, results) => {
        if (error) {
            console.error("Error during login:", error);
            return res.status(500).send("Internal Server Error");
        }
        if (results.length > 0) {
            const user = results[0];
            // Here you should compare the hashed password; this example skips this step for brevity
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    req.session.patientID = user.patientID; // Store patientID in session
                    res.redirect('/dashboard.html');
                } else {
                    res.status(401).send('Invalid username or password');
                }
            });
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});



  
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
