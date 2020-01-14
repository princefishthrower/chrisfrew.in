---
title: Fully Automating Chrisfrew.in Productions - Part 2 of ??? - Building a Node.js Server Monitor
description: 
date: "2018-05-11"
draft: false
starID: 20
postType: dev
---

# Node.js Server Monitor

In [my attempt to automate my suite of websites](https://chrisfrew.in/fully-automating-chrisfrew-in-productions-part-1-of-roadmap-and-links-to-process/), I wanted to build a simple Node.js server that monitors all my live sites, and sends me an email. Basically the process is simply:

1. 'cron' job that every 30 seconds to ping all my websites
2. Check for 200 response from each, if not send email
3. If an even greater problem is found, i.e., the site doesn't even return a 4** code, also send an email
4. A 'reactive' monitor - that is, don't just send a mail when there are problems, try to spool up the server again and log if there is a failure!

To accomplish this I utilized just three Node.js libraries:

- `http`, to request the various sites I control
- `node-schedule`, to create a cron-like check
- `nodemailer`, a fantastic easy-to-use bare bones emailer, we'll send an email when there is a non 2** HTTP response or simple a non-response error (see code below) ([there is a great medium post on an about 20ish liner in Node.js to get started](https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799), and the setting in gmail you have to change)

Obviously this can be developed into a much more complex monitor, but for now I am happy as to how it runs.

# Improvements

A few things I would like to improve with this Server:

- Control the `const` array from somwehere else, perhaps a management GUI where I can maintain sites
- A global log class that could also be used in my Chrisfrew.in Productions Twitter Bot (coming soon in another post)
- Increasing the information and complexity of what is sent in the emails?

# Code

As always, the most [up-to-date code will be on GitHub](https://github.com/frewinchristopher/chrisfrew.in-productions-monitor), but as of this post, the full `index.js` code is as follows:

```javascript
const schedule = require('node-schedule');
const http = require("http");
const nodemailer = require('nodemailer');
const aSitesToTrack = ["http://chrisfrew.in", "http://nlp-champs.com", "http://sirenapparel.us", "http://chrisfrewin.design", "http://seelengefluester-tirol.com", "http://xn--seelengeflster-tirol-yec.com"];
let transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'chrisfrew.in.productions@gmail.com',
        pass: process.env.CHRISFREW_IN_PRODUCTIONS_GMAIL_PASSWORD
    }
});
let mailOptions = {
  from: 'chrisfrew.in.productions@gmail.com', // sender address
  to: 'frewin.christopher@gmail.com' // list of receivers
};

// 1. cron this program every 30 seconds
var j = schedule.scheduleJob('30 * * * * *', function() {
    pingSites();
});

// 2. loop through all sites
function pingSites() {
  aSitesToTrack.forEach((sSite) => {
    http.get(sSite, function (res) {
      // make sure response is 200
      const { statusCode } = res; // destructure responsE integer
      const sStatusCode = statusCode.toString(); // convert to string
      if (!sStatusCode.charAt(0) === "2") { // first digit should be a 2
        mailOptions.subject = 'Site Monitor Chrisfrew.in Productions: Non 2** HTTP Status code'; // Subject line
        mailOptions.html = "The site <b>" + sSite + "</b> is returning a 404 HTTP error!"; // plain text body
        sendEmail();
        console.log("404 email sent");
      } 
    }).on('error', function(e) {
      // major error
      mailOptions.subject = 'Site Monitor Chrisfrew.in Productions: Site non-responsive'; // Subject line
      mailOptions.html = "The site <b>" + sSite + "</b> is non responsive! (Not even a 404 response was found!)"; // plain text body
      sendEmail();
      console.log("Error email sent");
    });
    console.log("Site ping of " + sSite + " complete.");
  });
}

// 3. send email if there was error
function sendEmail() {
  transporter.sendMail(mailOptions, function (err, info) {
       if(err)
         console.log(err)
       else
         console.log(info);
    });
}
```