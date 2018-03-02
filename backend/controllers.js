
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

    db.query(sql, (err, result) => {
        if (err) throw err;

        if (result.rows.length !== 0) {
            if(result.rows[0].hashed_password.e === req.body.password){
                return res.status(200).send(result.rows[0]);
            } else {
                return res.status(200).send("FAIL");
            }
        } else {
            return res.status(200).send("FAIL");
        }
    });
});

router.get('/getbookings', (req, res) => {

    let respons = [];
    
    const allPersonBookingsSQL = 'SELECT booking.booking_id, date_of_booking::date, start_time, end_time, room FROM booking INNER JOIN resources ON booking.resource_id = resources.resource_id WHERE made_by = ' + req.query.person_id + ' UNION SELECT meeting.booking_id, date_of_booking, start_time, end_time, room FROM meeting INNER JOIN booking ON meeting.booking_id = booking.booking_id INNER JOIN resources ON booking.resource_id = resources.resource_id WHERE participant = ' + req.query.person_id + ';';

    db.query(allPersonBookingsSQL, (err, bookings) => {
        for (let i = 0; i < bookings.rows.length; i++) {
            respons.push({
                booking_id: bookings.rows[i].booking_id,
                date: bookings.rows[i].date_of_booking, 
                from: bookings.rows[i].start_time,
                to: bookings.rows[i].end_time,
                room: bookings.rows[i].room
            });  
        }
        console.log(respons);
        return res.status(200).send(respons);
    });
});

router.get('/getparticipants', (req, res) => {
    const allParticipantsSQL = 'select full_name from meeting inner join people on participant = person_id where booking_id = ' + req.query.booking_id + ';';

    db.query(allParticipantsSQL, (err, participants) => {
        return res.status(200).send(participants.rows);
    });
});

router.delete('/deletebooking', (req, res) => {

    
    const deleteBookingSQL = 'DELETE FROM booking WHERE booking_id = ' + req.query.booking_id + ' AND made_by = ' + req.query.person_id + ';';
    db.query(deleteBookingSQL, (err, participants) => {
    });

    const deleteMeetingSQL = 'DELETE FROM meeting WHERE meeting.booking_id IN (SELECT booking_id FROM booking WHERE made_by = ' + req.query.person_id + ' ) AND meeting.booking_id = ' + req.query.booking_id + ';';
    db.query(deleteMeetingSQL, (err, participants) => {
    });

    return res.status(200).send("DELETED")
});

router.post('/book', (req,res) => {
    console.log(req.body.made_by);
    console.log(req.body.date);
    console.log(req.body.start_time);
    console.log(req.body.end_time);
    console.log(req.body.participants);
    console.log(req.body.resource_id);

    const getMeetingsSql = 'SELECT booking.booking_id, date_of_booking, start_time, end_time FROM booking WHERE made_by = ' + req.body.made_by + ' AND date_of_booking = \'' + req.body.date + '\' AND start_time >= \'' + req.body.start_time + ':00\' AND end_time <= \'' + req.body.end_time + ':00\' UNION SELECT meeting.booking_id, date_of_booking, start_time, end_time FROM meeting INNER JOIN booking ON meeting.booking_id = booking.booking_id WHERE participant = ' + req.body.made_by + ' AND date_of_booking = \'' + req.body.date + '\' AND start_time >= \'' + req.body.start_time + ':00\' AND end_time <= \'' + req.body.start_time + ':00\';';

    db.query(getMeetingsSql, (err, result) => {
        if (result.rows.length != 0) {
            return res.status(200).send('No booking');            
        } else {
            const bookSql = 'INSERT INTO booking (date_of_booking, start_time, end_time, resource_id, made_by) VALUES (\'' + req.body.date + '\'::date, \'' + req.body.start_time + '\', \'' + req.body.end_time + '\', ' + req.body.resource_id + ', ' + req.body.made_by + ') RETURNING booking_id;'; 

            db.query(bookSql, (err, booked) => {
                let addParticiapantsSql = 'INSERT INTO meeting VALUES ';

                if (booked != null) {
                    if (!req.body.participants.length == 0) {
                        addParticiapantsSql = addParticiapantsSql + '(' + booked.rows[0].booking_id + ', ' + req.body.participants[0] + ')';

                        for (let i = 1; i < req.body.participants.length; i++) {
                            addParticiapantsSql = addParticiapantsSql + ', (' + booked.rows[0].booking_id + ', ' + req.body.participants[i] + ')';
                        }    
                        addParticiapantsSql = addParticiapantsSql + ';';

                        console.log('Adding parts: ' + addParticiapantsSql);

                        db.query(addParticiapantsSql, (err, addedParts) => {
                            return res.status(200).send('Booking');            
                        });
                    } else {
                        return res.status(200).send('Booking');            
                    }
                } else {
                    return res.status(200).send('No booking');            
                }
            });
        }
    });
});

router.get('/getrooms', (req, res) => {
    db.query('SELECT resource_id, room, cost, facility FROM resources;', (err, result) => {
        return res.status(200).send(result.rows);
    });
});

router.get('/getpeople', (req, res) => {
    db.query('SELECT person_id, full_name FROM people;', (err, result) => {
        return res.status(200).send(result.rows);
    });
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