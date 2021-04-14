---
title: "Introducing the Full Stack Typing Boilerplate: Once You ORM, You Can't Go Back!"
description: "Featuring Typescript and Sequelize: share types between the front- and back- ends for ultimate development productivity."
date: "2020-05-12"
tags: typescript,orm,Node.js
---

_[This post is mirrored on my Medium account.](https://medium.com/@frewin.christopher/introducing-the-full-stack-typing-boilerplate-once-you-orm-you-cant-go-back-e97b53a36f)_

99% of the time when you do anything in the software world you need an API.

Very often (maybe always :thinking:) the API needs to be able to execute a few CRUD operations (**C**reate, **R**ead, **U**pdate, and **D**elete) at the database level.

For a few years, the 'cutting edge' of getting an easy-to-use database connection in Node.js looked something like this: 

- You'd have a `db/index.js` file with your connection settings 
- Your connector would look something like this (in this example I am using package `pg` for PostgreSQL):

```typescript
const { Pool } = require("pg")

const pool = new Pool({
    user: process.env.YOUR_DB_USER,
    host: process.env.YOUR_DB_HOST,
    database: process.env.YOUR_DB_NAME,
    password: process.env.YOUR_DB_PASSWORD,
    port: process.env.YOUR_DB_PORT,
})

/**
 * DB Query
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 */
function query(text, params) {
    return new Promise((resolve, reject) => {
        pool.query(text, params)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.query = query
```

You'd then use the `db` module and pass in your (nearly) raw SQL statements like so:

```typescript
const db = require("../db")
const email = "test@test.com"
const userSelectPromise = db.query("SELECT * FROM users WHERE email = $1", [
    email,
])
Promise.resolve(userSelectPromise).then(userSelect => {
    if (userSelect && parseInt(userSelect[0].rowCount) > 0) {
        const username = userSelect.rows[0].username
        // etc...
    }
})
```

Now, feel free to copy and paste that code, it'll work for you...

:warning: **But I wouldn't recommend using it!** :warning:

It's certainly not a state of the art way of doing things anymore. A few things are glaringly clear from this method:

-   Lots of non-null and size checks required in order to finally get at the values you want
-   Clunky promise syntax
-   Perhaps most heinous: raw SQL queries :scream: - in this case, it's not so much of a security issue, as `pg` will still be properly escaping parameters, but it's bad in the case of developer experience - hard to read, hard to write, and syntax error-prone!

At some point during the quarantine / lockdown / shelter-in-place I asked myself,

> Certainly someone has abstracted all these checks and promise / async stuff away, right?

And,

> It's 2020... there's gotta be a way to query a database without writing raw SQL, right?

Of course there is!

# Introducing Sequelize

Over time in the software world, boilerplate code tends to be organized carefully and abstracted away, often becoming a package. For connecting and executing SQL in JavaScript, that package is [Sequelize](https://github.com/sequelize/sequelize). Out of the box, Sequelize can save you so much time and spare you so many headaches for any tasks related to SQL you may need to accomplish. Cheers 🍻 and respect to the [authors, maintainers, and contributors](https://github.com/sequelize/sequelize/graphs/contributors)!

If you take a step further and add TypeScript's static typing to the `sequelize` mix, you have an even _stronger_ workflow with the ability to map a class - AKA a model - to a table! In fact, that's exactly what an ORM is: **O**bject **R**elational **M**apping. I remember the moment I realized all tables could be represented 1:1 through a class...

<br/>
<div align="center"><b>My life was forever changed as a software engineer.</b></div>
<br/>

As the title states, once you ORM, you can't go back. It just makes things too easy. I'll prove it, too! At the end of this post, I'll give a bonus tutorial to show that you can add API endpoints in _literal minutes_! You can even be confident you haven't made any silly SQL syntax errors or typing errors - they are all handled or checked by either Sequelize or TypeScript! No more scratching your head at SQL errors, no more hunting down what the heck return type that query is supposed to be!

Also note, from here on out in this post, when I mention the word 'model', it is interchangeable with the word 'table'! 😊

# Getting Started

During my initial research into upgrading a REST API for one of my projects, I found [this post by Loren Stewart](https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins). The post features a nice organization pattern to combine numerous API models into a single class. However, since it was posted in 2016, it is now a bit dated. (I know, I wince to hear it myself that a post merely 4 years old is 'dated', but that’s software 🤷‍♂️). I’ve converted his organization pattern from JavaScript to a TypeScript equivalent with help from the [newest version of the Typescript documents from Sequelize](https://sequelize.org/master/manual/typescript.html).

:trumpet: :angel: Hark! I bring you a <b>Modern API Backend Framework for 2020<sup>TM</sup></b>!

# Creating Our First Model

Let's start with creating a model for our `users` table, since we didn't even _have_ such a definition with our old JavaScript way of doing things. Here’s how we define a model (_think table_) the TypeScript way:

```typescript
import { Model, DataTypes, Sequelize, BuildOptions } from "sequelize"
import IUser from "../../shared/interfaces/IUser"

type UsersStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUser
}

const sequelize = new Sequelize(
    process.env.YOUR_DB_NAME,
    process.env.YOUR_DB_USER,
    process.env.YOUR_DB_PASSWORD,
    {
        host: "localhost",
        dialect: "postgres",
    }
)

const users = <UsersStatic>sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
})
```

You may need to provide `// eslint-disable-next-line @typescript-eslint/consistent-type-assertions` above the `<UserStatic>` casting line depending on your formatter and/or linter rules. These complex typings follow the guidance of `sequelize`'s very own [TypeScript documentation](https://sequelize.org/master/manual/typescript.html). `IUser` is simply an interface defining the columns in our `user` table. Take note of it now - while being a rather simple interface, it will be _very_ 😉 useful to us later:

```typescript
export default interface IUser {
    id: number
    email: string
    username: string

    createdAt: Date
    updatedAt: Date
}
```

Note that `createdAt` and `updatedAt` come by default with the Sequelize `define()` function, so we don't have to declare them in our model definition. 

Sticking with our user select example, let's see how to make a select statement with our new `User` model. Just for illustration and example, we can just write a query directly after declaring `users`:

```typescript
import { Model, DataTypes, Sequelize, BuildOptions } from "sequelize"
import IUser from "../../shared/interfaces/IUser"

type UsersStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUser
}

const sequelize = new Sequelize(
    process.env.YOUR_DB_NAME,
    process.env.YOUR_DB_USER,
    process.env.YOUR_DB_PASSWORD,
    {
        host: "localhost",
        dialect: "postgres",
    }
)

const users = <UsersStatic>sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
})

// --> new code: query example
const user = users.findOne({
    where: {
        email: {
            [Op.eq]: email,
        },
    },
})

if (!user) {
    console.log('User not found!')
}

if (user) {
    console.log('User is:')
    console.log(user)
}
// <-- end new code
```

Pretty 🌶️ spicy 🌶️, right? We just jumped about 4+ years in software technology!

Note here the `[Op.eq]:` is not necessary. The alternative is to just use a colon. In `sequelize` a colon means `=`, i.e. if we want the email column to be equal to the `email` variable, we could write:

```typescript
where: {
    email: email
}
```

using shorthand object syntax, we could even reduce it to:

```typescript
where: {
    email
}
```

but this is a slippery slope. I'm often using a variety of operations in my queries, so I've usually already imported the `Op` object anyway. 

I find the `[Op.eq]` representation more explicit in describing exactly what is going on.

# Centralize the Models!

So we've got our nice typed model, but few APIs have only a single table their structure. It's easy to imagine, then, how much of a pain it would be to always declare the `sequelize` object _and_ repeatedly provide the model definition every time we need to make a query on a table.

It would be nice if we could do all those initialization steps once and organize all the models into a centralized class, right? Then we would access only _that_ class wherever all our other API logic exists. (Hats off to [Loren Stewart's post](https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins) for this organization idea!)

This organizational step will also be very helpful if we later need more complex `JOIN` queries - we will have all the tables immediately available for easy reference and usage!

To get started with this centralization, we need to slightly refactor our `user` model definition. We want to take the example query out, wrap the declaration in a function that accepts the `sequelize` object, and have that function return the `users` model. The `users` model file looks like this now:

```typescript
import { Model, DataTypes, Sequelize, BuildOptions } from "sequelize"
import IUser from "../../shared/interfaces/IUser"

type UsersStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUser
}

export default function Users(sequelize: Sequelize) {
    const users = <UsersStatic>sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
    })
    return users
}
```

Now, let's assume we've created an additional model, called `posts`. We would go through the same model definition and interface declaration process as we did for `users` - wrapping the `posts` model in a function that accepts the `sequelize` object and exports it just the same.

Now, we want to import our two models, `users` and `posts`, into our centralized class that we can use everywhere. We want to initialize the `sequelize` object only once, and pass it into all of our models. We can create a class, `DB` that does just that:

```typescript
import { Sequelize } from "sequelize"
import Users from "../models/Users"
import Posts from "../models/Posts"

class DB {
    // create sequelize connection
    public static readonly sequelize = new Sequelize(
        process.env.YOUR_DB_NAME,
        process.env.YOUR_DB_USER,
        process.env.YOUR_DB_PASSWORD,
        {
            host: "localhost",
            dialect: "postgres",
        }
    )

    // initialize models by passing sequelize into our model definition functions
    public static readonly users = Users(DB.sequelize)
    public static readonly posts = Posts(DB.sequelize)
}

export default DB
```

Now, to the keen relational database user, you may notice a crucial piece of information is missing here. Model `posts` is probably related to model `users`, right? It's probably what we call a _one-to-many_ or _1:n_ relationship. Like everything else so far, we should find a way to define this relationship only once. To do that, we can create a `setRelations()` function to define these relations before we `export` the `DB` class. Now the full `DB.ts` file becomes:

```typescript
class DB {
    // create sequelize connection
    public static readonly sequelize = new Sequelize(
        process.env.YOUR_DB_NAME,
        process.env.YOUR_DB_USER,
        process.env.YOUR_DB_PASSWORD,
        {
            host: "localhost",
            dialect: "postgres",
        }
    )

    // initialize models by passing sequelize into our model definition functions
    public static readonly users = Users(DB.sequelize)
    public static readonly posts = Posts(DB.sequelize)
}

// --> new code: setRelations() function
function setRelations(): void {
    /////////////////
    // One-To-Many //
    /////////////////

    // Users and Posts One-To-Many Relationship
    DB.users.hasMany(DB.posts, { foreignKey: "userId" })
    DB.posts.belongsTo(DB.users, { foreignKey: "userId" })
}

setRelations()
// <-- end new code

export default DB
```

In this case, table `posts` would need to have column `userId` (as you can see in the [example code repository](https://github.com/princefishthrower/full-stack-typing-boilerplate)). Now Sequelize will know that tables users and posts have a one-to-many relationship and we can easily create `JOIN` statements with the two.

# Using It! (Backend)

Nice, we’re basically done! The new way to use our `DB` class is the following (still sticking with the user query on the `users` table):

```typescript
import DB from "../DB"
import { Op } from "sequelize"

const email = "test@test.com"
const user = await DB.users.findOne({
    where: {
        email: {
            [Op.eq]: email,
        },
    },
})

if (!user) {
    // TODO: real error logging and handling
    console.log("error")
}

const username = user.username
// more logic...
```

To show a `JOIN` example, let's get all posts for a given user, via the Sequelize `include` directive. Since we've defined our one-to-many relationship already, this `JOIN` becomes a one-liner (yeah, okay, technically a 5-liner - but you could put it on one line if you wanted 😉 😂):

```typescript
import DB from "../DB"
import { Op } from "sequelize"

const email = "test@test.com"
const userWithPosts = await DB.users.findOne({
    where: {
        email: {
            [Op.eq]: email,
        },
    },
    // This is all it takes to JOIN on table posts! Sequelize knows the JOIN should be on column userId!
    include: [
        {
            model: DB.posts, 
        },
    ],
    // <-- end include
})

if (!userWithPosts) {
    // TODO: real error logging and handling
    console.log("error")
}

const posts = userWithPosts.posts
```

The resulting `userWithPosts` object will then have a nested structure, with the full `user` object in the highest level, but with an additional key `posts` that has that user's posts, of type `Array<IPosts>`. In such cases, it is useful to define a new interface with that exact typing (remember, we assume a `IPosts` has been written already):

```typescript
import IUser from "./IUser"
import IPost from "./IPost"

export default interface IUserWithPosts extends IUser {
    posts: Array<IPost>
}
```

It's a good habit to get into to explicitly type the response from the `findOne()` call:

```typescript
...
import IUserWithPosts '../../shared/interfaces/IUserWithPosts';
...
const userWithPosts: IUserWithPosts = await DB.users.findOne({ ... });
```

If it were a `findAll()` call, for example finding all posts from all users (a toy example - who knows if you would actually need it, maybe you would for something 🤔), the return type becomes the array version of that type:

```typescript
...
import IUserWithPosts '../../shared/interfaces/IUserWithPosts';
...
const usersWithPosts: Array<IUserWithPosts> = await DB.users.findAll({ ... });
```

With this setup, you have an easy way to plug it into a router as you define your endpoints. Essentially you return a HTTP 404 if the record is not found, and a HTTP 200 success if it is! More in [the example code repository](https://github.com/princefishthrower/full-stack-typing-boilerplate).

# Using It! (Frontend)

Remember I said to take note of that interface `IUser`? When we are doing frontend development, we can reliably type all of our API requests! That means:

<br/>
<div align="center"><b>The frontend and backend share a single source of truth for their typing!</b></div>
<br/>

When I first realized this was possible with TypeScript, I was amazed by the implications this has for productivity by greatly reducing syntax and runtime errors. 

It's so easy to track data flows when a single model and interface define your data - whether you find yourself on the backend or the frontend.

I don't really care what the `vim` guys say; if you have a setup like this and are using a modern editor that has IntelliSense, you can dig into an API's full type definition with just a few clicks - again, whether you start from a backend or a frontend file.

As a frontend example, here's a `fetch()` call which we can type using our interface:

```typescript
...
import IUser '../../shared/interfaces/IUser';
...
// IUser typed result
try {
    const response = await fetch('https://your-api-url.com/get-user?email=test@test.com');
    if (response.status === 200) {
        const json = await response.json();
        const user: IUser = json.user;
        // user has all properties IUser has
    }
} catch (err) {
    console.log(err)
}

// IUserWithPosts typed result
...
import IUserWithPosts '../../shared/interfaces/IUserWithPosts';
...

try {
    const response = await fetch('https://your-api-url.com/get-user-with-posts?email=test@test.com');
    if (response.status === 200) {
        const json = await response.json();
        const userWithPosts: IUserWithPosts = json.userWithPosts;
        // userWithPosts has all properties IUserWithPosts has
    }
} catch (err) {
    console.log(err)
}
```

Of course in the response object you would have to pass an object with key `user` in the first example and `userWithPosts` in the second example - see the [example code repository](https://github.com/princefishthrower/full-stack-typing-boilerplate).

# Final Takeaway: Full Stack Organization!

You may have noticed that this full stack typed framework suggests three general areas, perhaps best collected into folders:

-   `backend/` - routing, database queries, etc.
-   `shared/` - interfaces, enums, types, etc.
-   `frontend/` - views, components, styles, etc.

Depending on a number of factors including the size and scope of your project, you may want to set up a repository for each 'area', or put all three 'areas' as folders in the same repository. I'll keep it collected in a single repository the same as the [example code repository](https://github.com/princefishthrower/full-stack-typing-boilerplate).

# Code Repository

There’s an [example repository here](https://github.com/princefishthrower/full-stack-typing-boilerplate), which includes the frontend, backend, and shared areas. Please read the README once you get there!

You may also want to take a look at the [typescript-rest-boilerplate](https://github.com/vrudikov/typescript-rest-boilerplate) for additional backend implementation ideas and organization - though note that boilerplate does not include a frontend side of things.

Do you know any other boilerplates or frameworks that have a framework like mine? I'd be curious to know. Leave a comment below!

# 🥳BONUS!🥳

_This section is an extension of this post and no longer includes the essential information and concepts. It takes a jump due to the introduction of an express router on the backend and a React app on the frontend. Interested readers are of course very welcome to read on!_

I mentioned I would do a walkthrough of how to add an API endpoint in this type of framework, in what I quote as:

> literal minutes

Let's see if I can hold up my end of the deal. I'm using the [example code repository's](https://github.com/princefishthrower/full-stack-typing-boilerplate) layout as a starting point - feel free to use that and follow along, or better yet, clone it and code along! 👩‍💻👨‍💻

Ready?!

On your marks ⌚, get set 🤨, go :rocket:!

### Minute 1: The Scenario / Spec

Let's build a simple user search, accessible at `/user-search`, and expects query parameter `username` with the username (note we will allow partial names and leverage the `LIKE` SQL operator). It should return a HTTP 400 code if the `username` parameter is not provided, a 404 if no user is found, and a 200 otherwise (when results are found).

### Minute 2: Add Route to Router

First, we add our route to `Router/Router.ts`, and pass it to a function, say `userSearch`:

```typescript
Router.get("/user-search", GetRoutes.userSearch)
```

### Minute 3: Write User Search Function

We need to write the actual `userSearch` function. We add it to `Router/get/Users.ts` file, since the table we need to access is `users`:

```typescript
export async function userSearch(req: express.Request, res: express.Response) {
    // return 400 if username parameter not provided
    if (req.query.username === null) {
        return res.status(400).send("Username parameter not provided");
    }

    const users: Array<IUser> = await DB.users.findAll({
        where: {
                username: {
                    [Op.like]: '%' . req.query.username '%',
                },
            },
        }
    );

    if (users.length === 0) {
        return res.status(404).send("No users found! :(");
    }

    // send a 200 response with user data keyed as 'users'
    return res.status(200).send({ users });
}
```

### Minute 4: Write Frontend Component Using Route

And on the frontend, under `components/SearchUsers.tsx`, you could build the following React functional component and use `fetch`. Note the URL in the `fetch` call is hardcoded, as it is the most simple illustration:

```typescript
import React, { useState, useEffect } from "react"
import IUser from "../../../shared/interfaces/IUser"
import Constants from "../../../shared/Constants/Constants"

export default function GetUser() {
    const [users, setUsers] = useState<Array<IUser> | undefined>(undefined)

    useEffect(() => {
        if (!users) {
            searchUsers()
        }
    })

    const searchUsers = async () => {
        try {
            const response = await fetch(
                Constants.API_URL + "/search-users?username=tes"
            )
            if (response.status === 200) {
                const json = await response.json()
                setUsers(json.users)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            {users ? (
                <ul>
                    {users.map(user => {
                        return <li>{user.username}</li>
                    })}
                </ul>
            ) : (
                "Searching..."
            )}
        </>
    )
}
```

Whew, that was fast! Less than 5 minutes! 🥵 I'm sweatin'!

I know, I know, of course in the functional component you would build an interactive input and render the corresponding list of users found, but my _literal minutes_ claim was about building an API endpoints. That DOESN'T include frontend components 😉. 

So, was that _literal minutes_? I think so! 😊

# Thanks!

I hope this post helps make your full stack application development much more enjoyable! 

I know that I've been having an absolute blast with this setup! :rocket: :rocket: :rocket:

Cheers! 🍺

-Chris
