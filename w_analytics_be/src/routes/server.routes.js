/* Requires */
const routes = require('express').Router();
const qsutil = require('querystring');
const fs = require('fs');
const urlutil = require('url');
const https = require('https');
let watson_analytics_api_url = 'api.ibm.com';
let watson_analytics_api_base_path = '/watsonanalytics/run';

let application_url = 'localhost';

let port = process.env.PORT || 5000;
let redirect_url = 'http://' + application_url + ':' + port + '/demo/oauth2/code';
let yourAppKey = {
    enabled: true,
    ownerName: "Raul Reza",
    accessTokenLifeTime: 3600,
    grantType: "authorization_code client_credentials password",
    partnerId: "057S89N71WERO2",
    redirectURIs: "https://localhost:5000",
    tokenRefreshCount: 0,
    ownerCompany: "IBM",
    clientId: "fd2d4a41-8266-408a-a600-9ea30ebb96b5",
    client_secret: "qA0oH1lM2fM3uN5iC8cY8yI1dD5lP6eS7aV8cF6eL3xH6tP7tL",
    source: "APIm",
    clientName: "demo01",
    refreshTokenLifeTime: 3600,
    allowedScopes: "userContext partnerProfile storyBooks_r storyBooks_c storyBooks_w audit_r",
    ownerPhone: "3331589068",
    ownerEmail: "raul.reza@ibm.com"
};

var access_tokens = { 'userID': 'undefined', 'token': 'undefined' };

// Store the access token for your application user.
function setAccessToken (token) {
    access_tokens.userID = 'demo-user';
    access_tokens.token = token;
};
//Test request
routes.route('/test').get((req, res) => {
    res.status(200).send({ status: "Done" });
})

// Build the request to get an OAuth2 authorization code.
// The server builds the request here, but the browser must make the request.
routes.route('/demo/oauth2/auth').get((req, res) => {
    let locationURI = 'https://' + watson_analytics_api_url + watson_analytics_api_base_path +
        '/clientauth/v1/auth?' +
        qsutil.stringify({
            'response_type': 'code',
            'client_id': yourAppKey.clientId,
            'scope': 'userContext',
            'state': 'xyz',
            'redirect_uri': redirect_url
        });
    console.log("locationURI: " + locationURI);
    res.writeHead(302, {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Location': locationURI
    });
    res.end();
});


// Watson Analytics returns the authorization code by adding it to the redirect URL.
// The browser received HTTP 302 + location. The location is the redirect URL
// Trade the authorization code for an OAuth2 access token.
routes.route('/demo/oauth2/code').get((req, res) => {
    var url = urlutil.parse(req.url, true);
    var token_server_options = {
        'hostname': watson_analytics_api_url,
        'path': watson_analytics_api_base_path + '/oauth2/v1/token',
        'method': 'POST',
        'headers': {
            'X-IBM-Client-Id': yourAppKey.clientId,
            'X-IBM-Client-Secret': yourAppKey.client_secret,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log("token_server_options: ", token_server_options);
    var waReq = https.request(token_server_options, function (waRes) {
        var responseString = '';
        waRes.on('data', function (data) { responseString += data; });
        waRes.on('end', function () {
            var responseObject = JSON.parse(responseString);
            console.log("responseObject: " + responseObject);
            setAccessToken(responseObject.access_token);
            var apiLocationURI = 'http://' + application_url + ':' + port + '/integration.html';
            res.writeHead(302, {
                'Content-Type': 'text/html',
                'Location': apiLocationURI
            });
            res.end();
        });
    });
    var body = qsutil.stringify({
        'grant_type': 'authorization_code',
        'code': url.query.code,
        'redirect_uri': redirect_url
    });
    console.log(body);
    waReq.write(body);
    waReq.end();
});

routes.route('/demo/me').get((req, res) => {
    var resource_server_options = {
        'hostname': watson_analytics_api_url,
        'path': watson_analytics_api_base_path + '/accounts/v1/me',
        'method': 'GET',
        'headers': {
            'X-IBM-Client-Id': yourAppKey.client_id,
            'X-IBM-Client-Secret': yourAppKey.client_secret,
            'Authorization': 'Bearer ' + access_tokens.token
        }
    };
    var waReq = https.get(resource_server_options, function (waRes) {
        var responseString = '';
        waRes.on('data', function (data) { responseString += data; });
        waRes.on('end', function () {
            var responseObject = JSON.parse(responseString);
            res.end(JSON.stringify(responseObject));
        });
    });
    waReq.end();
});

routes.route('/demo/upload').get((req, res) => {
    var request_options = {
        'hostname': watson_analytics_api_url,
        'path': watson_analytics_api_base_path + '/data/v1/datasets',
        'method': 'POST',
        'headers': {
            'X-IBM-Client-Id': yourAppKey.client_id,
            'X-IBM-Client-Secret': yourAppKey.client_secret,
            'Authorization': 'Bearer ' + access_tokens.token,
            'Content-Type': 'application/json'
        }
    };
    var waReq = https.request(request_options, function (waRes) {
        var responseString = '';
        waRes.on('data', function (data) { responseString += data; });
        waRes.on('end', function () {
            var responseObject = JSON.parse(responseString);
            pushDataToDataSet(responseObject.id, res);
        });
    });
    var date = new Date();
    var body = { name: 'YourApplication_' + date.toISOString() };
    waReq.write(JSON.stringify(body));
    waReq.end();
});

// Create a new empty data set that has a specified name.
function pushDataToDataSet(id, res) {
    var request_options = {
        'hostname': watson_analytics_api_url,
        'path': watson_analytics_api_base_path + '/data/v1/datasets/' + id + '/content',
        'method': 'PUT',
        'headers': {
            'X-IBM-Client-Id': yourAppKey.client_id,
            'X-IBM-Client-Secret': yourAppKey.client_secret,
            'Authorization': 'Bearer ' + access_tokens.token,
            'Content-Type': 'text/csv'
        }
    };
    var waReq = https.request(request_options, function (waRes) {
        var responseString = '';
        waRes.on('data', function (data) { responseString += data; });
        waRes.on('end', function () {
            var apiLocationURI = 'https://watson.analytics.ibmcloud.com';
            res.writeHead(302, {
                'Content-Type': 'text/html',
                'Location': apiLocationURI
            });
            res.end();
        });
    });
    var body = 'c1, c2\n';
    body += 'r1, r1\n';
    body += 'r2, r2\n';
    waReq.write(body);
    waReq.end();
}

/* Export */
module.exports = routes;