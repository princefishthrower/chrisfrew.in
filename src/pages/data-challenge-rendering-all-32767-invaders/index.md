---
title: Data Challenge! Rendering all 32,767 Invaders!
date: "2018-12-31"
draft: false
starID: 104
postType: data
---

***This post is under active drafting!***

This post is also published on Medium, but was posted here first :smile:.

# Whew. A biggun'

Warning: This is gonna be a big post, with lots of thought processes and code snippets. I hope you enjoy!

# Processing and P5.JS

So the source that I started with. I realized I could generate these . Then I started getting frusterated with the Java syntax. It's been over 10 years since I coded any real Java, and that was my Junior year in Highschool... so yeah, I was looking for (hopefully) a Javascript possibility. And what do you know, there _is_ a library for processing

It just so happens that completely by chance, the very cover animation on the home page of my blog, which you may or may not know depending on how often you visit the blog - _is_ a p5.js animation! I didn't make the connection at first because I originally found that library through [this 'Show HN' post showcasing the library back at the end of August, 2018](https://news.ycombinator.com/item?id=17716542), and that 'circles bouncing around in a container' example is a pretty generic example which I just lightly refactored for my site.

## The Math

This is lightly discussed directly on the showcase page, but I'll go

A helpful analogy for me was to picture this array of 15 as 15 switches next to eachother, each being switch on or off at random, until you have every possible combination. In simplist terms, this can be realized as a binary list of length 15.

I'll admit, I struggled with this (mainly because I was getting Python thinking it should count each 0 as unique, so I kept getting what I considered 'repeat' entries for example '100000000000000' and '100000000000000' - they of course appear identical to us, but ptyhon was treating those separate 0's as in a different order) Anyway, after lots of Google and Stackoverflow, it turns out that the 

I decided ultimately to use JSON my de facto file format for loading data on the frontend.

Then, it's a simple 

as it always seems to be with these fancy data algorithms, 99% of the 'magic' to generate the Invaders happens in a double for loop. In the original Java code, it looks

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

```javascript

With react this is very easy, we can pass the data down as a prop into each canvas:

```javascript

```

## The Code

As always, here's the full code for big posts like these:

If you have experience with p5.js or Processing, you may find ways to extend what I've built.

Enjoy!

Then I said, forget that, I wanna do this in JavaScript. Cuz, cmon, who doesn't do things in Javascript these days? :joy: (Yes, a bit of sarcasm, but honestly... it's been fairly true - we'll see what happens in 2019) Anyway, the REAL reason I wanted to do it in Javascript was to get more practice with 



