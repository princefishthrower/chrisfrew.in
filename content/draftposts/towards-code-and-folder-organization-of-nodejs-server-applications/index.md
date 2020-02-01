---
title: Towards Code and Folder Organization of NodeJS Server Applications
description:
date: "2018-10-28"
draft: true
starID: 56
postType: dev
---

# Giant `index.js`'s Got You Down?

## Client Side Code

In client (read: frontend) code organization, I am pretty well versed in code organization. You've of course got your `/src` Even with state, if you use Redux, you ahve your `reducers/`, your `store` and your `actions/` folders and files. 

## Server Side Code

However, on server sided code, I find myself continually making ever larger `index.js` files for each of my projects. (And I'm sure many of us out there are guilty of that!). 

This habit of mine I believe developed simply from finding no authority on organization of nodejs backends - and even worse, not being able to find information like this readily avaliable in the first place! The only source I can remotely remember going into detail about code organization was a [nice scotch.io post at least about routing organization](https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers) by [Alex Sears](https://scotch.io/@searsaw). But that's just about routing. I want to organize ALL the things on the server side! GET and POST routes, socket callbacks, database work, and any other utils!

This post is an attempt to _be_ that authoritative post. 

What I'll do is post in on [the DEV.to community](https://dev.to), get clobbered there by master devs, and then update this post here and on medium towards a sort of organization encyclopedia.

It's amazing that the software/programming/developer communities haven't built - indeed, you always. But this is the _perfect_ use case for gists or a repository - full best practices. Perhaps I just haven't looked hard enough. Or perhaps this is just a pipe dream of mine, and it falls back to the required curse that is software engineering: every product, website, application, whatever it be, 

I suggest the following folders:

`routes/` for all your GET, POST, PUT, and DELETE statements
`postgresUtils/` for all your postgresql callbacks (obviously interchangeable to whatever database you use, be it mysql, I've seen in [this nice nodejs + postgresql + passport example](https://reallifeprogramming.com/node-authentication-with-passport-postgres-ef93e2d520e7) by [Bartek Witczak] (https://reallifeprogramming.com/@bartekwitczak?source=post_header_lockup), the folder `db/` is used. But, I find this a bit ambiguous, as one would have to actually open the code and look inside to see exactly what kind of database it is. Another thing I really like which I learned from Olawale Aladeusi on Codementor.io [Building a simple API with Nodejs, Expressjs and PostgreSQL DB -2](https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-and-postgresql-db-masuu56t7) is reducing your query to a single `index.js` file
`socketUtils/` for all your websocket callbacks
`utils/` like what is often seen in the frontend, but for any functions that are shared across

some important notes: we will also need a 