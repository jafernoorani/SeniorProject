// const http = require('http');
const express = require('express');
const mysql = require('mysql');
const app = express()
const path = require('path');
const bodyParser  = require('body-parser');
var events = require('events');
app.use(express.json()); // accept data in json format
app.use(express.urlencoded()); // decode data send thru html form

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.send('Hello TecAdmin - Megan and Andy\n');
});

app.get("/clickme", function(req,res) {
  res.sendFile(path.join(__dirname+'/boottest.html'));
});

app.get("/dashboard", function(req, res) {
  res.sendFile(path.join(__dirname+'/dashboard.html'));
});


// create connection to the DB server
let connection = mysql.createConnection({
        host: JAFER PUT IP HERE,
        port: JAFER PUT PORT HERE,
        user: JAFER PUT USER HERE,
        password: yeah,
        database: SugarDaddy,
});

app.get("/connect", (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  // connect to the DB server
  connection.connect((err) => {
        if (err) {
                res.send(err); 
                return console.error(err.message);
        }

        console.log('Connected to the MariaDB server.');

        connection.query("SELECT * FROM vitalData WHERE patientID=1", (err, results) => {
                if (err) {
                      res.send(err);
                      console.error("Error querying the database: ", err)
                        return
                }
                console.log("Query results: ", results);
                res.send(results);
        })
  });
});

app.post("/data", function(req, res) {
  console.log(req.body);
  var fullName = req.body.fullname;
  var emailAddr = req.body.email;
  var userName = req.body.username;
  var pass = req.body.password;
  connection.query("INSERT INTO patientData (fullName, emailAddress, userName, password) VALUES (?, ?, ?, ?)", [fullName, emailAddr, userName, pass], function(err, results){
          if(err) {
               res.send(err);
               console.error("Error inserting to the database: ", err)
                  return
          }
          console.log("Insert results: ", results);
          res.send(results);
          return
          //res.redirect("http://54.226.103.123/dashboard.html");
          //res.redirect(path.join(__dirname+'/dashboard.html'));
  })

});
