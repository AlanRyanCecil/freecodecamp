'use strict';

const express = require('express'),
    app = express(),
    Path = require('path'),
    path = Path.join(__dirname),
    port = 4000;

app.use(express.static('./node_modules'));
app.use(express.static(path));
app.listen(port, _=> {
    console.log(`This app is running on port ${port}.`);
});