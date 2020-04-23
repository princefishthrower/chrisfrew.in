---
title: How to Link to Lines of Code in a Github Repository!
description:
date: "2017-12-19"
draft: false
starID: 6
postType: dev
---

This'll be a real short one; I just learned you can link to specific lines of code on GitHub!

All you need to do is find your link to the source code preview (\*\*\*NOTE: _not_ the raw view!) as an example, let's look at a source file from Bitcoin repository*:

https://github.com/bitcoin/bitcoin/blob/c24337964f2d0500975abb4ef55c324daaf349b6/src/main.cpp

Let's say I want to highlight line 123. All you have to do is add a '#L' and the line number you want, so let's add #L123:

[https://github.com/bitcoin/bitcoin/blob/c24337964f2d0500975abb4ef55c324daaf349b6/src/main.cpp#L123](https://github.com/bitcoin/bitcoin/blob/c24337964f2d0500975abb4ef55c324daaf349b6/src/main.cpp#L123)

Go on. Give it a click. You know you want to! You'll see your browser jumps down and highlights that line.

<hr/>

\* `main.cpp` doesn't exist anymore in the current codebase; it has been reorganized into various other parts of the code, but as an example `main.cpp` is an attractive file name :smile:.
