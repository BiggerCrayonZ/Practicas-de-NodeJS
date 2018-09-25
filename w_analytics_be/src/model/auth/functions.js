const qsutil = require('querystring');
const axios = require('axios');
const fs = require('fs');

class authFunctions {
    constructor() { }
    buildOAuthRequest(watson_url, watson_path, clientId, redirect_url) {
        return new Promise((resolve, reject) => {
            let locationURI = '';
            try {
                console.log("object")
                locationURI = 'https://' + watson_url + watson_path +
                    '/clientauth/v1/auth?' +
                    qsutil.stringify({
                        'response_type': 'code',
                        'client_id': clientId,
                        'scope': 'userContext',
                        'state': 'xyz',
                        'redirect_uri': redirect_url
                    });
                console.log("locationURI: ", locationURI);
            } catch (err) {
                reject(err);
            }
            resolve(locationURI);
        });
    }

    authCode(url, watson_url, watson_path, client_id, client_secret, redirect_url) {
        return new Promise((resolve, reject) => {

            let body = qsutil.stringify({
                'grant_type': 'authorization_code',
                'code': url.query.code,
                'redirect_uri': redirect_url
            });
            let token_serve_options = {
                headers: {
                    'X-IBM-Client-Id': client_id,
                    'X-IBM-Client-Secret': client_secret,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: body
            };
            let request = 'https://' + watson_url + watson_path + '/oauth2/v1/token';
            axios.post(request, body, token_serve_options).then((data) => {
                // console.log("FINAL JSON: ");
                // console.dir(data.data, { depth: null })
                let file = JSON.stringify(data.data);
                fs.writeFileSync('tokens/token.json', file);
                resolve(data.data);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
}

exports.authFunctions = authFunctions;