'use strict';

var http = require('http');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const app = express();
var bodyParser = require('body-parser');
var server;

// bodyParser to get posts from $.ajax
app.use(bodyParser.json());

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve public and static assets
// app.use(express.static('./public'));
// app.use(express.static('./static'));

// serve with gzip compression?
app.use('/', expressStaticGzip('./public'));
app.use('/', expressStaticGzip('./static'));

server = http.createServer(app);

// listening ports - reverse proxyed from nginx to chrisfrew.in
server.listen(8081);