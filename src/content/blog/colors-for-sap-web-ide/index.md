---
title: Colors For SAP Web IDE!
description:
date: "2018-01-11"
draft: false
starID: 11
postType: dev
---

# Dude, where's my color scheme?!

At some point, _SAP took away my Monokai Color scheme from the SAPUI5 Web IDE!_ That is unforgivable...

![Like I said, unforgivable.](unforgivable.gif)

## Don't worry - code to the rescue!

I wrote a small tampermonkey script that address this issue, and you can get your monokai colors back! [(See Ace's GitHub for all possible themes.)](https://github.com/ajaxorg/ace/tree/master/lib/ace/theme)

![What's this trickery?!?! Is that MONOKAI for SAP Web IDE?!](sapwebidecolors.png)
What's this trickery?!?! Is that the MONOKAI color scheme for SAP Web IDE?!

This obviously requires that you have tampermonkey installed for your browser - check out the [tampermonkey website on how to install it](https://tampermonkey.net/).

Once you've installed tampermonkey, just copy in and paste the script from below (or the [GitHub](https://github.com/frewinchristopher/sapwebidecolors) page) and all you should need to change is the `[YOUR_USER_NAME_HERE]` value in the `@match` variable. This username is your SAP 's' username, an 's' followed by 10 numbers, i.e. `S0123456789`.

## TL;DR: Gimme Code!

The full code (as of January 11, 2018) is as follows:

```javascript
// ==UserScript==
// @name         Monokai Web IDE colors
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the Ace Shell CSS in SAP Web IDE from any defaults to Monokai.
// @author       Chris Frewin
// @match        https://webide-[YOUR_USER_NAME_HERE]trial.dispatcher.hanatrial.ondemand.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @resource     customCSS https://raw.githubusercontent.com/ajaxorg/ace/master/lib/ace/theme/monokai.css
// @require      http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/highlight.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

// *** NOTE: feel free to replace the 'customCSS' link above with any of the following ace themes found here: (make sure to select the raw version!)
// https://github.com/ajaxorg/ace/tree/master/lib/ace/theme

window.setTimeout(function() {
    var newCSS = GM_getResourceText ("customCSS"); // monokai css for ace editor
    GM_addStyle (newCSS);
    console.log("added css...");
    var editor = $("#__editor0"); // select editor ID
    $(editor).removeClass(); // remove any of the default classes
    console.log("removed default css...");
    $(editor).addClass("ace_editor"); // add back in original class
    $(editor).addClass("ace-monokai"); // monokai colors class!
    console.log("added ace-monokai css...");
},20000);
```

I would recommend you check out the newest version on GitHub: [https://github.com/frewinchristopher/sapwebidecolors](https://github.com/frewinchristopher/sapwebidecolors)

Cheers! :beer:
