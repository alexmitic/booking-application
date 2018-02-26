// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./db'); 

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const argon2 = require('argon2');

 

router.get('/', (req, res) => {
    return res.status(200).send("Testetsetstestsetestset");
});

router.get('/login', (req, res) => {
    var sql = "select full_name,hashed_password from people where email='".concat(req.query.email).concat("';")
    console.log(sql);
    db.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.length);
        argon2.verify(result[0].hashed_password,req.query.password).then (match => {
            if(match){
                console.log("authenticated");
                return res.status(200).send("SUCC");
            } else {
                return res.status(200).send("FAIL");
            }
        });
    });
});

router.get('/book', (req,res) => {
    //first create booking
    var bookingSql = "insert into booking  (start_time, end_time) values ('"
    .concat(req.query.start_date).concat("','").concat(req.query.end_date).concat("');");
    var bookingId = null;
    db.query(bookingSql, function(err, result) {
        if(err) throw err;
        bookingId = result.insertId;
    });

    //front end gives resource id.
    var resourceId = req.query.resource_id;
    //for each people_id 
    var people = req.query.people;
    for(i = 0; i<people.length; i++) {
        var meetingSql = "insert into meeting (made_by, booking_id, resource_id, participant) values ("
        +req.query.made_by+","+bookingId+","+resourceId+","+people[i]+");";
        db.query(meetingSql, function(err, result) {
            if(err) throw err;
            console.log("added: " + people[i] + " to meeting.");
        });
    }   
});

router.get('/penis', (req, res) => {
    argon2.hash('password').then(hash => {
        var sql1 = "insert into people (person_id, full_name, email, hashed_password) values (1, 'oskar', 'email','";
        var sql2 = "');"
        console.log(hash);
        hash = hash.concat(sql2);
        sql1 = sql1.concat(hash);
        console.log(sql1); 
        db.query(sql1, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
      }).catch(err => {
        console.log("failed life")
      });
    return res.status(200).send("Testetsetstestsetestset");
});

module.exports = router;