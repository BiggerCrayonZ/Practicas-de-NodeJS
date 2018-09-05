const Router = require('express').Router(),
    User = require('../Models/user.model.js');

Router.get('/index', (req, res) => {
    User.find({}).exec((err, users) => {
        if (error) {
            res.send(err);
        } else {
            res.send(users);
        }
    })
})

Router.post('/new', (req, res) => {
    let newUser = new User();
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.isOver21 = req.body.isOver21;

    newUser.save((err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send(user)
        }
    })
})

module.exports = Router;