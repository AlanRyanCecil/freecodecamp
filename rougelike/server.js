'use strict';

const express = require('express'),
    app = express(),
    Path = require('path'),
    path = Path.join(__dirname),
    nodeMods = Path.join(__dirname, 'node_modules'),
    port = 4000;

app.use(express.static(nodeMods));
app.use(express.static(path));
app.listen(port, _=> {
    console.log(`You are lost in the dungeon on port ${port} muhahaha!!!`);
});