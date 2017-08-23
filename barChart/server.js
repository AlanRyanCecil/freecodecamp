'use strict';

const express = require('express'),
    app = express(),
    Path = require('path'),
    path = Path.join(__dirname),
    nodeMods = Path.join(__dirname, 'node_modules'),
    port = 4000,
    appName = 'Bar Chart';

app.use(express.static(nodeMods));
app.use(express.static(path));

app.listen(port, _=> {
    console.log(`${appName} is being bar charted on port ${port}.`);
});