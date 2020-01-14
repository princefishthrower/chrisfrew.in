---
title: Using Google Cloud's Text To Speech Machine Learning API
description:
date: "2018-04-14"
draft: false
starID: 17
postType: dev
---

# Google Cloud

I'm torn most of the time about using Google Cloud APIs - on one hand, they are a group of some of the best APIs on the web today - the variety of what you can do with their APIs, whether it be maps, text to speech, search data, and more - is huge. However, with such a huge library comes the fact that the documentation can be a bit of a maze to get through. I mean, for the text to speech (TTS) API we'll be talking about in this post, for the getting started guide (in "five minutes!!!" as it says on the site), they provide this old-school bash `curl` command:

```bash
curl -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) -H "Content-Type: application/json; charset=utf-8" --data "{
  'input':{
    'text':'Android is a mobile operating system developed by Google, based on the Linux kernel and designed primarily for touchscreen mobile devices such as smartphones and tablets.'
  },
  'voice':{
    'languageCode':'en-gb',
    'name':'en-GB-Standard-A',
    'ssmlGender':'FEMALE'
  },
  'audioConfig':{
    'audioEncoding':'MP3'
  }
}" "https://texttospeech.googleapis.com/v1beta1/text:synthesize" > synthesize-output.txt
```

I mean what the heck is that? The `$(gcloud auth application-default print-access-token)` did _not_ work for me. Even if it did, the following steps included extracting the base64 encoded string (which is only a part of the downloaded curl file) to another file, _and then_ converting that base64 file to an mp3 file. No thank you, I'm going to do it all at runtime!

Long story short, I've found that this time and like many times before, using Google's APIs is usually a lot of trial and error to get the endpoints working. <sup><a href="#footnote-3">1</a></sup>

It wasn't until I got to Google's interactive POST console for their TTS module which you can use to test endpoints that I got a basic request working. That's how I determined the bare minimum API request required below.

# You're in Luck :sunglasses:

There's good news: luckily for you, I can spare you the migrain/hair pulling/rage that may ensue when trying to wrap your mind around Google's often spotty documentation. I managed to get the TTS endpoint working, in Node.js nonetheless. In Node.js JavaScript, here is the code for converting some typed text to a tasty mp3 (granted you have a valid API key generated from googles cloud console for the )

**_Note that you need the following prerequisites for this to work!_**
- be in a node project `npm init -y`
- axios installed `npm install --save axios`
- your google TTS module API key exported (in your `.bash_profile` or similar) as `GOOGLE_CLOUD_TEXT_TO_SPEECH_API`, i.e. that would be this line of bash:

`export GOOGLE_CLOUD_TEXT_TO_SPEECH_API=blahblahblahblah`

- the following in `index.js`:

```javascript
let oResponse;
var axios = require('axios');
var fs = require('fs');
const sMainText = "hello world";
const oData = {
  "input":
  {
    "text": sMainText
  },
  "voice":
  {
    "languageCode": "en-GB",
    "ssmlGender": "FEMALE"
  },
  "audioConfig":
  {
    "audioEncoding": "mp3"
  }
};
axios.post("https://texttospeech.googleapis.com/v1beta1/text:synthesize?fields=audioContent&key=" + process.env.GOOGLE_CLOUD_TEXT_TO_SPEECH_API, oData)
.then(function (oResponse) {
  // write dat baoss (an encoded string) response into an mp3 file
  fs.writeFileSync('outfile.mp3', oResponse.data.audioContent, 'base64', function(err) { // write this base64 to an mp3
    console.log(err);
  });
  console.log("MP3 file generated and saved! Should be saved at outfile.mp3");
})
.catch(function (error) {
  console.log(error);
});
```
Then it should run with a good ol' `node index.js`! You'll find a tasty mp3 with "hello world" being spoken - relatively better than Microsoft Sam i'd have to say! :joy:

So I hoped I saved you some time and frustration with at least this Google API.

Enjoy, and Cheers! :beer:

-Chris

**This is part of a longer project that I'm trying to build to get a market volatility news flash published as one of Amazon Alexa's skills. More on that to come. - A link here will also come soon.**

# Footnotes

<div id="footnote-1">
1. Some other APIs I've found have example minimum required interface endpoints for every language they support - super clean and tasty. I'm wondering if a lack of such clean documentation is because Google is focusing more on development than maintenance and documentation of their APIs. Perhaps the challenge itself is the vastness of the Google API library, and it would take nothing short of a genius to organize a proper strategy of attack on updating and cleaning up all the documentation.
</div>
