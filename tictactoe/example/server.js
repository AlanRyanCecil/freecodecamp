'use strict';

var express = require('express'),
    app = express(),
    path = (__dirname).normalize(),
    port = 4001;

app.use(express.static(path));
app.listen(port, function () {
    console.log("example is running port " + port);
});