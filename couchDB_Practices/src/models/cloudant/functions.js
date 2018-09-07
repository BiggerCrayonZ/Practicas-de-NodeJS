const db = require('./cloudant');
const { queries } = require('./queries');

function getEmployeeByJob(job) {
    console.log("---------------- getEmployeeByJob ------------------");
    return new Promise((resolve, reject) => {
        if (job) {
            try {
                response = db.query(queries.getEmployeeByJob(job));
            } catch (err) {
                reject({err});
            }
            resolve(response);
        }
    })
}

module.exports = {
    getEmployeeByJob: getEmployeeByJob
}