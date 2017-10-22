const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const conn = require('./dbconnect');

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


app.post('/login', function (req, res) {
    // Check for correct credentials
    email = req.body.email;
    password = req.body.psw;
    var query = "SELECT password from users where email = ?";
    conn.query(query, [email], function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result = []) res.redirect('/');
    });
});

app.listen(3000, function (err) {
    if (err) throw err;
    console.log("Magic happens on port 3000...");
});
