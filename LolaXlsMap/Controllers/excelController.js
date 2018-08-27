const Router = require('express').Router();
const csv = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;
const fieldsCVS = ['Intent', 'Entity', 'Question'];
const json2csvParser = new Json2csvParser({ fieldsCVS });
var fs = require('fs');
const axios = require('axios');

//Paths
const csvFilePath1 = './uploads/uploadIntent.csv';
const csvFilePath2 = './uploads/uploadEntity.csv';

const POST_MESSAGE = process.env.CONVERSATION_URL;


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
                    //axios

                    item.Question = itemIntent.Value + " " + itemEntity.Value;
                    await res.push(item);
                })
            })
        } catch (err) {
            console.log("createMapErr: ", err);
        }
        resolve(res);
    })
}

executeRequest = (question) => {
    return new Promise((resolve, reject) => {
        let config = {
            headers: {
                "Content-Type": "application/json",
                "X-IBM-Client-Id": "37f5a536-9be2-4405-b663-3b1fb23f26d3"
            },
            json: true
        }
        let context = {
            "conversation_id": "90f4e323-6f3d-436d-8d3a-a648107c985c",
            "system": {
                "branch_exited_reason": "completed",
                "dialog_request_counter": 1,
                "branch_exited": true,
                "dialog_turn_counter": 1,
                "dialog_stack": [
                    {
                        "dialog_node": "root"
                    }
                ],
                "_node_output_map": {
                    "node_4_1525296837333": [
                        0
                    ]
                }
            },
            "question": "inicio",
            "response": {
                "answer": ""
            }
        }
        try {
            // console.log("request: ", POST_MESSAGE + "api/message");
            let element = question;
            console.log("question: ", question);
            axios.post("https://asklola-be.mybluemix.net/api/message", { message: { text: question.Question }, "context": context, "userName": "test", "email": "test@email.com" }, config)
                .then(async (response) => {
                    console.log("response: ", response.data.answer.text);
                    element.Answer = response.data.answer.text;
                    resolve(element);
                }).catch((error) => {
                    console.log("err in: " + question.Question + " in err: " + error);
                    element.Answer = "N/A";
                    resolve(element);
                });

        } catch (err) {
            console.log("createMapErr: ", err);
        }
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
        createJson(csvFilePath2).then((jsonObj2) => {
            createMap(jsonObj1, jsonObj2).then(async (jsonRes) => {
                let promises = [];
                jsonRes.map((element) => {
                    promises.push(executeRequest(element));
                });
                Promise.all(promises).then(values => {
                    res.status(200).send(values);
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