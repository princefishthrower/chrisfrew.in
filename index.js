'use strict';

const http = require('http');
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const oCorsOptions = {
  origin: ['https://chrisfrew.in', 'http://localhost:8000'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
let server;

// util function
function getIP(req) {
  return req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// use the cors middleware
app.use(cors(oCorsOptions));

// bodyParser to get posts from $.ajax
app.use(bodyParser.json());

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.post('/star-info', function(req, res) {
  let oData = {}; // response object
  const starID = req.body.starID;
  const sIP = getIP(req);
  console.log(sIP);
  console.log(starID);
  // user count of stars
  const oIPCountsPromise = db.query('SELECT count FROM ip_counts WHERE ip = $1 AND star_id = $2', [sIP, starID]);
  // also get count of favorites for this post
  const oStarCountsPromise = db.query('SELECT count FROM star_counts WHERE star_id = $1', [starID]);
  // now wait for both responses from db and send back
  Promise.all([oIPCountsPromise, oStarCountsPromise]).then(function (aValues) {
    console.log(aValues[0].rows[0]);
    console.log(aValues[1].rows[0]);
    // user count of stars (can also determine if this user has)
    if (aValues[0].rows.length === 1) {
      oData.bIsFavorite = true;
      oData.iLocalCount = aValues[0].rows[0].count;
    } else {
      oData.bIsFavorite = false;
      oData.iLocalCount = 0;
    }
    // global count of stars
    if (aValues[1].rows.length === 1) {
      oData.iGlobalCount = aValues[1].rows[0].count;
    } else {
      oData.iGlobalCount = 0;
    }
    oData.bSuccessful = true;
    console.log(oData);
    res.send(oData);
  });
});

app.post('/star-add', function(req, res) {
  let oData = {}; // response object
  console.log(req.body);
  const starID = req.body.starID;
  var sIP = getIP(req);
  let oIPCountsPromise;
  let oStarCountsPromise;
  // check if we are seeing a new IP - this will change the way we query
  console.log(starID);
  const oIPExistencePromise = db.query('SELECT EXISTS(SELECT 1 from ip_counts where ip=$1 and star_id =$2)', [sIP, starID]);
  oIPExistencePromise.then(function(oResult) {
    let sQuery;
    console.log(oResult.rows[0].exists);
    if (oResult.rows[0].exists) {
      sQuery = 'UPDATE ip_counts SET count = count + 1, ip = $1, star_id = $2 WHERE ip = $1 AND star_id = $2'; // this IP / star id combination already exists; query must be UPDATE
    } else {
      sQuery = 'INSERT into ip_counts (ip, star_id, count) VALUES ($1, $2, 1)'; // this IP / star ID combination doesn't exist yet; query must be INSERT (with a count of 1)
    }
    console.log(sQuery);
    console.log([sIP, starID]);
    oIPCountsPromise = db.query(sQuery, [sIP, starID]);
  });
  
  // same for new star ID - this will change the way we query
  const oStarExistencePromise = db.query('SELECT EXISTS(SELECT 1 from star_counts where star_id=$1)', [starID]);
  oStarExistencePromise.then(function(oResult) {
    let sQuery;
    console.log(oResult.rows[0].exists);
    if (oResult.rows[0].exists) {
      sQuery = 'UPDATE star_counts SET count = count + 1, star_id = $1 WHERE star_id = $1'; // this IP / star id combination already exists; query must be UPDATE
    } else {
      sQuery = 'INSERT into star_counts (star_id, count) VALUES ($1, 1)'; // this IP / star ID combination doesn't exist yet; query must be INSERT (with a count of 1)
    }
    console.log(sQuery);
    console.log([starID]);
    oStarCountsPromise = db.query(sQuery, [starID]);
  });
  
  // now wait for responses from both tables and send back
  Promise.all([oIPCountsPromise, oStarCountsPromise]).then(function (aValues) {
    oData.bSuccessful = true;
    console.log(oData);
    res.send(oData);
  });
});

// serve public assets with gzip compression
app.use('/', expressStaticGzip('./public'));
// app.use('/', expressStaticGzip('./static'));

server = http.createServer(app);

// listening ports - reverse proxyed from nginx to chrisfrew.in
if (process.env.NODE_ENV === 'production') {
  server.listen(8081);
} else {
  server.listen(8083);
}
