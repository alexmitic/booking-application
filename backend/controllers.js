// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./db'); 
const argon2 = require('argon2');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
    return res.status(200).send("Testetsetstestsetestset");
});

router.get('/login', (req, res) => {
    var sql = "select full_name, hashed_password, person_id from people where email='".concat(req.query.email).concat("';")
    db.getConnection((err, con) => {
        con.query(sql, function (err, result) {
            if (err) throw err;

            if (result.length !== 0) {
                argon2.verify(result[0].hashed_password,req.query.password).then (match => {
                    con.release()
                    if(match){
                        return res.status(200).send(result[0]);
                    } else {
                        return res.status(200).send("FAIL");
                    }
                });
            } else {
                return res.status(200).send("FAIL");
            }
        });
    });
});

router.get('/getbookings', (req, res) => {
    let respons = [];
    db.getConnection((err, connction) => {
        const allPersonBookingsSQL = 'SELECT booking.booking_id, date_of_booking, start_time, end_time, room FROM booking INNER JOIN resources ON booking.resource_id = resources.resource_id WHERE made_by = ' + req.query.person_id + ' UNION SELECT meeting.booking_id, date_of_booking, start_time, end_time, room FROM meeting INNER JOIN booking ON meeting.booking_id = booking.booking_id INNER JOIN resources ON booking.resource_id = resources.resource_id WHERE participant = ' + req.query.person_id + ';';

        connction.query(allPersonBookingsSQL, (err, bookings) => {
            for (let i = 0; i < bookings.length; i++) {
                respons.push({
                    booking_id: bookings[i].booking_id,
                    date: bookings[i].date_of_booking, 
                    from: bookings[i].start_time,
                    to: bookings[i].end_time,
                    room: bookings[i].room
                });  
            }
            connction.release()
            return res.status(200).send(respons);
        });
    });
});

router.get('/getparticipants', (req, res) => {
    db.getConnection((err, connction) => {
        const allParticipantsSQL = 'select full_name from meeting inner join people on participant = person_id where booking_id = ' + req.query.booking_id + ';';

        connction.query(allParticipantsSQL, (err, participants) => {
            connction.release()
            return res.status(200).send(participants);
        });
    });
});

router.delete('/deletebooking', (req, res) => {

    console.log('Im here');

    db.getConnection((err, connction) => {
        const deleteBookingSQL = 'DELETE FROM booking WHERE booking_id = ' + req.query.booking_id + ' AND made_by = ' + req.query.person_id + ';';
        connction.query(deleteBookingSQL, (err, participants) => {
            connction.release()
        });
    });

    db.getConnection((err, connction) => {
        const deleteBookingSQL = 'DELETE FROM meeting WHERE meeting.booking_id IN (SELECT booking_id FROM booking WHERE made_by = ' + req.query.person_id + ' ) AND meeting.booking_id = ' + req.query.booking_id + ';';
        connction.query(deleteBookingSQL, (err, participants) => {
            connction.release()
        });
    });

    return res.status(200).send("DELETED")
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
        var sql1 = "insert into people (person_id, full_name, email, hashed_password) values (7, 'Peter Svensson', 'peter@kth.se','";
        var sql2 = "');"
        console.log(hash);
        hash = hash.concat(sql2);
        sql1 = sql1.concat(hash);
        console.log(sql1); 

        db.getConnection((err, connction) => {
            connction.query(sql1, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });
      }).catch(err => {
        console.log("failed life")
      });
    return res.status(200).send("Testetsetstestsetestset");
});

module.exports = router;