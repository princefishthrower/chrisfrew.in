---
title: ABAP Push and Message Channels
date: "2018-01-12"
draft: false
---

# Add some spice to your SAPUI5 apps!
## (Or even normal webapps, for that matter)

I was a noob. I wrote in my SAPUI5 some warehouse task code that would have a real time. How did I do it?

I wrote a `window.setInterval()` function that would ping table `/SCWM/WT` :blush: and check for any new lines - with an OData `GET_ENTITY_SET` server request. :blush: :blush:

Yeah.

Well, I was lucky to learn about websockets from one of our EWM. Then I was even luckier to learn a bit more about the technical aspects (when to subscribe, unsubscribe, destroy, and create websockets instances from actions on the front end).

So here's how to add websockets to your SAPUI5 app<sup><a href="#footnote-1">1</a></sup>.

## Transactions

All backend push and messaging channels can be managed with just two transactions:  `SAMC`, for message channels and `SAPC`, for push channels. Easy enough.

## Creating a Message Channel

As we will see, to create a proper push channel, we will first need a message channel, so that is where we start off. An ABAP message channel is a way of subscribing current programs to any - the best thing about push channels is that if the push channel _isn't_ listening, there is no error and nothing else negative happens anywhere else in the system - that is, granted you `TRY` and `CATCH` your push channel messaging properly.

So let's get started in transaction `SAMC`:

![]()

We define the message channel name, and, most importantly, define what programs can use this message channel and what type of message this channel will handle (there are only 2 - numeric and string)

Now, as I mention before, we use these channels to hook into any ABAP program, so that any time they are executed by anyone (or anything) in the system, the channel will be messages. A safe way to hook into an existing program (using our newly created `Z_AWESOME_CHANNEL`) looks as follows:

```abap
REPORT my_super_cool_existing_report



```

## Creating a Push Channel

Ok, now we head to transaction `SAPC` - we are no going to define a websocket that will be hooked up to our push channel. That way, when something happens in our program, it will message to all subscribed channels, which will be forwarded , and then ultimately, to the most important part, the frontend for our user to see!

## Frontend

On the frontend I create a general websocket function that creates a websocket instance. In order to have the correct service for each view, upon each view change I call this function, which always creates a new instance if there exists a websocket instance already. This way we are sure that on any view change, we have a fresh running instance of the websocket doing the correct task for this view.

That function looks like this:

```

```

Note that you of course have to us `ws://` as the protocol in the link name!

On the backend, that ends up looking like a `CASE` statement:

```abap
CASE
```

## Code

Yep, you're going to have to write some ABAP code too. Luckily for us, when we create a push channel in transaction SAPC, SAP generates a class skeleton with 4 methods:

``
``
``
``
``

<hr/>

# Footnotes
<div id="footnote-1">
1. Note that unfortunately the SAP Web IDE does not yet support websockets, that is, without network wizardry. I haven't managed to get it to work. I've left  long ago a message with the person who was the lead on Cloud Connector asking if websocket (`ws` protocol) would eventually something to be supported, but haven't heard anything.
</div>
