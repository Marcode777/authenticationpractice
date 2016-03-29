// Create an express / handlebars / node.js / mysql app with 3 views
// Register - don't let someone with the same email register twice
// The registration should have a first name and last name
// Login
// Secret Page
// On the secret page, display the first and last name of the user
// Only an authenticated user can see the secret page (remember sessions and middleware?)

var express = require("express");
var mysql = require("mysql");
var expressHandleBars= require("express-handlebars");
var bodyParser = require("body-parser");

var connection = mysql.createConnection({
  port: 6700,
  host:"localhost",
  user: "root",
  database: "rcb_authentication_db"
});

var PORT = process.env.NODE_ENV || 3000;

var app = express();

app.engine("handlebars", expressHandleBars({
 defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
  extended:false
}));

//for connection
app.get("/", function(req, res){
  res.render("home");
});

app.post("/register", function(req, res){
  var email = req.body.email;
  var firstname = req.body.firsname;
  var lastname = req.body.lastname;
  var password = req.body.password;
  var checkQuery = "SELECT * FROM users WHERE email=" + connection.escape(email);
  var insertQuery = "INSERT INTO users (email, firstname, lastname, password) VALUES (?, ?, ?, ?)";

  connection.query(checkQuery, function(err, results){
    if(err) {
      throw err;
    }
//this next line of code checks for whether the user or email already exists, because if it did not exist, then it would be empty, however, if they did exist, then it would not be empty and the length would be greater than zero
    if(results.length>0){
      res.redirect("/?msg=Already exists");
    } else {
      connection.query(insertQuery, [email, firstname, lastname, password], function(err){
        if (err){
          throw err;
        }
        res.redirect("/success");
      });
    }
  });
});

app.get("/success", function(req, res){
  res.send("YOU ARE REGISTERED!")
});

app.listen(PORT, function(){
  console.log("LISTENING ON" + PORT);
}); 