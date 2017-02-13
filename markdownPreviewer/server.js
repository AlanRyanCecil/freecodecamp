const express = require('express'),
    Path = require('path'),
    app = express(),
    path = Path.join(__dirname),
    port = 3000,
    appName = 'Markdown Previewer';

app.use(express.static('./node_modules'));
app.use(express.static(path));
app.listen(port, _=> {
    console.log(`${appName} running on port: ${port}.`);
});