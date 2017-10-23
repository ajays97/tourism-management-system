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
    console.log(req.query.username);
    res.render('home', {username: req.query.username});
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
        if (err) throw err;
        console.log(result);
    });
});

app.listen(3000, function (err) {
    if (err) throw err;
    console.log("Magic happens on port 3000...");
});
