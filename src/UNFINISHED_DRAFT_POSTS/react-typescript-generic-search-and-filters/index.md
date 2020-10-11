---
title: "React and TypeScript: Generically Typed Search, Sorters, and Filters"
description: A step-by-step guide leveraging the awesome powers of TypeScript to improve both code and performance.
date: "2020-09-22"
---

# Example Repository

Don't wanna read; just gimme the code! [The example repository is here]().

# Motivation

In a recent project I was tasked to implement a simple frontend filter and search function. However, the task also required that the sort and filter functions could easily be applied to any type. Luckily, I've been using [generics](https://www.typescriptlang.org/docs/handbook/generics.html) quite a bit (and slowly getting better with them!), but I particularly impressed myself (and my collegue) with the lightweight, though completely reusable solution I found. 

I figure I'd share this solution with all of you. Enjoy!

# First: Generic Search!

Let's dive into the search function first, since it's the simpler of the two. 

Let us assume we have an API endpoint that returns a list of type `T`. With a search, typically, we want to be able to query on (potentially) multiple properties of `T`, and have the search return an element if at least one of those properties matches. So, composing such a function we need the object itself, the properties we want to search on, and the query. 

This is a perfect use case for [JavaScript's `Array.prototype.filter()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), which accepts an object from the array calling it and returns either true or false.

We'll also need the query itself in our function, to match the actual values of our object.

So far then, we can already construct the function's signature:

```typescript
export function typedSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {

}
```

Notice the nice `keyof T` type here. That's of _key_ importance! :joy: Typescript will only let us pass string values which represent the key names in object `T`. And remember, we said we wanted to allow _multiple_ properties of type `T`, so the properties are an `Array` of `keyof T`, i.e. `Array<keyof T>`. So the very first think we'll need to do here is loop over those properties. `map` should do:

```typescript
properties.map(property => {

})
```

Within this `map`, we can now access the value like so:

```typescript
object[property]
```

TypeScript won't complain about this syntax because it knows `property` is, rather literally, a `keyof T` - _but_, we can't access the property value _directly_, ex. `object[property].toString()` as TypeScript will claim that `keyof T` is not of type `string`, so we need to store a copy of that value in a variable (and this will result in cleaner code anyway):

```typescript
const value = object[property];
```

For the actual string search between the property value and the query, I decided to use the nice [`String.prototype.includes()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#:~:text=The%20includes()%20method%20determines,true%20or%20false%20as%20appropriate.). However, if we try to use `includes()` directly on our `value` `const`, TypeScript will _still_ complain, and rightly so, since our `value` isn't necessarily of type `string`. We can do some simple type checks to make TypeScript happy (even if you decide to use a regex instead of `includes()`, you'll need to the same kind of type checking - since regex can only act on `string` types.)

With this type check, so far our function looks like this:

```typescript
export function typedSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
    properties.map(property => {
        const value = object[property];
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().includes(query)
        }
        return false;
    })
}
```

For the specific case of the search I was building, I decided it was most user friendly if it was case insensitive, so I used a simple `toLowerCase()` on both the object and query values. However, this could be an additional flag or option where you could specify what to do within the final `if` block. So, adding these two `toLowerCase()` calls, we have:

```typescript
export function typedSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
    properties.map(property => {
        const value = object[property];
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().toLowerCase().includes(query.toLowerCase())
        }
        return false;
    })
}
```

Now let's actually assign a `const`, call it `expressions`, to what our `map` returns:

```typescript
export function typedSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
    const expressions = properties.map(property => {
        const value = object[property];
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().toLowerCase().includes(query.toLowerCase())
        }
        return false;
    })
}
```

Now, `expressions` is an array of `boolean` values. We want to return `true` if _at least_ one if `true` (as we want to match if query is in _any_ of the property of the object type we are searching). We could write our own for loop or map and make this check explicitly ourselves, but this is 2020 - array functions are to the rescue again! Check out [`Array.prototype.some()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)! This does exactly what we want, based on a test function. And our values are already true / false, so our test function is just returning the boolean value itself.

So we have in total:

```typescript
export function typedSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
    const expressions = properties.map(property => {
        const value = object[property];
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().toLowerCase().includes(query.toLowerCase())
        }
        return false;
    })
    return expressions.some(expression => expression);
}
```

But wait, we can do _even_ better! Since our `if` statements and type checks _is_ our test function, we can refactor a bit, removing the `map` and `expressions` const, and calling `.some()` directly on properties, and returning the result of the `some()` function:

```typescript
export function typedSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
    return properties.some(property => {
        const value = object[property];
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().toLowerCase().includes(query.toLowerCase())
        }
        return false;
    })
}
```

:') its beautiful!

# Hooking it All Up

So, we've got (in my opinion) a very cool generic `typedSearch` function. Let's hook it up to our list. I won't provide the full component code, becuase its as simple as passing this `typedSearch` function as a callback to an array `filter` function. (Think about it - a frontend _search_ is really just a _filter_ on the items we have at hand!)

For a standard list render (let's call it `widgets` with type `Array<IWidget>`) _without_ filtering, you would do something like this:

```tsx
widgets.map(item => return <SomeComponentToRenderYourWidget {...object}/>)
```

To hook in our search function, we do:

```tsx
import { search } from './utils/search';
import IWidget from './interfaces/IWidget';

...

widgets
    .filter((widget) => typedSearch<IWidget>(widget, ["a", "list", "of", "properties"], query))
    .map(widget => return <SomeComponentToRenderYourWidget {...widget}/>)

```

By providing the `<IWidget>` typing to the `typedSearch` function, TypeScript will yell at us if any of the strings passed in the `properties` array doesn't exist in `IWidget`. No more runtime errors here! 

Even if we forget that a certain property in `IWidget` is an object or some other type, we know that those properties won't have any effect on the search results, due to our type checks within the `filter` function (where in such a case we return `false`).

Indeed, there are steps I'm missing here. You'd need your `query` variable to be stateful, and we of course would have to actually implement the `<SomeComponentToRenderYourItem/>` component. That's all included, however, in the example repository.

# Second: Generic Sorters!

In the same line of thinking as the `typedSearch` function, let's write a `typedSorter` function that can accept any type `T`. Where the `typedSearch` was used on a `filter` array function, the`typedSorter` function will be of course appled as a call back to an array `sort` call.

# Third: Generic Filters!

For completeness, let's do. Where the `typedSearch` was also a type of `filter` callback, it was somewhat special, comparing to a user defined. Our `typedFilter` function can be generated on an object of type `T` itself, based on the properties it has. For each given property of `T` (in our case `IWidget`), there will be either a 'has' or 'has not' way to test. 

For any property on `T` there can always be the case that the property is one of the following three: `undefined`, `null`, or `NaN`. This will be our check for properties. But we can do more in the case of further types `string`, `number`, and `boolean`.

In the case of `boolean`s the filter check is of course if the property is `true` or `false`. 

For `string`s, I've decided if it is set to an empty string or not. 

Finally, for `number`s, if it is 0 or not.

These decisions are not inherint in the types, in the case. This is an API design decision. For example if a given string property is empty server side, you may decide to not send that property at all (in which it will be `undefined` in the javascript), or set it to `null`. 

My API currently functions by _always_ sending _all_ properties, and if a string property is not set, then that property has just an empty string value. Modify your `typedFilter` function as necessary!

I also generate a _pair_ of checkboxes where the user can explicitly filter the objects based on if the property 'has' or 'has not'. I.e. for our `IWidget` title, explicitely choose to have the title. The 'does NOT' of course then provides the inverse results. (Alternatively, no checkboxes of course has no effect on filtering on that given property)

# Thank You!

I hope you enjoyed this one. I'm really enjoying TypeScript and the power of it's generics capabilities. I hope you do too!

Cheers! :beer:

-Chris