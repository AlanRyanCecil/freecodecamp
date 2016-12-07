'use strict';

var express = require('express');
var app = express();
var path = (__dirname).normalize();
var port = 4000;

app.use(express.static(path));
app.listen(port);

console.log("Twitching on port: " + port + ".");