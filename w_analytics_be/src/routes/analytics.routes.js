/* Requires and imports*/
const constants = require('../../constants');
const fs = require('fs');
var opn = require('opn');
const urlutil = require('url');
const csv = require("fast-csv");

const routes = require('express').Router();
const { authFunctions } = require('../model/auth/functions');
const { datasetFunctions } = require('../model/dataset/functions');

/* Functions */
let auth = new authFunctions;


/* Vars */
let WATSON_URL = constants.constants.WATSON_AMALYTICS_API_URL;
let WATSON_PATH = constants.constants.WATSON_ANALYTICS_API_BASE_PATH;
let APPLICATION_URL = constants.constants.APPLICATION_URL;
let PORT = constants.constants.PORT;

let access_tokens = {
    userID: 'undefined',
    token: 'undefined'
}

let access_token;


if (evaluateToken()) {
    access_token = JSON.parse(fs.readFileSync('./tokens/token.json', 'utf8'));
} else {
    access_token = undefined;
}

let dataset = new datasetFunctions(access_token.access_token);

let appKey = JSON.parse(fs.readFileSync('./appkey.json', 'utf8'));
let redirect_url = 'http://' + APPLICATION_URL + ':' + PORT + '/oauth2/code';

/* Routes */

routes.route('/oauth2/auth').get((req, res) => {
    auth.buildOAuthRequest(WATSON_URL, WATSON_PATH, appKey.client_id, redirect_url).then((locationURI) => {
        console.log(locationURI);
        opn(locationURI, { app: 'firefox' });
        res.status(200).send({ uri: locationURI });
    }).catch((err) => {
        res.status(400).send(err);
    })
});

routes.route('/oauth2/code').get((req, res) => {
    let url = urlutil.parse(req.url, true);
    auth.authCode(url, WATSON_URL, WATSON_PATH, appKey.client_id, appKey.client_secret, redirect_url).then((result) => {
        setAccessToken(result.access_token);
        console.log("access_tokens: ", result.access_token);
        res.status(200).send({ token: result.access_tokens });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

routes.route('/dataset/empty').post((req, res) => {
    var body = 'c1, c2\n';
    body += 'r1, r1\n';
    body += 'r3, r3\n';
    dataset.pushDatatoDataSet('30 dataset', body).then((responseObject) => {
        res.status(200).send(responseObject);
    }).catch((err) => {
        res.status(400).send(err);
    })

});

routes.route('/dataset/upload').post((req, res) => {
    let id = req.body.id;
    var body = 'c1, c2\n';
    body += 'r1, r1\n';
    body += 'r2, r2\n';
    dataset.pushData(id, body).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

routes.route('/dataset/output/:id').get((req, res) => {
    
});

routes.route('/dataset/delete/:id').get((req, res) => {

});

//Test route
routes.route('/test').get((req, res) => {
    res.status(200).send({ status: "Done" });
})

/* Local Functions */
// Store the access token for your application user.
function setAccessToken(token) {
    access_tokens.userID = 'demo-user';
    access_tokens.token = token;
};

function evaluateToken() {
    if (fs.existsSync('../../tokens/token.json')) {
        console.log("--- false")
        return false;
    } else {
        console.log("--- true")
        return true;
    }
}

/* Export */
module.exports = routes;