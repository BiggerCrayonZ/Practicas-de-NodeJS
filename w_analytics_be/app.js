/* Setting Const and requires */
require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
const util = require('util');
const path = require("path");


const routes = require('./src/routes/analytics.routes');

/* App Port and Express */
let app = express();
let port = process.env.PORT || 5000;
let application_url = 'localhost';
var access_tokens = { 'userID': 'undefined', 'token': 'undefined' };

// Store the access token for your application user.
function setAccessToken(token) {
    access_tokens.userID = 'demo-user';
    access_tokens.token = token;
};

/* App Usage  */
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

/* App Listener */
app.listen(port, function (err) {
    console.log('Application running: http://' + application_url + ':' + port);
});

/* Heros Server */
app.use('/', routes);

