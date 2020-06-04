---
title: "Saving Images In Node.js: Using Fetch with arrayBuffer() and Buffer"
description: A quick example on the hurdles of binary stuff in JavaScript!
date: "2020-06-04"
---

This quick blog post presented itself to me when I realized nobody had the full A to Z example of saving an image via some binary data.

In my case, I wanted to _save_ an image from an API. Most examples I found on the web were turning around and directly , but there are some caveats when we actually want to save that binary data as a file. The process is:

- call `arrayBuffer()` on the `fetch` response object.
- convert the ArrayBuffer object to a Buffer with `Buffer.from()`
- save the file via `fs.createWriteStream()` and `write()` the Buffer object

I also used the nice `file-type` [package](https://www.npmjs.com/package/file-type) to attempt to determine the file type of the image, since the API doesn't tell you 🤷‍♂️ &nbsp;[^1].

So, here it is:

```javascript
import fs from "fs";
import fetch from "node-fetch";
import FileType from "file-type";

async function getPhoto() {
    const response = await fetch(API_URL_HERE);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = await FileType.fromBuffer(buffer);
    if (fileType.ext) {
        const outputFileName = `yourfilenamehere.${fileType.ext}`
        fs.createWriteStream(outputFileName).write(buffer);
    } else {
        console.log('File type could not be reliably determined! The binary data may be malformed!')
    }
}

getPhoto();
```

# Footnotes

[^1]:
    Further more, even in 2020, there is _no accepted standard_ for many file types. 
    [Wikipedia states](https://en.wikipedia.org/wiki/File_format): _Since there is no standard list of extensions, more than one format can use the same extension, which can confuse both the operating system and users._ Yep, a real pain.
&nbsp;

&nbsp;
