const http = require("http");
const express = require("express");
const app = express();
var bodyParser = require('body-parser');

let database = require('./config/db');
global.db = database.connectDb(); 
const routes = require('./routes/index');
global.ResponseController = require('./controller/ResponseController');

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(bodyParser.json({ limit: '100mb', limit: '100mb' }))
app.use('/',routes);
app.listen(3009, () => {
    console.log("server is listening on 3009 port");
})