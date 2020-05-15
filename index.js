'use strict';

const http = require('http');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// const db = require('./db');
const oCorsOptions = {
  origin: ['https://chrisfrew.in', 'http://localhost:8000', 'http://localhost:8081', 'http://localhost:8083'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
let server;

// use the cors middleware
app.use(cors(oCorsOptions));

// bodyParser to get posts from $.ajax
app.use(bodyParser.json());

// TODO: add star stuff back in (and refactor - dear god!)
// util function
// function getIP(req) {
//   return req.headers['x-forwarded-for'] || 
//      req.connection.remoteAddress || 
//      req.socket.remoteAddress ||
//      (req.connection.socket ? req.connection.socket.remoteAddress : null);
// }
// app.post('/star-info', function(req, res) {
//   let oData = {}; // response object
//   const starID = req.body.starID;
//   const sIP = getIP(req);
//   console.log(sIP);
//   console.log(starID);
//   // user count of stars
//   const oIPCountsPromise = db.query('SELECT count FROM ip_counts WHERE ip = $1 AND star_id = $2', [sIP, starID]);
//   // also get count of favorites for this post
//   const oStarCountsPromise = db.query('SELECT count FROM star_counts WHERE star_id = $1', [starID]);
//   // now wait for both responses from db and send back
//   Promise.all([oIPCountsPromise, oStarCountsPromise]).then(function (aValues) {
//     console.log(aValues[0].rows[0]);
//     console.log(aValues[1].rows[0]);
//     // user count of stars (can also determine if this user has)
//     if (aValues[0].rows.length === 1) {
//       oData.bIsFavorite = true;
//       oData.iLocalCount = aValues[0].rows[0].count;
//     } else {
//       oData.bIsFavorite = false;
//       oData.iLocalCount = 0;
//     }
//     // global count of stars
//     if (aValues[1].rows.length === 1) {
//       oData.iGlobalCount = aValues[1].rows[0].count;
//     } else {
//       oData.iGlobalCount = 0;
//     }
//     oData.bSuccessful = true;
//     console.log(oData);
//     res.send(oData);
//   });
// });

// app.post('/star-add', function(req, res) {
//   let oData = {}; // response object
//   console.log(req.body);
//   const starID = req.body.starID;
//   var sIP = getIP(req);
//   let oIPCountsPromise;
//   let oStarCountsPromise;
//   // check if we are seeing a new IP - this will change the way we query
//   console.log(starID);
//   const oIPExistencePromise = db.query('SELECT EXISTS(SELECT 1 from ip_counts where ip=$1 and star_id =$2)', [sIP, starID]);
//   oIPExistencePromise.then(function(oResult) {
//     let sQuery;
//     console.log(oResult.rows[0].exists);
//     if (oResult.rows[0].exists) {
//       sQuery = 'UPDATE ip_counts SET count = count + 1, ip = $1, star_id = $2 WHERE ip = $1 AND star_id = $2'; // this IP / star id combination already exists; query must be UPDATE
//     } else {
//       sQuery = 'INSERT into ip_counts (ip, star_id, count) VALUES ($1, $2, 1)'; // this IP / star ID combination doesn't exist yet; query must be INSERT (with a count of 1)
//     }
//     console.log(sQuery);
//     console.log([sIP, starID]);
//     oIPCountsPromise = db.query(sQuery, [sIP, starID]);
//   });
  
//   // same for new star ID - this will change the way we query
//   const oStarExistencePromise = db.query('SELECT EXISTS(SELECT 1 from star_counts where star_id=$1)', [starID]);
//   oStarExistencePromise.then(function(oResult) {
//     let sQuery;
//     console.log(oResult.rows[0].exists);
//     if (oResult.rows[0].exists) {
//       sQuery = 'UPDATE star_counts SET count = count + 1, star_id = $1 WHERE star_id = $1'; // this IP / star id combination already exists; query must be UPDATE
//     } else {
//       sQuery = 'INSERT into star_counts (star_id, count) VALUES ($1, 1)'; // this IP / star ID combination doesn't exist yet; query must be INSERT (with a count of 1)
//     }
//     console.log(sQuery);
//     console.log([starID]);
//     oStarCountsPromise = db.query(sQuery, [starID]);
//   });
  
//   // now wait for responses from both tables and send back
//   Promise.all([oIPCountsPromise, oStarCountsPromise]).then(function (aValues) {
//     oData.bSuccessful = true;
//     console.log(oData);
//     res.send(oData);
//   });
// });

const options = {
  setHeaders: function(res) {
    res.set('X-Marco', "Polo")
    res.set('X-Wow-Amazing', "Wow I'm so smart I can make a custom HTTP header! -_- smh")
  }
}

app.use("/", expressStaticGzip("./public", options));

server = http.createServer(app);

// listening ports - reverse proxy from nginx to chrisfrew.in
if (process.env.NODE_ENV === 'development') {
  server.listen(8083); // for dev because on my development machine 8081 is for apache for different customer project
} else {
  server.listen(8081);
}
