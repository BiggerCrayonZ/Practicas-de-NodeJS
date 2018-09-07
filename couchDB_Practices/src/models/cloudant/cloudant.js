require('dotenv').config();
const { DB_Utils } = require('./db_utils/db_utils')
let appEnv = require('cfenv').getAppEnv();
let bm_cred = appEnv.getServiceCreds(process.env.DOC_DB_SERVICE);

const cloudant_cred = {
    account: bm_cred.username,
    password: bm_cred.password
}

const crud = new DB_Utils(cloudant_cred, 'cloudant', {
    name: 'employee_services'
}).CRUD

module.exports = crud;