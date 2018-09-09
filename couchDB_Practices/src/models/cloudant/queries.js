module.exports.queries = {
    /**
   * Returns a selector for cloudant queries
   * @param {string} job
   */
    "getEmployeeByJob": function (job) {
        return {
            "selector": {
                "job": {
                    "$eq": job
                }
            },
            "fields": [
                "email",
                "name",
                "department",
                "skills"
            ],
            "sort": [
                {
                    "department": "asc"
                }
            ]
        }
    }
}