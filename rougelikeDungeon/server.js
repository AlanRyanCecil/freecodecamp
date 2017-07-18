'use strict';

const express = require('express'),
    app = express(),
    Path = require('path'),
    path = Path.join(__dirname),
    nodeMods = Path.join(__dirname, 'node_modules'),
    port = 4000,
    gameName = 'procedurally generated dungeon';

app.use(express.static(nodeMods));
app.use(express.static(path));

app.listen(port, function () {
    console.log(`${gameName} is being procedurally generated on port ${port}.`);
});