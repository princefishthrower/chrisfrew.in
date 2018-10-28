'use strict';

var http = require('http');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
var bodyParser = require('body-parser');
var server;

// bodyParser to get posts from $.ajax
app.use(bodyParser.json());

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve public and static assets
app.use(express.static('./public'));
app.use(express.static('./static'));
app.use('/invoicing', express.static('./invoicing'));

server = http.createServer(app);

// listening ports - reverse proxyed from nginx to chrisfrew.in
server.listen(8081);