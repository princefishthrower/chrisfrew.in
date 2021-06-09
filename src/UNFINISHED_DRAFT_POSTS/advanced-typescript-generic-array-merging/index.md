---
title: "Advanced TypeScript: A Generic Function to Merge Object Arrays"
description: "Yet another powerful generic function."
date: "2021-06-10"
draft: false
tags: TypeScript, TypeScript Generics
---

import FullStackSaasProductCookbookLinks from "../../../components/FullStackSaasProductCookBookLinks/FullStackSaasProductCookBookLinks"

# TypeScript Generics Madness

This post will following what I thought was a very elegant solution in my previous post on [building a generic function to update an array at a specific key according to a specific test value](/blog/advanced-typescript-a-generic-function-to-update-and-manipulate-object-arrays/). As I continue to try and maintain the cleanest codebase as possible for [ReduxPlate](https://reduxplate.com), I continue to see the power of these easy to use generic functions, and how much repetitive code they save me from.

<FullStackSaasProductCookbookLinks/>

# Motivation

Often when doing state modifications, you want to merge or add some properties to an object that you get from an API. You **could** explicitly write key / value assignments for the keys that you want to update... or you can leverage JavaScript's built in `Object.assign` function and leverage TypeScript generics to only write one such function for all merging actions you need across your entire app! 😄

# The Typing

let us assume there is some object of type T, and some more complex object type U which extends T. We want to merge an array of objects of type T into an array of objects of type U. We shouldn't necessarily assume either of this arrays are organized, or even the same length. Therefore we need to ensure we are merging the proper object over some sort of `matchKey`. We'll only 

```typescript
export const mergeArrays = <T, U extends T>(params: {
  mergeArray: Array<T>
  existingArray: Array<U>
  matchKey: keyof T
}): Array<U> => {
  const { mergeArray, existingArray, matchKey } = params
  return existingArray.map(existingItem => {
    const match = mergeArray.find(
      mergeItem => mergeItem[matchKey] === existingItem[matchKey]
    )
    if (match) {
      return Object.assign(existingItem, match)
    }
    return existingItem
  })
}
```

# Thanks!

As always, thanks for reading and stay tuned - there will be more of these powerful generic functions to come, and combined with my [generic search, sort, and filter functions] - I'm starting to build the groundwork to write a small Advanced TypeScript Cookbook about all of them.

Cheers! 🍻

Chris