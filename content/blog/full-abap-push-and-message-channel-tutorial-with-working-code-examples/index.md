---
title: Full ABAP Push and Message Channel Tutorial With Working Code Examples
description: 
date: "2020-01-14"
draft: false
starID: 50
postType: dev
---

# Add some spice to your SAPUI5 apps!
## (Or even normal webapps, for that matter)

In short, I was a noob. 

I once wrote a SAPUI5 app that would display a stream warehouse task code from a warehouse in realtime. How did I do it?

I wrote a `window.setInterval()` function that would ping table `/SCWM/WT`  and check for any new lines - with an OData `GET_ENTITY_SET` server request. :sweat_smile: :sweat_smile: :sweat_smile:

Yeah.

Although this may initially sound fine - and indeed, it _did_ work - it's not an optimal solution for a few reasons, listed here in terms of level of inefficiency:

1. The database is constantly queried, which can potentially slow down DB transactions if the app was run at scale or if the `setInterval()` interval was decreased to run more often.
2. There is a lot of load on the frontend in terms of input/output traffic - I first have to send a request to the server (which we will see goes away with websockets), and then in the response there can be a relatively large JSON array sent to the frontend if within the last interval if a large amount of warehouse tasks were created in that interval.
3. The query method is simply a bad user experience! Imagine, you won't be seeing the warehouse tasks in real time - only the new ones appearing in batches that have been created within the interval of whatever that `setInterval()` function is set to. (It's 2020, UI/UX is king :crown: right?)

## Websockets to the Rescue

I was informed of the concept of websockets from one of our consultants. Then I was even luckier to learn a bit more about the technical aspects (when to subscribe, unsubscribe, destroy, and create websockets instances from actions on the front end).

So here's how to add websockets to your SAPUI5 or OpenUI5 app<sup><a href="#footnote-1">1</a></sup>.

## SAP Transactions Needed

All backend push and messaging channels can be managed with just two transactions: `SAMC`, for message channels and `SAPC`, for push channels. Easy enough.

## Creating a Message Channel

As we will see, to create a proper push channel, we will first need a message channel, so that is where we start off. An ABAP message channel is a way of publishing information from any programs to any push channel. The best thing about push channels is that if the push channel _isn't_ listening, there is no error and nothing else negative happens anywhere else in the system - that is, granted you `TRY` and `CATCH` your push channel messaging properly.

So let's get started in transaction `SAMC`. Right click the ABAP Messaging Channels Node and select create:

![]()

Give your channel a name, pick your development package, and then a window comes up on the right:

![]()

We define the message channel name, description, channel ID, and, most importantly, define what programs can use this message channel and what type of message this channel will handle (there are only 3 options - `BINARY`, `PCP`, and `TEXT`). Since we'll be using JSON, we want `TEXT`. Activate your message channel. So far so good.

## Creating a Push Channel

Ok, now we head to transaction `SAPC` - we are now going to define a websocket that will be hooked up to our push channel. That way, when something happens in our program, it will message to all subscribed channels, which will be forwarded , and then ultimately, to the most important part, the frontend for our user to see! 

In the same method as in `SAMC` with our push channel, we right click 'ABAP Push Channels' and select create. After providing a name and development packet, the window that appears on the right is a bit simpler than that of the message channel - you should only need to provide the description. The 'Connection Type' should already be set to WebSocket and the class name and service path should already be generated based on the name you provided for the class. It's important to take note of that service path - we'll need it for our SAPUI5 / OpenUI5 WebSocket JavaScript implementation. Before activating, first click the 'Generate Class and Service' button. You should only need to do it once, and then the button will be greyed out. Don't worry if there is message that comes from activation of the class about the non-implemented method `on_message`. That's what were about to implement!

So Hop into your editor of choice, and open up the class that was generated. (Alternatively you can double click the method right away in `SAMC`.)

We can see that the class SAP generated for us inherits from `CL_APC_WSP_EXT_STATELESS_BASE` which in turn implements. So, at the _bare minmum_, we have to implement the two methods `ON_MESSAGE` and `ON_START`. But we can also implement the other three methods `ON_ACCEPT`, `ON_CLOSE`, and `ON_ERROR` if needed.

In ABAP Abapittyy-bippy-boppy terms, that means adding the following code to our class. First in the `PUBLIC SECTION.`, these two lines to tell ABAP we are going to 'redefine' AKA _implement_ those: 

```abap

```

Then of course in the `CLASS ... IMPLEMENTATION.` section, the actual code for the two methods. For `ON_START`, it's essential that we bind the push channel to that message channel we created. For this we need to pass both the message channel name as the `i_application_id` and the channel name as the `i_channel_id`

```abap

```

For the `ON_MESSAGE` method - we need to do any work and formatting for the message we receive through the messaging channel. This is where things are a little backwards. You remember that message _channel_ we built (not the push channel)? the one with channel name `/z_test`? Well, we would actually first need to know where messages are being emitted from. In this class, all we have available to use as to the content of the messages is via `i_message->get_text( )`. To keep the spirit of example going (since not everyone viewing this may have an EWM module and thus we can't use the warehouse task example directly), I'm going to use the `SCUSTOM` table, a table of those fake flight which every ABAP developer knows well and cherishes lovingly <sup>right?</sup> <sup><sup>right?</sup></sup> 

Let's assume that some business process on our server emits a customer ID that would correspond to a given entry in that `SCUSTOM` table.(we'll later make a quick script that does just that - obviously in a productive scenario it wouldn't come from a random script but a business process). So in this case, via the `i_message->get_text( )` method, all we'll have is the customer's ID. So we have to do a bit more work to get all the relavant information about the customer, as well as serizalizing it to JSON:

```abap

```

## I've got the Push Channel, Now What'll I Do With It?!?

Now, as I mention before, we use the messaging channels to hook into any ABAP program, so that any time they are executed by anyone (or anything) in the system, the channel will be messaged. A safe way to hook into an existing program (using our newly created `Z_AWESOME_CHANNEL`) looks as follows:

```abap
REPORT my_super_cool_existing_report
* lots of abap code here - actual program implemenetation


```

and since we've already implemented our push channel, we should be all set to test a full stack case!

## Quick Script To Emit Messages

Here's a super simple script which will select a customer `ID` at random from the `SCUSTOM` table and emit it to our - go ahead and activate it and let it run. Remember - there is no harm in the system as our try catch statement will handle any cases when ABAP can't find any active instances of our push channel.

## Frontend

On the frontend I create a general websocket function that creates a websocket instance. In order to have the correct service for each view, upon each view change I call this function, which always creates a new instance if there exists a websocket instance already. This way we are sure that on any view change, we have a fresh running instance of the websocket doing the correct task for this view.

That function looks like this:

```javascript

```

Note that you of course have to use `ws://` as the protocol in the link name!

On the backend, that ends up looking like a `CASE` statement:

```abap
CASE
```

## Review - Websocket Advantages

In summary, what are the advantages we got by using a websocket?

1. Reduced the load on the DB - in fact we totally removed the load on the DB, moving all channel publishing code to our custom class handling new warehouse tasks (which already existed for other reasons anyway)!
2. Reduced the input traffic from the ABAP server - what was before be an array of multiple JSON objects, using the new websocket version we are always guaranteed a single JSON object from a given warehouse task.
3. Improved the user experience greatly - now users really _do_ see the warehouse tasks appearing in realtime - not in annoying 10 second interval packets.

Finally, I want to be very clear - in no way should websockets replace _all_ of you I/O in any given app - and indeed for many tasks, using a websocket would actually be detrimental. In the case of my intial app load and warehouse task listing, I actually load the most recently dispatched tasks. In this case it is exactly conceptually correct via a GET call. It's only the _streaming_ of _new_ warehouse tasks where the websocket protocol is used.

Whew - that was a fun one! Tune in for more blog posts AND video tutorials on ABAP, SAPUI5 / OpenUI5 in 2020. I've got my own SAPUI5 Web IDE / ABAP Server / Cloud Connector stack now, so there's nothing stopping me!

Cheers! :beer:

Chris

<hr/>

# Footnotes
<div id="footnote-1">
1. Note that unfortunately the Cloud Connector SAP Web IDE does not yet support websockets, that is, without network wizardry. I haven't managed to get it to work. I've left long ago a message with the person who was the lead on Cloud Connector asking if websocket (`ws` protocol) would eventually be supported, but haven't heard anything.
</div>
