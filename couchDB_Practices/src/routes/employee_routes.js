const employee_routes = require('express').Router();
const getEmployeeByJob = require('../models/cloudant/functions');

employee_routes.route('/getEmployeesByJob').post((req, res) => {
    getEmployeeByJob.getEmployeeByJob(req.body.job).then(employees => {
        res.status(200).send({ status: "Done", data: employees });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    })

})

module.exports = employee_routes;