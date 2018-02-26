// app.js
var express = require('express');
var app = express();
var db = require('./db'); 

var Controllers = require('./controllers');
app.use('/', Controllers);

db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

module.exports = app;