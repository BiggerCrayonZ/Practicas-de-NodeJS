/* Requires */
const routes = require('express').Router();
const getEmployeeByJob = require('../models/cloudant/functions');
const { EmployeeFunctions } = require('../models/user/functions');

/* Objects */
const employee = new EmployeeFunctions;

/* Routes */
routes.route('/employee/getEmployeesByJob').post((req, res) => {
    getEmployeeByJob.getEmployeeByJob(req.body.job).then(employees => {
        res.status(200).send({ status: "Done", data: employees });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    })
});

routes.route('/employee/createSingleEmployee').post((req, res) => {
    employee.createSingleEmployee().then(user => {
        res.status(200).send({ status: "Done", data: user });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    })
})

routes.route('/employee/createEmployeesGroup').post((req, res) => {
    employee.createEmployees(req.body.total).then(employeeGroup => {
        res.status(200).send({ status: "Done", data: employeeGroup });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    })
})

/* Delete */
routes.route('/employee/deleteEmployee').post((req, res) => {
    employee.deleteEmployee(req.body.id).then(response => {
        res.status(200).send({ status: "Done" });
    }).catch(err => {
        res.status(400).send({ status: "Fail"});
    })
})

module.exports = routes;