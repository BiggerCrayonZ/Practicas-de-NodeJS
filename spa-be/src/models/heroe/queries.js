module.exports.queries = {
    /**
   * Returns a selector for cloudant queries
   * @param {string} casa
   */
    "getHeroesByCasa": function (casa) {
        return {
            "selector": {
                "casa": {
                    "$eq": casa
                }
            },
            "fields": [
                "_id",
                "nombre",
                "bio",
                "img",
                "aparicion",
                "casa"
            ],
            "sort": [
                {
                    "nombre": "asc"
                }
            ]
        }
    },
    /**
   * Returns a selector for cloudant queries
   * @param {string} term
   */
    "findHeroes": function (term) {
        return {
            "selector": {
                "$text": term
            },
            "use_index": "filter_by_name"
        }
    }
}