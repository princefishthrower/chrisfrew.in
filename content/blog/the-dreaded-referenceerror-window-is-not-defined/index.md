---
title: Oh The Horror! The Dreaded "WebpackError ReferenceError window is not defined"!
description: 
date: "2018-12-08"
draft: false
starID: 101
postType: dev
---

## The Root Issue
If you're reading this in 2018, 2019, and 2020, the statement shown next to that error is likely an npm module that hasn't yet been built for SSR or static page generation (think NextJS or GatsbyJS. Also, I'm being optimistic and arbitrarily picking the year 2021 as the year that everything will be optimized for web AND non-web rendering... whatever) :joy:. 

The only problem when you see that fateful error is that you may see a `require()` or `import` statement as the location of the error. Then you'd say, huh, I don't see any `window` object immediately... whats going on?
For example:

```javascript
const somePackageThatUsesTheWindowObject = require('some-package-that-uses-the-window-object');
```

or

```javascript
import somePackageThatUsesTheWindowObject from 'some-package-that-uses-the-window-object';
```

or heck, maybe you're even directly referencing the `window` object:

```javascript
let iInnerHeight = window.innerHeight;
```

if you're using React, you'll notice this error _won't_ be thrown, if you're access the `window` object in the _componentDidMount()_ method - but the _componentDidMount()_ lifecycle method is deprecated anyway, so really the truly forward-compatible solutions (for now at least) are as follows in the next section.

# The Solution(s)
So, the solution is simply to check if the window object exists before trying to access it. There are two ways to do this; perhaps one may suit your needs better. (Let's use our `let iInnerHeight = window.innerHeight;` example again):

### Option \#1

```javascript
try {
  let iInnerHeight = window.innerHeight;
} catch(oError) {
  console.log(oError);
}
```

### Option \#2

```javascript
if (typeof window !== 'undefined') {
  let iInnerHeight = window.innerHeight;
}
```

Personally I find option \#1 a bit cleaner, but again, you may find one or the other to better suit what you are trying to do.

That's all for this post. Enjoy your SSR!

Cheers! :beer:

Chris