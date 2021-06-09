---
title: "Advanced TypeScript: A Generic Function to Update and Manipulate Object Arrays"
description: "Another fancy generic function of ultimate power!"
date: "2021-06-09"
draft: false
tags: TypeScript, TypeScript Generics
---

import FullStackSaasProductCookbook from "../../../components/FullStackSaasProductCookBookLinks/FullStackSaasProductCookBookLinks"

# Always Pushing for Cleaner Code

While building my newest SaaS product, [ReduxPlate](https://reduxplate.com), I realized a common pattern kept cropping up in my array manipulation functions. I was always updating a specific value at a specific key, based on a specific test on some _other_ key.

<FullStackSaasProductCookbook/>

For example, for the editor widget on the [ReduxPlate homepage](https://reduxplate.com), I use a stateful array of type IEditorSettings to determine which editor is currently active and what the actual code value is in the editor: 

```typescript
export default interface IEditorSetting {
  fileLabel: string
  code: string
  isActive: boolean
}  
```

Such behavior required me to write two event handlers: 

`onChangeCode` for when the code changes:

```typescript
const onChangeCode = (code: string) => {
  setEditorSettingsState(editorSettingsState.map(editorSetting => {
    if (editorSetting.isActive) {
      editorSetting.code = code
    }
    return editorSetting
  }))
}
```

and `onChangeTab` for when the editor tab changes:

```typescript
const onChangeTab = (fileLabel: string) => {
  setEditorSettingsState(editorSettingsState.map(editorSetting => {
      editorSetting.isActive = editorSetting.fileLabel === fileLabel
    return editorSetting
  }))
}
```

Examine these two functions closely. With both, I am mapping over a state variable `editorSettingsState` and setting a property in the array according to some test condition. In the `onChangeCode`, the test condition is if the `isActive` property value is true. In `onChangeTab`, the test condition is if `fileLabel` property value matches the `fileLabel` passed in. As opposed to `onChangeCode`, `onChangeTab` will set the `isActive` value for _all_ items in the array.

With a bit of effort, we should be able to implement a generic function that we can use to replace these functions, and more importantly: reuse throughout our applications anywhere we need the same type of functionality.

# Rewriting Both Functions for a Better Overview of Their Structure

To get a better idea of the function we will write, let's expand the two functions with an `else` statement, while keeping their functionalities exactly the same. 

For `onChangeCode`:

```typescript
const onChangeCode = (code: string) => {
  setEditorSettingsState(editorSettingsState.map(editorSetting => {
    if (editorSetting.isActive) {
      editorSetting.code = code
    } else {
        // do nothing :)
    }
    return editorSetting
  }))
}
```

and for `onChangeTab`:

```typescript
const onChangeTab = (fileLabel: string) => {
  setEditorSettingsState(editorSettingsState.map(editorSetting => {
      if (editorSetting.fileLabel === fileLabel) {
        editorSetting.isActive = true
      } else {
        editorSetting.isActive = false
      }
    return editorSetting
  }))
}
```

In this form, it's clear that our generic function should have some sort of test criteria, which will live in the `if` statement. Then we need the key and value of the property which is to be updated in the array if the test criteria passes. Furthermore, what occurs in the `else` block should be optional - that is, there should be an optional way to set a default value if the test fails. Really what this means is that this will become an `else if` block.

The body of our new generic function would then take on the same type of form as these two expanded functions:

```typescript
return array.map(item => {
    if (item[testKey] === testValue) {
      item[updateKey] = updateValue
    } else if (testFailValue !== undefined) {
      item[updateKey] = testFailValue
    }
    return item
})
```

We'll need to provide a `testKey` and value as our test criteria, as well as an `updateKey` and `updateValue` if the test passes. Finally, an optional parameter will be `testFailValue`. If `testFailValue` is not `undefined`, then we will execute the `else if` block.

# Typing the Function

The most challenging part of writing this function was ensuring that the value passed for `testValue` matches the expected type of `T[testKey]`. The same should be true for `updateValue` /  `testFailValue` with `T[updateKey]`. With TypeScript, it _is_ possible to do this, though we'll need to explicitly provide a bit of information in the calling signature in order to enforce it. Our `array` in question is of type `Array<T>`, that much is clear. But what about the types for `testKey` and `updateKey`? We'll need to introduce two more generic types to get those to work, `U` and `V`. To ensure that both `testKey` and `updateKey` are actual keys of object `T`, we'll employ TypeScripts's `extends` keyword, i.e. defining `U` as `U extends keyof T`, and `V` as `V extends keyof T`. 

With types `U` and `V` defined, `testKey` and `updateKey` can be defined by `keyof T`, as well as their corresponding values: `testValue` as `T[U]`, and `updateValue` as `T[V]`. `testFailValue` follows `updateValue` with the identical type `T[V]`. Finally, since this is an array function `map`, we'll be returning a fresh array of type `T`. Because this signature is rather complex, I add them all to a `param` object so that when we call this `updateArray` function, it will be easy to read and understand. Such a structure also makes it easier to extend and add additional parameters later.

So, we have our function signature:

```typescript
export const updateArray = <T, U extends keyof T, V extends keyof T>(params: {
  array: Array<T>
  testKey: keyof T
  testValue: T[U]
  updateKey: keyof T
  updateValue: T[V]
  testFailValue?: T[V]
}): Array<T>
```

# Final Result

Hooking in the `map` logic from above, the full `updateArray` function in full is:

```typescript
// Updates an object array at the specified update key with the update value,
// if the specified test key matches the test value.
// Optionally pass 'testFailValue' to set a default value if the test fails.
export const updateArray = <T, U extends keyof T, V extends keyof T>(params: {
  array: Array<T>
  testKey: keyof T
  testValue: T[U]
  updateKey: keyof T
  updateValue: T[V]
  testFailValue?: T[V]
}): Array<T> => {
  const {
    array,
    testKey,
    testValue,
    updateKey,
    updateValue,
    testFailValue,
  } = params
  return array.map(item => {
    if (item[testKey] === testValue) {
      item[updateKey] = updateValue
    } else if (testFailValue !== undefined) {
      item[updateKey] = testFailValue
    }
    return item
  })
}
```

A possible improvement to add to this function might be to differentiate between the `updateKey` on success and on fail. Perhaps in some rare case you would want to set the value of some other key if the test fails.

# Use It!

Let's return to our original functions and refactor them to use our fancy generic function `updateArray`.

Referring to `IEditorSetting` above may be helpful (recall that `editorSettingsState` is an array of `IEditorSetting`). Here's the refactored `onChangeCode`:

```typescript
const onChangeCode = (code: string) => {
  setEditorSettingsState(updateArray({
    array: editorSettingsState,
    testKey: "isActive",
    testValue: true,
    updateKey: "code",
    updateValue: code,
  }))
}
```

and `onChangeTab`:

```typescript
const onChangeTab = (fileLabel: string) => {
  setEditorSettingsState(updateArray({
    array: editorSettingsState,
    testKey: "fileLabel",
    testValue: fileLabel,
    updateKey: "isActive",
    updateValue: true,
    testFailValue: false,
  }))
}
```

Thanks to our `U extends keyof T` and `U extends keyof T`, our function is type safe: for example, TypeScript won't allow passing a string like `"hello world"` to `updateValue`, since the expected type for the `IEditorSetting` on the `isActive` key is `boolean`.

Congratulations, we're done! 

# Verbosity vs. Reusability and Readability

Indeed, calling `updateArray` is rather verbose. However, this is a small price to pay when you consider that we no longer have to think about crafting all those pesky `map` manipulations throughout our apps!

Is this an over-optimization? I don't think so - take a look at your own projects using either React or Redux, or both. I guarantee you have the same times of array mapping and manipulations, either in your state changes or render functions!

# Thanks!

With this powerful generic function, you should never need to think about `map` array manipulations at a property level ever again! Additionally, the strongly typed signature also protects you from passing either a `testValue` or `updateValue` that doesn't correspond with its respective key's expected type!

Cheers! 🍺

-Chris
