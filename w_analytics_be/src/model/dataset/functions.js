const axios = require('axios');
const fs = require('fs');
var https = require('https');

const constants = require('../../../constants');

/* Vars */
let WATSON_URL = constants.constants.WATSON_AMALYTICS_API_URL;
let WATSON_PATH = constants.constants.WATSON_ANALYTICS_API_BASE_PATH;
let APPLICATION_URL = constants.constants.APPLICATION_URL;
let PORT = constants.constants.PORT;

let appKey = JSON.parse(fs.readFileSync('./appkey.json', 'utf8'));
let access_token;
let redirect_url = 'http://' + APPLICATION_URL + ':' + PORT + '/oauth2/code';

class datasetFunctions {
    constructor(access_token) {
        this.access_token = access_token;
    }

    pushDatatoDataSet(name, dataset) {
        console.log("access_token: ", this.access_token);
        return new Promise((resolve, reject) => {
            try {
                let date = new Date();
                let request = 'https://' + WATSON_URL + WATSON_PATH + '/data/v1/datasets';
                let body = { name: name + date.toISOString() };
                let id_dataset_options = {
                    headers: {
                        'X-IBM-Client-Id': appKey.client_id,
                        'X-IBM-Client-Secret': appKey.client_secret,
                        'Authorization': 'Bearer ' + this.access_token,
                        'Content-Type': 'application/json'
                    },
                    data: body
                };
                console.log("request: ", request);
                console.log("body: ", body);
                console.log("id_dataset_options: ", id_dataset_options);
                axios.post(request, body, id_dataset_options).then((data) => {
                    let responseObject = data.data;
                    this.dataSetRequest(responseObject.id, dataset).then((result) => {
                        let json = {
                            responseObject: responseObject
                        }
                        resolve(json);
                    }).catch((err) => {
                        reject(err);
                    });
                    resolve(responseObject);
                })
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    dataSetRequest(dataset_id, dataset) {
        return new Promise((resolve, reject) => {
            try {
                console.log("id: ", dataset);
                let request_dataset = 'https://' + WATSON_URL + WATSON_PATH + '/data/v1/datasets/' + dataset_id + '/content';
                let body_dataset = dataset;
                let data_options = {
                    headers: {
                        'X-IBM-Client-Id': appKey.client_id,
                        'X-IBM-Client-Secret': appKey.client_secret,
                        'Authorization': 'Bearer ' + this.access_token,
                        'Content-Type': 'text/csv'
                    },
                    data: body_dataset
                };
                axios.put(request_dataset, body_dataset, data_options).then((result) => {
                    let responseString = result.data;
                    let response = {
                        responseString: responseString
                    }
                    resolve(response);
                }).catch((errRequest) => {
                    console.log("err dataSetRequest: ", errRequest);
                    reject(errRequest);
                });
            } catch (err) {
                console.log("err dataSet: ", err);
            }
        })

    };

    pushData(id, appendData) {
        return new Promise((resolve, reject) => {
            try {
                let request_dataset = 'https://' + WATSON_URL + WATSON_PATH + '/data/v1/datasets/' + id + '/content?appendData=true';
                let body_dataset = appendData;
                let data_options = {
                    headers: {
                        'X-IBM-Client-Id': appKey.client_id,
                        'X-IBM-Client-Secret': appKey.client_secret,
                        'Authorization': 'Bearer ' + this.access_token,
                        'Content-Type': 'text/csv'
                    }
                };
                axios.put(request_dataset, body_dataset, data_options).then((result) => {
                    let responseString = result.data;
                    let response = {
                        responseString: responseString
                    }
                    resolve(response);
                }).catch((errRequest) => {
                    console.log("err dataSetRequest: ", errRequest);
                    reject(errRequest);
                });
            } catch (err) {
                console.log("err dataSet: ", err);
            }
        })
    }

    //appKey Json

}
exports.datasetFunctions = datasetFunctions;