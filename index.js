const express = require('express');
var bodyParser = require('body-parser');

const route = require('./src/route/route');

const mongoose  = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://group55:3SlxkwNnRns1af2q@cluster0.rahvcmm.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB_connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});