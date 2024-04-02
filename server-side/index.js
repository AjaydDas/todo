var express = require('express');
var bodyParser = require("body-parser");
var connectDB = require('./config/db');
var routes = require('./routes/route');
const cors = require('cors');


var app = express();

require('dotenv').config();

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(5000, function () {
    console.log('Example app listening on port 3000!')
});
