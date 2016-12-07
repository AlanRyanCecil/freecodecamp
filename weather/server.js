'use strict';
var express = require('express');
var app = express();
var path = __dirname;
var port = 4000;

app.use(express.static(path));
app.listen(port, function(){
    console.log("Weather is listening on port " + port);
});