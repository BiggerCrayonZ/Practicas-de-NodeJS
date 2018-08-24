const Router = require('express').Router();
const csv = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;
const fieldsCVS = ['Intent', 'Entity', 'Question'];
const json2csvParser = new Json2csvParser({ fieldsCVS });
var fs = require('fs');

//Paths
const csvFilePath1 = './uploads/uploadIntent.csv';
const csvFilePath2 = './uploads/uploadEntity.csv';

//Functions
createJson = async (path) => {
    return new Promise((resolve, reject) => {
        try {
            csv()
                .fromFile(path).then((jsonObj) => {
                    // console.log("jsonObj: ", jsonObj);
                    resolve(jsonObj);
                })
        } catch (err) {
            console.log("err: ", err);
            reject(err);
        }
    })
}

createMap = async (Intents, Entities) => {
    return new Promise(async (resolve, reject) => {
        let res = [];
        try {
            await Intents.map(async (itemIntent) => {
                await Entities.map(async (itemEntity) => {
                    let item = {
                        Intent: itemIntent.Intent
                    }
                    item.Entity = itemEntity.Entity;
                    item.Question = itemIntent.Value + " " + itemEntity.Value;
                    await res.push(item);
                })
            })
        } catch (err) {
            console.log("createMapErr: ", err);
        }
        await resolve(res);
    })
}

createCSV = async (json) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (json.length !== 0) {
                const csv = json2csvParser.parse(json);
                console.log("CSV: ", csv);
                resolve(csv);
            } else {
                resolve({})
            }
        } catch (err) {
            console.log("createCSVErr: ", err);
            reject(err);
        }
    })
}

safeFile = async (csv) => {
    return new Promise(async (resolve, reject) => {
        try {
            fs.writeFile("res.csv", csv, (err) => {
                if (err) {
                    console.log("safeFileErr: ", err);
                    reject(err);
                } else {
                    console.log("File Saved");
                    resolve("ok");
                }
            })
        } catch (err) {
            console.log("safeFileErr: ", err);
            reject(err);
        }
    })
}

//Routes
Router.get('/', async (req, res) => {
    createJson(csvFilePath1).then((jsonObj1) => {
        // res.send(jsonObj1);
        createJson(csvFilePath2).then(async (jsonObj2) => {
            await createMap(jsonObj1, jsonObj2).then((jsonRes) => {
                createCSV(jsonRes).then((csvRes) => {
                    safeFile(csvRes).then((message) => {
                        res.send(message);
                    })
                })
            })
        }).catch((err2) => {
            res.send(err2);
        })
    }).catch((err1) => {
        res.send(err1);
    })
})

module.exports = Router;