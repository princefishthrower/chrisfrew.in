---
title: Data Challenge! Rendering All 32,767 Invaders!
description:
date: "2019-01-13"
draft: false
starID: 104
postType: data
---

This post is [also published on Medium](https://medium.com/@frewin.christopher/data-challenge-rendering-all-32-767-invaders-d20e69e045f4), if you prefer to read there<sup>[1](#footnote-1)</sup>, but it was posted here first. :smile:

## Results First, Technical Stuff Later

If you're here just trying to find my Invader-rendering site, [that is here.](https://chrisfrew.in/invaders)

Or, if you are looking for the _repository_ for ^ that site, [that is here.](https://github.com/frewinchristopher/invaders)

Finally, the backend code (in Python) to generate all 32,767 unique instances Invaders [is here.](https://github.com/frewinchristopher/invaders-data)

## Background: Processing and p5.js

I got into the whole Processing universe through a few generative art courses on Skillshare.  If you don't know yet, Processing is a Java library (I believe there is a Python library too) that makes drawing and creating both fixed and animated digital art very easy. To get started, you need only to download the IDE and fill out a few methods, which could look as simple as:

```java
float xLocation = 0;
float yLocation = 0;

void setup() {
  background(255,255,255);
  size(700,700);
}

void draw(){
   float newXLocation = xLocation + random(100)-50;
   float newYLocation = yLocation + random(100)-50;
   if (newXLocation > 700) {
     newXLocation = 700;
   }
   if (newXLocation < 0) {
     newXLocation = 0;
   }
   if (newYLocation > 700) {
     newYLocation = 700;
   }
   if (newYLocation < 0) {
     newYLocation = 0;
   }
   //line(s.xLocation, s.yLocation, newXLocation, newYLocation);
   stroke(255,255,255,0);
   fill(random(255), random(255), random(255), 100);
   float randomCircleSize = random(100);
   ellipse(xLocation, yLocation, randomCircleSize, randomCircleSize);
   xLocation = newXLocation;
   yLocation = newYLocation;
}
```

and already you've written code that generates an animation like this:

![Gif of randomly colored circles popping up all over the screen](./circles.gif)

Of course, this is only the tip of the iceberg. You can build out and develop art and patterns as complex as you want, [like these examples by Daniel Stewart.](https://www.skillshare.com/projects/Talkin-Bout-My-Generating/27908)

## Motivation for this Data Challenge

So, after learning the very basics about Processing and working through a few examples and a beginner generative art course by [Melissa Wiederrecht on Skillshare](https://www.skillshare.com/classes/Coding-Easy-Generative-Art-With-Processing-The-Basics/520946096), I started exploring other's work, also mostly on Skillshare. 

Being the video game nerd that I am, I took a particular liking to the 'Invaders' work by [Jerome Herr in 2013](https://www.skillshare.com/projects/Experimenting-with-Processing-and-HYPE/18021) and [code](https://pastebin.com/umz39Yus). He mentions for the Invaders that he was originally inspired by [Jared Tarbell's work in 2003](http://www.complexification.net/gallery/machines/invaderfractal/) who appears to be the first to work on the Invaders concept and even provides [an interactive fractal implementation of Invader generation](http://www.complexification.net/gallery/machines/invaderfractal/flash/invaderFractall.html).

That's when I saw my chance to put my own spin on Invaders. Both Jerome's and Jared's works are not determinant. In other words, each time you run their respective programs, you get a different result. With my web app / API / front-end background, I realized that all the Invader data could first be generated, and then loaded at any later time. And so this **Data Challenge!**<sup>TM</sup> began! 

I started by modifying [the code kindly provided by Jerome](https://pastebin.com/umz39Yus), but then I started getting frustrated with the Java syntax entirely. It's been over 10 years since I wrote any Java, and that was my Junior year in Highschool... so yeah, I was looking for (hopefully) a Javascript possibility. And what do you know, there _is_ a JavaScript library for processing!

It just so happens that completely by chance, the very cover animation on the home page of my blog, which you may or may not know depending on how often you visit the blog, _is_ a p5.js animation! I didn't make the connection at first because I originally found that library through [this 'Show HN' post showcasing the library back at the end of August, 2018](https://news.ycombinator.com/item?id=17716542), and that 'circles bouncing around in a container' example is a pretty generic example which I just lightly refactored for my site. Plus, the names p5 and Processing just never connected in my mind!

## The Decision to Switch to Javascript

So I finally bit the bullet and said, "alright, I'm killin' myself here, I need do this in JavaScript, let's convert this Java code to Javascript."<sup>[2](#footnote-2)</sup>  

Anyway, the reason I wanted to do this project in Javascript was to get more practice with p5.js. I'll likely be using in the future for even more generative art projects! This is the best path forward for me, because even if it is static artwork (like prints and such), I'll still have the p5.js version that can literally be shared in its pure form across the web!

## React and p5.js

I _also_ wanted to build this site with my near and dear front-end library of choice, React. Then of course, because p5.js uses canvas elements, you need a wrapper to pass data events to p5.js from React and blah blah blah. Yay, state-of-the-web in 2019!

Luckily, there is [a boilerplate repository](https://github.com/atorov/react-p5js/tree/master/src/components) by [atorov](https://github.com/atorov) with not _one_ but _two_ examples of how to use p5.js sketches with react!

So, I had an overview of all the scaffolding I needed. I then got started with the Invader data generation.

## Definitions

### What is an Invader?

Before we go any further, I'll explain mathematically what an Invader is. An Invader is an array of 15 independently activated or deactivated blocks, arranged in any order, which is then partially reflected along the y-axis (1 reflecting to 1', 6 reflecting to 6', and so on) forming the complete 25 block, 5 x 5 group of blocks::

![Invader schematic](./invader.svg)

There are 2<sup>15</sup>-1 possible unique combinations of this configuration, or 32,768 - 1 = 32,767. We have to subtract 1 from 32,768, since the Invader with all 15 blocks deactivated would be an empty 5 x 5 group of blocks. (Oppositely, an Invader with all 15 blocks activated is a solid 5 x 5 group of blocks.)

A helpful analogy for me was to picture this array of 15 switches next to each other, each being switched on or off at random, until you have every possible combination - all 32,767 of them. This configuration can be realized as a binary list of length 15, where a `1` represents an activated, or turned on block, while a `0` represents a deactivated, or turned off block.

## Math and Data Generation

The math behind Invader generation is briefly discussed directly on the [Invaders page](https://chrisfrew.in/invaders), but I'll go into detail here.

### Block Data

So we know what an Invader is now. But how can exactly are we going to generate every possible binary string of length 15? We need to generate what I call in the code "block strings" (or `block_strings`).

I'll admit, I struggled for a while on how to do this without writing custom Python. I went immediately to the `itertools` library, trying to work some magic with the `permutations` and/or `combinations` functions, but Python kept thinking it should count each `0` in the list as unique, so I kept getting what I considered 'repeat' entries, for example: `'100000000000000'` and `'10000000000000'` - they of course appear identical to us, but not to Python :smile:) 

Anyway, after lots of Google and Stack Overflow, it turns out that there _is_ a one-liner that can do this, which actually _is_ in the itertools library, it's just a not-so-commonly seen method, `product()`:

```python
lInvaders = ["".join(seq) for seq in itertools.product("10", repeat=15)] # all binary combinations of 0s and 1s and length 15
```

Yep. That's it. `lInvaders` is a list with all 32,767 unique Invaders in it.

### Rank Data

I also had the idea to create a 'rank' for each Invader - the number of total activated blocks in the array of 15. In other words, counting how many `1`'s that were in the binary string.

One can imagine that for both ranks 1 and 14 there are 15 Invaders, since Rank 1 is the same as choosing any 1 of the 15 blocks and activating it, while Rank 14 is similar, but instead, 1 of the given 15 blocks is deactivated instead of activated. Rank 15 is also easy to imagine - there is only 1 combination - all 15 blocks activated. (As mentioned above in the description, I ignore the single Invader of Rank 0, because it is a 5 x 5 group of blocks with all blocks deactivated, thus it is an empty block.) 

However, for all the ranks from 2 to 13, trying to intuitively picture the number of Invaders becomes difficult. So I decided to add that into my code, by determining the count of `1`'s in each of the 32,767 Invader binary strings:

```python
lRanks = []
for i in range(0,len(lInvaders)):    
    lRanks.append(lInvaders[i].count('1'))
```

This form is simply a rank count for each Invader, so I needed to count all the ranks in the array by _collecting_ them. That can be done with, *gasp* the `collections` library:

```python
counter=collections.Counter(lRanks) 
```

Here's the contents of `counter` for your enjoyment.

| Rank |  Count | 
|------|--------| 
| 1    |  15    | 
| 2    |  105   | 
| 3    |  455   | 
| 4    |  1365  | 
| 5    |  3003  | 
| 6    |  5005  | 
| 7    |  6435  | 
| 8    |  6435  | 
| 9    |  5005  | 
| 10   |  3003  | 
| 11   |  1365  | 
| 12   |  455   | 
| 13   |  105   | 
| 14   |  15    | 
| 15   |  1     | 

I'm sure someone with a stronger mathematics background can provide the analytical solution for why this is, but I just left it as a vague concept of 'degrees of freedom', peaking at 7 and 8, allowed in the 15 character binary string, based on how many blocks that have to be activated. 

Additionally, if we add those counts up, we see it confirms my analysis of 2<sup>15</sup>-1 possible unique combinations, or 32,767 combinations. (Notice also that Rank 0 could be shown, and that would likewise have a count of 1 like Rank 15, but as I said above, I'm not counting that Invader because it is an empty block and wouldn't really display anything.)

### DataFrame and JSON Data Export

So we have all 32,767 binary strings and their rank. We need to just 'zip' these arrays together (and I sorted them by rank). This 'zipping' is very easy with the pandas `DataFrame` constructor: 

```python
oDataFrame = pd.DataFrame({'block_string': lInvaders, 'rank': lRanks})
oDataFrame = oDataFrame.sort_values(by=['rank'], ascending=True)
```

I opted to create both a full data JSON file for reference, and a separate JSON file, per-rank:

```python
oDataFrame.to_json(os.getcwd() + '/data/all_data.json', orient='records') # full data
for i, x in oDataFrame.groupby('rank'): # data per rank
    x.to_json(os.getcwd() + '/data/data_rank_{}.json'.format(i), orient='records')
```

### Complete Data Generation Code

And that's it for the data crunching! In the end, the total data generation Python script is only about 25 lines long:

```python
import itertools
import collections  
import pandas as pd
import os
  
lInvaders = ["".join(seq) for seq in itertools.product('10', repeat=15)] # all binary combinations of 0s and 1s and length 15

# now we can see how many invaders have what rank (number of times '1' occurs in a given invader string)
lRanks = []
for i in range(0,len(lInvaders)):    
    lRanks.append(lInvaders[i].count('1'))

# put blocks string and rank into dataframe
oDataFrame = pd.DataFrame({'block_string': lInvaders, 'rank': lRanks})
oDataFrame = oDataFrame.sort_values(by=['rank'], ascending=True)
oDataFrame.to_json(os.getcwd() + '/data/all_data.json', orient='records')

# json for each rank
for i, x in oDataFrame.groupby('rank'):
    x.to_json(os.getcwd() + '/data/data_rank_{}.json'.format(i), orient='records')

# print for counts of each rank
# counter=collections.Counter(lRanks) 
# print(counter)
```

As always, the most up-to-date version will be [on the repository](https://github.com/frewinchristopher/invaders-data).

## Frontend Development

So now that I had the data for my Invaders, I needed to create a p5.js canvas for each of the per-rank json files. Let's get started!

As it always seems to be with these fancy data algorithms, 99% of the 'magic' to generate the Invaders happens in a double for loop. In the original Java code it looks like this:

```java
for (int j=0;j<sz;j+=step) {
  m = 1;
  for (int i=0;i<sz/2;i+=step) {
    c = (random(1) > .5)? 255:0; //black or white?
    col[j][i]= c;
    col[j][i+(sz-step)/m] = c;
    m++;
  }
}
```

and in the converted React-ified JavaScript code:

```javascript
for (var j = 0; j < sz; j+=step) {
  var m = 1;
  for (var k = 0; k < sz / 2; k+=step) {
    this.c = (s.random(1) > .5)? 255:0; //black or white?
    this.col[j][k] = this.c;
    this.col[j][k+(sz-step)/m] = this.c;
    m++;
  }
}
```

For my project, it looks like I only needed to change that `c =` line, the line that defines if the given block in the Invader should be activated or not. Instead of using p5.js' `random()` function, I would need to load the "block string" for the given index of Invader. But let's take a step back. 

We know we need to somehow add in the JSON data we generated with Python. We _could_ hardcode the correct data file for a sketch of a given Invader rank, but that would involve creating 15 separate `sketch.jsx` files, 15 hard-coded `prop` setups in the `P5Wrapper/index.js`, and _finally_ writing out 15 <P5Wrapper> components in `App/index.jsx`. Yeah... I don't want to do that because it's horrible style, would be a nightmare to maintain, and it would be annoying and take forever.

It makes way more sense to pass our data down as a React `prop`. From the boilerplate repository, that `data` prop flows through the following files, like so:

`App/index.jsx -> P5Wrapper/index.jsx -> P5Wrapper/sketch1/index.jsx`  

In this case, the name `sketch1` is a bit misleading, since I will create multiple canvases from the single sketch, but I kept the file name conventions from boilerplate repository for anyone who may want to follow along and do the exact same.

So now the data is being passed down as a prop! The sketch object is simply `s`, so we can reference that prop with `s.props.data`. Recalling that the `data` prop is a list, we can write the color line as follows:

```javascript
for (var j = 0; j < sz; j+=step) {
  var m = 1;
  for (var k = 0; k < sz / 2; k+=step) {
    this.c = (s.props.data[this.number].block_string.charAt(position) === "1") ? 255 : 0;  // either filled with rank color or white
    position = position + 1;
    this.col[j][k] = this.c;
    this.col[j][k+(sz-step)/m] = this.c;
    m++;
  }
}
```

Where `this.number` is a property for which index a given Invader is (1 to 32,767) which is provided in an extended version of the constructor in the `Invader` class. If you're interested, the number property is set by creating invaders in a double for loop over all available x and y:

```javascript
...
let number = 0;
...
for (var y = padding; y < s.height-2*padding; y += (sz+padding)) {
  for (var x = padding; x < s.width-2*padding; x += (sz+padding)) {  
    if (number < iMaxInvaders) {
      var invader = new Invader(x, y, number);
      number = number + 1
      invaders.push(invader);
    }
  }
}
```

The Invader class itself is also refactored from the example code, but I'll leave look at that in detail to developers interested to look into the specifics of `P5Wrapper/sketch1/index.js`!

### Color By Rank

I extended this line even further, that instead of painting the Invader blocks with black or white, the color is based on the Invader's rank. So instead of hardcoding `255` in the ternary statement, we can use the rank portion oft he data, and replace it with `aColors[s.props.data[this.number].rank - 1]` which we've already generated from the Python / data side of things! So the final implementation in the 'magic' portion of the code looks like this:

```javascript
for (var j = 0; j < sz; j+=step) {
  var m = 1;
  for (var k = 0; k < sz / 2; k+=step) {
    this.c = (s.props.data[this.number].block_string.charAt(position) === "1") ? aColors[s.props.data[this.number].rank - 1] : oBackgroundColor;  // either filled with rank color or white
    position = position + 1;
    this.col[j][k] = this.c;
    this.col[j][k+(sz-step)/m] = this.c;
    m++;
  }
}
```

and `aColors` is a constant array of `s.color` objects, defined in directly in the sketch file `P5Wrapper/sketch1/index.jsx`: 

```
const aColors = [s.color(132, 94, 194), s.color(214, 93, 177), s.color(255, 111, 145), s.color(255, 150, 113), s.color(255, 199, 95), s.color(249, 248, 113), s.color(44, 115, 210), s.color(0, 142, 155), s.color(0, 143, 122), s.color(155, 222, 126), s.color(75, 188, 142), s.color(3, 149, 144), s.color(28, 110, 125), s.color(47, 82, 107), s.color(26, 36, 120)]
```

Again, I will leave that to developers interested in looking at the code to examine exactly what is going on in detail.

### The Last p5.js <-> React Caveat

Now that we've got our pre-generated data fed into our, . p5.js does this by using a specific ID per canvas. So, our final code will be looping over all ranks in our `App/index.jsx` file, and generating an ID that the canvas can use for the given rank. That code is at the top of the `render()` method and just before the `return(...)` statement:

```javascript
render() {
  let aElements = [];
  let canvasWidth = window.innerWidth > 690 ? 690 : window.innerWidth; // start width calculation for canvases at 690px, otherwise screen width
  for (var i = 0; i < 15; i++) {
    let canvasId = "canvas" + i.toString() + "-container";
    aElements.push(
      <div key={i}>
        <h3>Invaders of Rank {i+1} ({aData[i].length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Total):</h3>
        <P5Wrapper
            p5Props={{ data: aData[i], canvasId, canvasWidth }}
            onSetAppState={this.onSetAppState}
        />
      </div>
    );
  }
  return (
    ...
  )
  ...
}
``` 

and then we can reference that same ID in the `componentDidMount` method of the p5.js driven component, `P5Wrapper/index.jsx`:

```javascript
componentDidMount() {
    this.canvas1 = new window.p5(sketch1, this.props.p5Props.canvasId)
    this.canvas1.props = this.props.p5Props
    this.canvas1.onSetAppState = this.props.onSetAppState
}
```

and

```javascript
<div
    id={this.props.p5Props.canvasId}
    style={{ width: "100%", textAlign: "center" }}
/>
```

further down in the main `<div>` of the `render()` method. So, in the end, we are rendering 15 separate canvases, totalling up to our target of 32,767, but without hardcoding anything or maintaining 15 separate components!

Whew... we're done! That completes the deep-dive into code on this post!

### Give it a Try Yourself!

If you want to give it a shot yourself, you may want to add your own new columns from the (I'm sure a 'complexity' or 'sparsity' value could be generated for each Inavder - that would be another way to color Invaders! It might also be fun to look at invaders of different sizes, such as 6 blocks that are partially reflected, forming a 3 x 3 block, or 8 blocks partially reflected, forming a 4 x 4 block, and so on!)

## Links to the Code and Site

As always when I make big posts like these, the links to the repositories can be found below.

### Backend Code 

The backend code utilizes Python's Pandas and JSON modules to generate the JSON per rank:

[https://github.com/frewinchristopher/invaders-data](https://github.com/frewinchristopher/invaders-data)

### Frontend Code 

The front end code is a React app bootstrapped by `create-react-app`, using p5.js and served statically on `Node.js` with `express`:

[https://github.com/frewinchristopher/invaders](https://github.com/frewinchristopher/invaders)

### Final Site

As stated way above, the final site can be found here:

[https://chrisfrew.in/invaders](https://chrisfrew.in/invaders)

## Thanks!

As always, thanks for reading and I hoped you enjoyed this in-depth post. Get out there and start generating your own spin on Invaders!

I also think this **Data Challenge!**<sup>TM</sup> theme will return to my blog. It helps me develop as a software engineer, and makes for really interesting posts. I'll be making another **Data Challenge!**<sup>TM</sup> for sure, as soon as I find the next project enticing enough to tackle!

Cheers! :beer:

-Chris

## Footnotes

<div id="footnote-1">
1. Cuz, cmon, who <i>doesn't</i> do things in Javascript these days? :joy: (Yes, a bit of sarcasm, but honestly... it's been fairly true - we'll see what happens in 2019)
</div>
<div id="footnote-2">
<br/><br/>
2. Prefer to read on Medium? No you don't. There's no code highlighting, superscript, or awesome footnotes. (Like these :wink:)
</div>
<br/><br/>