const employee_routes = require('express').Router();
const getEmployeeByJob = require('../models/cloudant/functions');
const axios = require('axios');
const url = 'https://randomuser.me/api/';

employee_routes.route('/getEmployeesByJob').post((req, res) => {
    getEmployeeByJob.getEmployeeByJob(req.body.job).then(employees => {
        res.status(200).send({ status: "Done", data: employees });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    })

})

employee_routes.route('/createEmployees').post(async (req, res) => {
    // console.log("createEmployees");
    var i;
    let userBulk = [];
    for (i = 0; i < 5; i++) {
        await axios.get(url).then((item) => {
            // console.log(item.data.results[0]);
            let name = item.data.results[0].name.first + " " + item.data.results[0].name.last
            let email = item.data.results[0].email
            let address = {
                street: item.data.results[0].location.street,
                city: item.data.results[0].location.city,
                state: item.data.results[0].location.state
            }
            let skills = ["SQL", "JSON", "React"];
            let user = {
                department: i,
                name: name,
                email: email,
                job: "PM",
                address: address,
                skills: skills
            }
            userBulk.push(user);
        })

    }
    // console.log(userBulk);
    res.status(200).send(userBulk);

})

module.exports = employee_routes;