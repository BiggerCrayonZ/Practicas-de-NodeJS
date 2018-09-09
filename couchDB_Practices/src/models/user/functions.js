const axios = require('axios');
const db = require('../cloudant/cloudant');
const url = 'https://randomuser.me/api/';


class EmployeeFunctions {

    constructor() { }

    saveEmployee(employee) {
        return new Promise((reject, resolve) => {
            try {
                response = db.create(employee);
                console.log("response: ", response);
            } catch (err) {
                reject(err);
            }
            resolve(response);
        })
    }

    createSingleEmployee() {
        console.log("---------------- createSingleEmployee ------------------");
        return new Promise(async (resolve, reject) => {
            try {
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
                        department: "01",
                        name: name,
                        email: email,
                        job: "PM",
                        address: address,
                        skills: skills
                    }
                    this.saveEmployee(user).then(response => {
                        resolve(user);
                    }).catch(err => {
                        reject(err);
                    })
                })

            } catch (err) {
                reject(err);
            }
        })
    }

    /**
  * Number of employees to create
  * @param {string} total
  */
    createEmployees(total = 1) {
        console.log("---------------- createEmployees ------------------");
        return new Promise(async (resolve, reject) => {
            if (total) {
                let userGroup = [];
                try {
                    var i;
                    for (i = 1; i <= total; i++) {
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
                            userGroup.push(user);
                        })
                    }
                    resolve(userGroup);
                } catch (err) {
                    reject(err);
                }
            }
        })
    }

}

exports.EmployeeFunctions = EmployeeFunctions;