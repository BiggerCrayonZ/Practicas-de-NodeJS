require('dotenv').config();
const { DB_Utils } = require('../cloudant/db_utils/db_utils')
let appEnv = require('cfenv').getAppEnv();
let bm_cred = appEnv.getServiceCreds(process.env.DOC_DB_SERVICE);

const cloudant_cred = {
    account: bm_cred.username,
    password: bm_cred.password
}

const crud = new DB_Utils(cloudant_cred, 'cloudant', {
    name: 'heroes'
}).CRUD

module.exports = crud;