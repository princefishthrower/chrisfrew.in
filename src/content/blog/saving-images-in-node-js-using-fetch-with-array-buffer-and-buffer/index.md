---
title: "Saving Images In Node.js: Using Fetch with arrayBuffer() and Buffer"
description: A quick example on the hurdles of binary buffers in JavaScript!
date: "2020-06-04"
tags: Node.js,javascript
---

The idea behind this post presented itself to me when I realized nobody had the full A to Z example of saving an image via some binary data.

In my case, I wanted to _save_ an image from an API. Most examples in Node.js I found on the web were turning around and directly creating an `<img>` element and setting the src with base64 string or something like that. In my case, I wanted to save the API response directly as an image file. The process is:

- call `arrayBuffer()` on the `fetch` response object.
- convert the `ArrayBuffer` object to a `Buffer` object with `Buffer.from()`
- save the file via `fs.createWriteStream()` and `write()` the Buffer object

I also used the nice `file-type` [package](https://www.npmjs.com/package/file-type) to attempt to determine the file type of the image, since the API doesn't tell you 🤷‍♂️ &nbsp;[^1].

So, here's the full code example:

```javascript
import fs from "fs";
import fetch from "node-fetch";
import FileType from "file-type";

const API_URL_HERE = "your-api-url.whatever";

async function savePhotoFromAPI() {
    const response = await fetch(API_URL_HERE);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = await FileType.fromBuffer(buffer);
    if (fileType.ext) {
        const outputFileName = `yourfilenamehere.${fileType.ext}`
        fs.createWriteStream(outputFileName).write(buffer);
    } else {
        console.log('File type could not be reliably determined! The binary data may be malformed! No file saved!')
    }
}

savePhotoFromAPI();
```

# Footnotes

[^1]:
    Further more, even in 2020, there is _no accepted standard_ for many file types. 
    [Wikipedia states](https://en.wikipedia.org/wiki/File_format): _Since there is no standard list of extensions, more than one format can use the same extension, which can confuse both the operating system and users._ Yep, a real pain.
&nbsp;

&nbsp;
