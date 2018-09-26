const axios = require('axios');
const fs = require('fs');

const constants = require('../../../constants');

/* Vars */
let WATSON_URL = constants.constants.WATSON_AMALYTICS_API_URL;
let WATSON_PATH = constants.constants.WATSON_ANALYTICS_API_BASE_PATH;
let APPLICATION_URL = constants.constants.APPLICATION_URL;
let PORT = constants.constants.PORT;

let appKey = JSON.parse(fs.readFileSync('./appkey.json', 'utf8'));
let access_token = JSON.parse(fs.readFileSync('./tokens/token.json', 'utf8'));
let redirect_url = 'http://' + APPLICATION_URL + ':' + PORT + '/oauth2/code';

class datasetFunctions {
    constructor() { }

    pushDatatoDataSet(name, dataset) {
        return new Promise((resolve, reject) => {
            let date = new Date();
            let request = 'https://' + WATSON_URL + WATSON_PATH + '/data/v1/datasets';
            let body = { name: name + date.toISOString() };
            let id_dataset_options = {
                headers: {
                    'X-IBM-Client-Id': appKey.client_id,
                    'X-IBM-Client-Secret': appKey.client_secret,
                    'Authorization': 'Bearer ' + access_token.token,
                    'Content-Type': 'application/json'
                },
                data: body
            };
            //axios
        });
    }
}