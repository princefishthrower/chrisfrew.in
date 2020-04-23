---
title: Fully Automating Chrisfrew.in Productions - Part 4 of ??? - Building a Slack Bot
description: 
date: "2018-07-21"
draft: false
starID: 23
postType: dev
---

## Slack Bot!

You may have read [Part 3](https://chrisfrew.in/fully-automating-chrisfrew-in-productions-part-3-of-github-webhook-monitor/) of [my giant automation undertaking](https://chrisfrew.in/fully-automating-chrisfrew-in-productions-part-1-of-roadmap-and-links-to-process/) about. Maybe not.

Anyway, near the bottom of [Part 3](https://chrisfrew.in/fully-automating-chrisfrew-in-productions-part-3-of-github-webhook-monitor/), I discuss a `messageHub()` function that sends a string message to all the places I want it to, one of them being a Slack Bot. This is actually really, really easy to put together. The heroes at Slack are definitely doing a nice job with ease of use for developers.

## Step 1: Set Up Your Slack Bot

- Go to 'Your Apps' on https://api.slack.com: https://api.slack.com/apps
- Click the green button 'Create New App'
- Provide a name and pick a workspace you want that bot
- Under the 'Add features and functionality', click 'Incoming Webhooks'
- Click the switch to turn the service on
- Click Add New Webhook to Workspace
- Select a channel from your slack workspace you want the bot to post to
- copy the https://hooks.slack.com/blahblahblahblah endpoint!

## Step 2: Use POST in Nodejs with Your Link

Now that you have your POST link, sending a message as a slack bot is as easy as sending JSON with a `text` key filled with your desired message string.

Using the axios library for example, that is as simple as:

```javascript
axios.post(process.env.CHRISFREW_IN_SLACK_BOT_WEBHOOK_URL, {
  text: "Hello Word"
});
```

## Step 3: Just kidding, there is no step 3!

That's really all there is too it. Of course you can build out more features, but this is really the jist of it. I'll be working on the other direction over the next few weeks - instead of the bot sending information, sending, or asking the bot for information. This will be a very nice way of interacting with my server without the command line :)

