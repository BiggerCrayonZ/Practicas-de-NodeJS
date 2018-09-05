require('dotenv').load();
const express = require('express');
let app = express();

let port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("X-Content-Type-Options: nosniff");
    res.header("X-Frame-Options: deny");
    res.header("Content-Security-Policy: default-src 'none'");
    res.header('content-type', 'text/javascript');
    next();
});

