---
title: TypeScript, Redux Toolkit, React Hooks, and Gatsby
description: How to use the recommended Redux typings in harmony with your server side rendered frameworks.
date: "2021-08-03"
draft: false
tags: typescript, gatsby, react, redux, redux toolkit, react hooks, server side rendering
---

## Redux Toolkit

The software world has slowly been recognizing and migrating to the relatively new Redux Toolkit way of writing Redux. In short, the new way relies on writing single files or "slices", which combines types, actions, and reducers all into one. These responsibilities were traditionally separated into `actions`, `reducers`, and `types` files for each 'slice' - which originally made Redux so famous for it's boilerplate 😄.

## Current Redux with TypeScript Recommendations

As it is, the official docs for using TypeScript with Redux recommend defining the following two hooks:

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

These two custom hooks `useAppSelector` and `useAppDispatch` are _extremely_ powerful and helpful when using Redux hooks and TypeScript - you'll immediately get IntelliSense and type checking for the whole state tree of your app! They save you from creating some sort of `AppType` and importing it _every time_ when you need typing for your `useSelector` or `useDispatch` - which would be really annoying, and also breaking the "don't repeat yourself", or DRY principle. So we _really_ want to be able to use these hooks.

Let's also quickly review how to use Redux in Gatsby, my favorite static site generation framework of choice.

## Using Redux with Gatsby

Using Redux with Gatsby is a fairly challenging to do 100% correct, since the static pages, built from React components, are built in a server side (Node) environment. You _could_ try and use the typical `Provider` component around some sort of page - but the problem here is that your static pages are _not_ a single page application (SPA), and you won't be getting a fresh instance of your store every time a visitor would navigate to a new page on the app. This could potentially lead to undesirable bugs. To avoid this, we need to leverage Gatsby's `wrapRootElement` API, and call a function which configures the store and which we call only _once_ in this root element, so we are sure that the store is instantiated only once when React mounts. Gatsby recommends creating a `wrap-with-provider.jsx` file, which from the [official Gatsby 'using-redux' example](https://github.com/gatsbyjs/gatsby/tree/master/examples/using-redux), looks like this:

```jsx
import React from "react"
import { Provider } from "react-redux"

import createStore from "./src/state/createStore"

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  const store = createStore()
  return <Provider store={store}>{element}</Provider>
}
```

Note the calling of the `createStore()` function. This is critical to using Redux in a SSR framework as we will soon see.

We then import this wrapper component by putting identical code in both `gatsby-ssr.js` and `gatsby-browser.js`:

```javascript
import wrapWithProvider from './wrap-with-provider'

export const wrapRootElement = wrapWithProvider
```

## Defining AppDispatch and RootState

Back to those awesome hooks. To use those great and powerful hooks, the docs for Typescript with Redux Toolkit recommend you do the following:

```typescript
import { configureStore } from '@reduxjs/toolkit'
// ... <<other imports>>

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
```

But Gatsby needs a _callable function_ (as we saw in `wrap-with-provider.jsx` - this is the exact copy of the official [Redux and Gatsby example](https://github.com/gatsbyjs/gatsby/blob/master/examples/using-redux/wrap-with-provider.js) and they happen to use the name `createStore()`) when configuring store, like this:

```typescript
import { configureStore } from '@reduxjs/toolkit'
// ...

// 'createStore' should be a function.
// See https://github.com/gatsbyjs/gatsby/blob/master/examples/using-redux/wrap-with-provider.js
export const createStore = () => configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer,
  },
})
```

## The Problem - Instantiating the Store

This is our problem! Both `ReturnType<typeof store.getState>` and `typeof store.dispatch` from the Redux recommended code _won't_ work, since with Gatsby we can't use a variable `const store = ...` but rather must use a _function_ `const createStore = () => ...` instead.

## The Solution

Never afraid to reach out for help when I am truly stumped, I created a [Stack Overflow question](https://stackoverflow.com/questions/67539084/redux-toolkit-with-typescript-typing-rootstate-with-an-ssr-framework-like-gats). I quickly got an answer, that again reminded me of the powers of TypeScript. We can modify the typings by adding intermediate types `ConfiguredStore` and `StoreGetState`:

```typescript
type ConfiguredStore = ReturnType<typeof store>;
type StoreGetState = ConfiguredStore["getState"];
export type RootState = ReturnType<StoreGetState>;
export type AppDispatch = ConfiguredStore["dispatch"];
```

So, altogether, your `store/index.ts` with Gatsby should look like this:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import editorsReducer from './editors/editorsSlice'

const createStore = () => configureStore({
    reducer: {
        editors: editorsReducer
    }
})

type ConfiguredStore = ReturnType<typeof createStore>
type StoreGetState = ConfiguredStore["getState"]
export type RootState = ReturnType<StoreGetState>
export type AppDispatch = ConfiguredStore["dispatch"]

export default createStore
```

Perfect! We can keep the functional store declaration `createStore()` required by Gatsby, while still being able to export the types `RootState` and `AppDispatch` as recommended by the Redux docs!

## Thanks!

Hopefully you found this post helpful and learned how you can use the recommended Redux with TypeScript patterns for a server side rendered framework like Gatsby. 

Cheers!

Chris