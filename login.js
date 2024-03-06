// creating connection to database
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Seniorproject1!",
    database: "logins"
});

con.connect(function(err) {
    if(err) throw err;
    console.log("Connected!");
    // var sql = "CREATE TABLE userLogins (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)";
    var sql = "INSERT INTO userLogins (username, password) VALUES('test2', 'pwd1'),('test3', 'pwd2'),('test4', 'pwd3')";
    con.query(sql, function(err,result) {
        if(err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
});


// login.js
function togglePassword() {
    var passwordInput = document.getElementById('password');
    var toggleCheckbox = document.getElementById('show-password');
    if (toggleCheckbox.checked) {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

document.getElementById('loginForm').addEventListener('submit', function(event){
    event.preventDefault(); // Prevent form submission and page reload

    var username = document.getElementById('email').value; // Changed from 'username' to 'email' to match your input ID
    var password = document.getElementById('password').value;

    // Add your login logic here
    if (username === "user" && password === "pass") {
        alert("Login successful!");
        // Redirect to another page or do other actions
    } else {
        alert("Login failed! Incorrect username or password.");
    }
});
