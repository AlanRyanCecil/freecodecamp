'use strict';

var express = require('express');
var app = express();
var port = 4000;
var path = __dirname;

app.use(express.static(path));
app.listen(port, function(){
    console.log('Wiki is listening on port ' + port + '.');
});