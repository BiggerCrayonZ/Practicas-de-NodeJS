const express = require('express');
app = express();
mongoDb = require('mongodb');
mongoose = require('mongoose');
port = process.env.PORT || 3000;
myDB = 'mongoDb://localhost/advancedproject2';
User = require('./Models/user.model.js');
UserRoutes = require('./Controller/UserController.js');

mongoose.connect(myDB);
app.use('/user', UserRoutes);

app.listen(port, (err) => {
    if (!err) {
        console.log("listening on port: ", port);
    } else {
        console.log(err);
    }
})