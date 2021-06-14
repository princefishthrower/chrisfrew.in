---
title: "Advanced TypeScript: A Generic Function to Merge Object Arrays"
description: "Another powerful generic function from the SaaS product archives."
date: "2021-06-14"
draft: false
tags: TypeScript, TypeScript Generics
---

import FullStackSaasProductCookbookLinks from "../../../components/FullStackSaasProductCookBookLinks/FullStackSaasProductCookBookLinks"

# TypeScript Generics Madness!

I just can't stop writing these generic functions! This is another powerful generic function that follows my previous post on [building a generic function to update an array at a specific key according to a specific test value](/blog/advanced-typescript-a-generic-function-to-update-and-manipulate-object-arrays/). As I try and maintain the cleanest codebase as possible for [ReduxPlate](https://reduxplate.com), I continue to find new use cases for these easy-to-use yet powerful generic functions.

<FullStackSaasProductCookbookLinks/>

# Motivation

Often when doing state modifications, you want to merge or add some properties to an object that you get from an API or some other source. You **could** explicitly write key / value assignments for the keys that you want to update... or you can leverage JavaScript's built in `Object.assign` function and TypeScript's generic capabilities to only write one such function for all merging actions you need across your entire app! 😄

For example, in ReduxPlate, I have two types, `IFile`, and `IEditorSettings`:

`IFile`:

```typescript
export default interface IFile {
    fileLabel: string
    code: string
}
```

`IEditorSettings`:

```typescript
export default interface IEditorSettings extends IFile {
  isActive: boolean
}
```

`IEditorSettings` extends `IFile` and has just one additional property: `isActive`. When visitors click the "Generate!" button on the MVP page, the response from the server returns an array of objects of type `IFile` instead of `IEditorSettings`, since the server is not concerned with the `isActive` property. `isActive` only concerns the frontend for display purposes. I then merge the `IFile` array into the existing `IEditorSettings` array, to update the code without modifying the existing values of `isActive`. Let's look at the first iteration of how I wrote this functionality.

# Naïve Implementation

An initial implementation can be put together quickly enough. The `fileLabel` acts as key which we can compare our objects on. I then replace the value of `editorSetting.code` with the `match.code` value returned by the matching file (if a match was found):

```typescript
const editorSettings = useState(...) // existing object array of IEditorSettings, stateful
const files = <<API fetch code here>> // array of IFile returned by API
...
editorSettings.map(editorSetting => {
  const match = files.find(
    file => file.fileLabel === editorSetting.fileLabel
  )
  if (match) {
    editorSetting.code = match.code
  }
  return editorSetting
})
```

What if more properties are built into `IFile` later? Perhaps an array of imports or warnings on each file? These would also be properties we want to merge into the existing state. It would be best if we could just add these properties to `IFile`, and not have to manually edit the code in the `if` block above. Let's craft a generic util function to do this merging task for _any_ two object arrays with related types.

# Generic Typing

Let us assume there is some object of type `T`, and some more complex object type `U`, where `U extends T`. We want to merge an array of objects of type `T` into an array of the more complex objects of type `U`, and return a new array of type `U`. We shouldn't necessarily assume either of these arrays are organized, or even the same length. Therefore, we need to ensure we are merging the proper object on some sort of `matchKey`, which will have to be `keyof T`, since some keys in `U` may not exist in `T`. With `matchKey` defined, we should only need the other two arrays, the existing and incoming array, to define this function's signature:

```typescript
export const mergeArrays = <T, U extends T>(params: {
  mergeArray: Array<T>
  existingArray: Array<U>
  matchKey: keyof T
}): Array<U>
```

Here I leverage the `params` pattern as I did in the [updateArray](/snippets/#updateArray) function, as it makes the calling code easier to read.

## Implementation

We can pull off all the params from the `params` object. Then, we loop over the existing array and attempt to find a match on the `matchKey`. If we do, we assign all values in that matched object to the existing object. If not, we simply preserve that existing item by returning it:

```typescript
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
```

# Final Result

Combining the function signature and the body, I present to you the `mergeArrays` utility function:

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

As always, thanks for reading, and stay tuned 📻 - there will be more of these powerful generic functions to come! Combined with my [generic search, sort, and filter functions](/blog/react-typescript-generic-search-sort-and-filters/) - and a few other secret goodies I've got hiding in the code of my other projects - I'm thinking I'll publish some sort of "Advanced TypeScript Cookbook" 📘 that includes all of them!

Cheers! 🍻

Chris