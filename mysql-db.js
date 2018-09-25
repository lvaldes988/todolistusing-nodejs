/*
*************MySQL Connection stuff******************
*/

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'open',
  database: 'todo'
});

connection.connect();

module.exports = connection;

// connection.end();