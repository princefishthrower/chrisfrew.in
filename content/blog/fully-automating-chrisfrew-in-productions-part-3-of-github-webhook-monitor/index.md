---
title: Fully Automating Chrisfrew.in Productions - Part 3 of ??? - Building a GitHub Webhook Monitor
description: 
date: "2018-07-20"
draft: false
starID: 22
postType: dev
---

## Background and Overview of this Technologically Amazing Accomplishment

After a bit of thinking about my automation project, I settled on a single subdomain (at least for now), fittedly named [https://webhooks.chrisfrew.in](https://webhooks.chrisfrew.in). (Go on, you can try clicking on it). However, if you're not an authorized party (which I check via a _secret key_) you'll just be redirected to the plain ol' [https://chrisfrew.in](https://chrisfrew.in) - yeah I know, what a crappy blog.

If any of this stuff sounds cool, or perhaps more importantly, sounds like a foreign language, then c'mon in and dive in - we'll get into the technical details and all steps of how all of this can be set up.

Remember, all this stuff is open source too. The repository for the monitor is here: https://github.com/frewinchristopher/chrisfrew.in-productions-github-bitbucket-monitor

(The full code is also posted at the bottom of this post.)

## Setting Up a Catch-All webhooks subdomain

So [chrisfrew.in](chrisfrew.in) is registered on Namecheap. We have to just setup two A Records, both for webhooks www.webhooks. It looks like this:

![Namecheap configuration](namecheap_config.png)

## Listing on Webhooks subdomain - POST and 'all'

So first off, we want our express app to only do special things on a post to the root (in this case, because I run NGINX, we are already in the webhooks.chrisfrew.in namespace here) - otherwise we redirect to https://chrisfrew.in

Notice that even when ARE POSTed to, we still verify the signature of the request, otherwise just like the `all('*')`, we redirect (301) the traffic to chrisfrew.in.

```javascript
app.post('/', (req, res) => {
  if (verifySignature(req)) {
    determineWebhook(req.body);
    // authentic source
    console.log('Authentication successful; processing data:');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
  } else {
    // Someone else calling
    console.log('Authentication failed; redirecting them to https://chrisfrew.in');
    res.redirect(301, 'https://chrisfrew.in/'); // Redirect to domain root
  }
});

app.all('*', (req, res) => {
  // Someone else calling
  console.log('Authentication failed; redirecting them to https://chrisfrew.in');
  res.redirect(301, 'https://chrisfrew.in/'); // Redirect to domain root
}); // Only webhook requests allowed at this address
```

## Determine What type of Webhook

Right now I only process GitHub and Bitbucket Webhooks. It's rudimentary, and it's not even finished, but it works for GitHub:

```javascript
const determineWebhook = (oData) => {
  let sStatus;
  if (oData.sender) { // GitHub
    sStatus = "New head commit in " + oData.repository.name + " (" + oData.repository.url + "): " + oData.head_commit.committer.name;
    if (oData.head_commit.added)  {
      sStatus = sStatus + " added " + oData.head_commit.added.length + " files, ";
    }
    if (oData.head_commit.modified)  {
      sStatus = sStatus +  " modified " + oData.head_commit.modified.length + " files, and";
    }
    if (oData.head_commit.removed) {
      sStatus = sStatus +  " removed " + oData.head_commit.removed.length + " files.";
    }
   console.log(sStatus);
   messageHub("Attempting to pull from this repository...");
   pull(oRepositoryPathValuePairs[oData.repository.name]);
    //twitterBotUtils.postStatus(sStatus);
  } else if (oData.actor) { // Bitbucket
    
    //twitterBotUtils.postStatus(sStatus);
  } else { // some other webhook (there are no others yet)
    
  }
};
```

## GitHub Integration

With our subdomain set up and our express server serving there, we can start processing requests for `webhooks.chrisfrew.in`. The important thing here is to validate requests. Imagine what could happen without validation, (if I eventualy do hook this up to my twitter bot to post every time a repository is updated) just anyone could send random github-ish looking json data to `webhooks.chrisfrew.in`, and my server would take action, even when its not coming from a validate That would be really annoying, and plus, it would make me seem _way_ more productive than I am with my repositories. :joy::joy::joy: So yeah, validation is an important step. 

GitHub's way of doing authentication for webhooks is to take the content of the payload, concatenate that with the secret key, and then hash it. You then do the same on your server, since you yourself also know the secret key, and if the hashes match, violá! You know it's coming from GitHub. We accomplish this in Nodejs in a function called `verifySignature` like so:

```javascript
// Verification function to check if it is actually GitHub who is POSTing here
const verifySignature = (req) => {
  if (!req.headers['user-agent'].includes('GitHub-Hookshot')) {
    return false;
  }
  // Compare their hmac signature to our hmac signature
  // (hmac = hash-based message authentication code)
  const sExternalSignature = req.headers['x-hub-signature'];
  const oData = JSON.stringify(req.body);
  const sSecret = process.env.WEBHOOK_SECRET; 
  const sInternalSignature = `sha1=${crypto.createHmac('sha1', sSecret).update(oData).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(sExternalSignature), Buffer.from(sInternalSignature));
};
```

## GitHub Integration

So, we know - then on the production server we want to naturally pull this newest code from the remote? For that, there is the NPM package `simple-git` [https://github.com/steveukx/git-js#readme](https://github.com/steveukx/git-js#readme).

```javascript
const pull = (sRootRepositoryDirectory) => {
  git.cwd(sRootRepositoryDirectory).pull((err, update) => {
     if(update && update.summary.changes) { // there is indeed an update found on the remote
        messageHub("This is an app templated by create-react-app; We need to issue 'npm run build' to build new source...");
        build();
     } else if (err) {
       if (err.includes("commit your changes or stash them")) {
         messageHub("Changes need to be stashed; stashing automatically...");
         stashAndPull(sRootRepositoryDirectory);
       }// TODO: more error cases? ...
     }
  });
}
const stashAndPull = (sRootRepositoryDirectory) => {
  git.cwd(sRootRepositoryDirectory).stash()
    .then(() => {
      messageHub("Stash succesfull, attempting to pull again...");
      pull(sRootRepositoryDirectory);
    });
}
```

## Build Integration

So, I thought it was nice that we could detect pushes to the repository and then . But, with my create-react-apps, could I also build the source. If you were eagle-eyed, you may have seen that sneaky `build()` function. That function looks like this:

```javascript
const build = () => {
  exec('npm run build', { cwd: '../charge-keyboard.com' }, function(err, stdout, stderr) {
     if (err) {
       messageHub(err);
     } else if (stderr) {
       messageHub(stderr);
     } else {
       messageHub("Build command successfully sent. The site should be live with the newly commited changes incorporated.");
     }
   });
}
```

The _very_ cool thing here, at least I think, is that since I run my `index.js` servers with `forever`, when the source is built, whatever `index.js` is serving is updated, without affecting the runtime of `index.js` itself! So, I am nearly approaching a fully integrated build system that was all custom built. :smile:

## Other Fun stuff

You know how when your `npm start` wont work, only because of a missing module? I've always been like, well, the _single_ solution here _is to just install the friggen module_ Well, thanks to stdout, we can try to read those missing modules, install it, and try `npm start` again. This is something I am working on.

You'll notice a lot of the code is parsing `stdout` as strings - I realize out to an infinite time scale, this isn't a most robust way of checking error messages, so I'm working towards parsing the actual errors codes from Nodejs and reacting from those, instead of the error text itself.

You may have also noticed the function messageHub for nearly every logging type message. Indeed, we do log to the console, but I built this hub-type function so we could add more ways of messaging, one of them is through a Slack bot, which I show how to do in [Part 4](https://chrisfrew.in/fully-automating-chrisfrew-in-productions-part-4-of-building-a-slack-bot/)

You'll see I have logging util and twitter util functions commented out - they are coming - all with good time!

## To Do List

I've still got to add all my other sites to the monitor - this is just a matter adding to that key:value that the server monitors - see `oRepositoryPathValuePairs` in the code below for what I am talking about.

What will be really cool is for the GitHub monitor to update itself when it sees that it's remote - yes, this is like some Terminator-level crap. This will be a special case, because in order for a flawless execution of the monitor server itself, it would have to spawn a child process of itself, then update its code, then start itself, finally killing the child process of its older version.

## Full code

`index.js`
```javascript
'use strict'; // strict

// external library requires
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const twitterBotUtils = require('../chrisfrew.in-productions-shared-functions/utils/twitterBotUtils.js');
const simpleGit = require('simple-git');
const git = simpleGit();
const axios = require('axios');
const exec = require('child_process').exec;

// fixed port on dell
const iPort = 8087;
const oRepositoryPathValuePairs = {
  "charge-keyboard-splash-page": "../charge-keyboard.com",
  "chrisfrew.in-productions-github-bitbucket-monitor": "", // super meta - will restart itself
}

// The GitHub webhook MUST be configured to be sent as "application/json"
app.use(bodyParser.json());

// Verification function to check if it is actually GitHub who is POSTing here
const verifySignature = (req) => {
  if (!req.headers['user-agent'].includes('GitHub-Hookshot')) {
    return false;
  }
  // Compare their hmac signature to our hmac signature
  // (hmac = hash-based message authentication code)
  const sExternalSignature = req.headers['x-hub-signature'];
  const oData = JSON.stringify(req.body);
  const sSecret = process.env.WEBHOOK_SECRET; 
  const sInternalSignature = `sha1=${crypto.createHmac('sha1', sSecret).update(oData).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(sExternalSignature), Buffer.from(sInternalSignature));
};

const determineWebhook = (oData) => {
  let sStatus;
  if (oData.sender) { // GitHub
    sStatus = "New head commit in " + oData.repository.name + " (" + oData.repository.url + "): " + oData.head_commit.committer.name;
    if (oData.head_commit.added)  {
      sStatus = sStatus + " added " + oData.head_commit.added.length + " files, ";
    }
    if (oData.head_commit.modified)  {
      sStatus = sStatus +  " modified " + oData.head_commit.modified.length + " files, and";
    }
    if (oData.head_commit.removed) {
      sStatus = sStatus +  " removed " + oData.head_commit.removed.length + " files.";
    }
   console.log(sStatus);
   messageHub("Attempting to pull from this repository...");
   pull(oRepositoryPathValuePairs[oData.repository.name]);
    //twitterBotUtils.postStatus(sStatus);
  } else if (oData.actor) { // Bitbucket
    
    //twitterBotUtils.postStatus(sStatus);
  } else { // some other webhook (there are no others yet)
    
  }

};
const pull = (sRootRepositoryDirectory) => {
  git.cwd(sRootRepositoryDirectory).pull((err, update) => {
     if(update && update.summary.changes) { // there is indeed an update found on the remote
        messageHub("This is an app templated by create-react-app; We need to issue 'npm run build' to build new source...");
        build();
     } else if (err) {
       if (err.includes("commit your changes or stash them")) {
         messageHub("Changes need to be stashed; stashing automatically...");
         stashAndPull(sRootRepositoryDirectory);
       }// TODO: more error cases? ...
     }
  });
}
const stashAndPull = (sRootRepositoryDirectory) => {
  git.cwd(sRootRepositoryDirectory).stash()
    .then(() => {
      messageHub("Stash succesfull, attempting to pull again...");
      pull(sRootRepositoryDirectory);
    });
}
const build = () => {
  exec('npm run build', { cwd: '../charge-keyboard.com' }, function(err, stdout, stderr) {
     if (err) {
       messageHub(err);
     } else if (stderr) {
       messageHub(stderr);
     } else {
       messageHub("Build command successfully sent. The site should be live with the newly commited changes incorporated.");
     }
   });
}

const messageHub = (sMessage) => { // all the ways of messaging combined into one messaging "hub"
  //twitterBotUtils.postStatus(sMessage); // // TODO: : make live!!!
  //loggingUtils.logMessage(sMessage): // TODO: also make live!!!
  slackBotWebHook(sMessage);
  console.log(sMessage);
}

const slackBotWebHook = (sMessage) => {
  axios.post(process.env.CHRISFREW_IN_SLACK_BOT_WEBHOOK_URL, {
    text: sMessage
  });
}

app.post('/', (req, res) => {
  if (verifySignature(req)) {
    determineWebhook(req.body);
    // authentic source
    console.log('Authentication successful; processing data:');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
  } else {
    // Someone else calling
    console.log('Authentication failed; redirecting them to https://chrisfrew.in');
    res.redirect(301, 'https://chrisfrew.in/'); // Redirect to domain root
  }
});

app.all('*', (req, res) => {
  // Someone else calling
  console.log('Authentication failed; redirecting them to https://chrisfrew.in');
  res.redirect(301, 'https://chrisfrew.in/'); // Redirect to domain root
}); // Only webhook requests allowed at this address

app.listen(iPort);

console.log('Webhook service running at http://localhost:' + iPort.toString());
```

And again, don't forget the updated code is all available on GitHub: https://github.com/frewinchristopher/chrisfrew.in-productions-github-bitbucket-monitor

Cheers! :beer: