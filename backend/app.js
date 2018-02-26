// app.js
var express = require('express');
var app = express();
var cors = require('cors');

app.use(cors());

var Controllers = require('./controllers');
app.use('/', Controllers); 

module.exports = app;