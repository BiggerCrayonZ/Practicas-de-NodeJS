/* Requires */
const routes = require('express').Router();
const { Functions } = require('../models/heroe/functions');


/* Objects */
const heroe = new Functions;

/* Routes */
routes.route('/heroe/get/:id').get((req, res) => {
    heroe.getHero(req.params.id).then(hero => {
        res.status(200).send({ status: "Done", data: hero });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    });
});

routes.route('/heroe/getAtt/:docname/:attname').get((req, res) => {
    console.log("inputs: " + req.params.docname + " " + req.params.attname);
    heroe.getAtt(req.body.docname, req.body.attname).then(hero => {

        let b64encoded = btoa(String.fromCharCode.apply(null, hero.data));
        
        res.type('image/png');
        res.end(hero);
    }).catch(err => {
        console.log("err :", err);
        res.status(400).send({ status: "Fail", err: err });
    });
});

routes.route('/heroe/find/:id').get((req, res) => {
    heroe.findHero(req.params.id).then(heros => {
        res.status(200).send({ status: "Done", data: heros });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    });
});

routes.route('/heroe/all/').get((req, res) => {
    heroe.getAllHeros().then(heros => {
        res.status(200).send({ status: "Done", data: heros });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    })
});

routes.route('/heroe/getHerosByHouse').post((req, res) => {
    heroe.getHerosByHouse(req.body.house).then(heros => {
        res.status(200).send({ status: "Done", data: heros });
    }).catch(err => {
        res.status(400).send({ status: "Fail", err: err });
    })
});

/* Export */
module.exports = routes;