const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const conn = require('./dbconnect');
const url = require('url');

var app = express();

app.engine('hbs', hbs({extname: 'hbs', layoutsDir: __dirname + '/views'}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/signup', function (req, res) {
    res.render('signup');
});

app.get('/home', function (req, res) {
    var query = "SELECT * from packages;";
    conn.query(query, function (err, results, fields) {
        if (err) throw err;
        var packages = [];
        for (var i = 0; i < results.length; i++) {
            packages.push({
                pname: results[i].pname,
                description: results[i].description,
                pid: results[i].pid,
                price: results[i].price
            });
        }
        res.render('home', {username: req.query.username, packages: packages});
    });
});

app.post('/feedback/:username', function (req, res) {
    var feedback = req.body.feedback;
    var username = req.params.username;
    var query = "INSERT INTO feedbacks SET ?";
    conn.query(query, {username: username, feedback: feedback}, function (err, result) {
        if (err) throw err;
        res.redirect(url.format({
            pathname: "/home",
            query: {
                "username": username
            }
        }));
    });

});

app.post('/login', function (req, res) {
    // Check for correct credentials
    email = req.body.email;
    password = req.body.psw;
    var query = "SELECT password, username from users where email = ?";
    conn.query(query, [email], function (err, result) {
        if (err) throw err;
        if (password === result[0].password) res.redirect(url.format({
            pathname: "/home",
            query: {
                "username": result[0].username
            }
        }));
        else res.redirect('/login');
    });
});

app.post('/signup', function (req, res) {
    user = req.body;
    var insert = 'INSERT INTO users SET ?';
    conn.query(insert, {fname: user.fname, lname: user.lname, username: user.uname, email: user.email, password: user.psw}, function (err, result) {
        res.redirect('/login');
    });
});

app.get('/book/:id', function (req, res) {
    res.render('booking', {id: req.params.id});

});

app.post('/:id/payment', function (req, res) {
    res.render('payment_processing');
    var usernameQuery = "SELECT username, fname from users WHERE email = '" + req.body.email + "';";
    conn.query(usernameQuery, function (err, results, fields) {
        var booking = "INSERT INTO bookings SET ?";
        conn.query(booking, {bid: null, username: results[0].username, pid: req.params.id, bdate: new Date().toLocaleDateString(), price: req.body.amount}, function (err, result) {
            if (err) throw err;
        });
    });
});

app.listen(3000, function (err) {
    if (err) throw err;
    console.log("Magic happens on port 3000...");
});
