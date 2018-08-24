const Router = require('express').Router(),
    User = require('../Models/user.model.js');



Router.get('/index', (req, res) => {
    User.find({}).exec((err, users) => {
        if(error){
            res.send(err);
        }
    })
})

module.exports = Router;