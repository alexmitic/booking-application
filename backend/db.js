var mysql      = require('mysql');
var pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : 'batman',
        database : 'booking',
        debug    : false
});

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'batman',
//   database : 'booking'
// });
 
// connection.connect();

module.exports = pool;