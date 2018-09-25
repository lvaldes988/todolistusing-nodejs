/*
    Express template
*/
var port =process.env.PORT || 7778;
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var session = require('express-session');
var flash = require('connect-flash');
var mongodb = require('./mongo-db')();
var mysqldb = require('./mysql-db');
var morgan = require('morgan');
var passport = require('passport');

require('./app/passport')(passport, mysqldb); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.set('view engine', 'ejs'); // set up ejs for templating

//purpose of this is to enable cross domain requests
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "localhost");
//   next();
// });

//purpose of this is to enable cross domain requests
// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7779');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

// required for passport
app.set('trust proxy', 1); // trust first proxy

app.use(session({
  secret: 'secretsecretsecretpaper',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use("/assets", express.static(__dirname + "/assets"));

require('./app/routes')(app, passport, mysqldb);

app.listen(port);

console.log("Server listening on port " + port);