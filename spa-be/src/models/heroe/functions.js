const db = require('./setup');
const { queries } = require('./queries');

class Functions {
    constructor() { }

    getHero(hero) {
        return new Promise((resolve, reject) => {
            let response;
            try {
                response = db.read(hero);
            } catch (err) {
                reject(err);
            }
            resolve(response);
        })
    }

    findHero(term) {
        console.log("findHero");
        return new Promise((resolve, reject) => {
            let response;
            try {
                response = db.query(queries.findHeroes(term));
            } catch (err) {
                reject(err);
            }
            resolve(response);
        })
    }

    getAllHeros() {
        return new Promise((resolve, reject) => {
            let response;
            try {
                response = db.read();
            } catch (err) {
                reject(err);
            }
            resolve(response);
        })
    }

    getHerosByHouse(house) {
        return new Promise((resolve, reject) => {
            let response;
            try {
                response = db.query(queries.getHeroesByCasa(house));
            } catch (err) {
                reject(err);
            }
            resolve(response);
        })
    }

}

exports.Functions = Functions;