'use strict';

var express = require('express'),
    app = express(),
    path = (__dirname).normalize(),
    port = 4000;

app.use(express.static(path));
app.listen(port, function () {
    console.log("tic-tac-toe is being played on port " + port + ".");
});