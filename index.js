var http = require('http');
var express = require('express');
var app = express();
var server;

app.use('/static', express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/public'));
server = http.createServer(app);
server.listen(8082);
