var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Vinter2018',
  database : 'lab2'
});
 
connection.connect();

module.exports = connection;