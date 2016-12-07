var express = require('express');
var OAuth = require('oauth');
var http = require('http');
var app = express();
var server = http.createServer(app);
var path = __dirname;
var port = 4000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(path));
app.listen(port, function(){
    console.log("Codepen listening on port: " + port);
});

// var OAuth2 = OAuth.OAuth2;    
// var twitterConsumerKey = 'wM2UJ5GAP1gYsnjukWgpoYNPt';
// var twitterConsumerSecret = 'Wukrrozz88lK2FBKX6zGMEOaZRKLj7kWA6ilK2wQu3xHBSgX3u';
// var oauth2 = new OAuth2(server.config.keys.twitter.consumerKey,
//     twitterConsumerSecret, 
//     'https://api.twitter.com/', 
//     null,
//     'oauth2/token', 
//     null);
// oauth2.getOAuthAccessToken(
//     '',
//     {'grant_type':'client_credentials'},
//     function (e, access_token, refresh_token, results){
//     console.log('bearer: ',access_token)
// });