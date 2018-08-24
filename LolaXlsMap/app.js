const express = require('express');
app = express();

ExcelRoutes = require('./Controllers/excelController.js');
port = process.env.PORT || 3000;

app.use('/excel', ExcelRoutes);

app.listen(port, (err) => {
    if (!err) {
        console.log("listening on port: ", port);
    } else {
        console.log(err);
    }
})