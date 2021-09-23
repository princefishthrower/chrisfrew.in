---
title: "React and TypeScript: Generic Search, Sort, and Filter"
description: A step-by-step guide leveraging the awesome powers of TypeScript generics to implement reusable searching, sorting, and filtering.
date: "2020-10-27"
tags: react,typescript,TypeScript Generics
---

[_This post is mirrored on my Medium account._](https://chrisfrewin.medium.com/react-and-typescript-generic-search-sort-and-filter-879c5c3e2f0e)

# Example Repository

[The example repository is here.](https://github.com/princefishthrower/react-typescript-generic-search-sort-and-filter).

# Live Demo

[The live demo is on GitHub Pages.](https://princefishthrower.github.io/react-typescript-generic-search-sort-and-filter/build/)

# Motivation

In a recent project, I was tasked to implement front-end filter and search functionality. However, the task also required that the sort and filter functions could easily be applied to any type. Luckily, I've been using [generics](https://www.typescriptlang.org/docs/handbook/generics.html) quite a bit (and slowly getting better with them!), but I particularly impressed myself (and my colleague) with the lightweight, though completely reusable solution I built. 

I figure I'd share my solution with all of you. Enjoy!

# First: Generic Search!

Let's dive into the search function first, since it's the simplest of the three function we'll be building. 

Let us assume we have an API endpoint that returns an array of type `T`. With a search, typically, we want to be able to query on (potentially) multiple properties of `T`, and have the search return the elements where at least one of those properties match. So, composing such a function we need the object itself, the properties we want to search on, and the query. 

This is a perfect use case for [JavaScript's `Array.prototype.filter()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), which accepts an object from the array calling it and returns either true or false.

We'll also need the query value itself in our function, to match the actual values of our object.

So far then, we can already construct the function's signature:

```typescript
export function genericSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {

}
```

Notice the nice `keyof T` typing here. That's of _key_ importance! 😂 

TypeScript will only let us pass string values which represent the key names in object `T`. And remember, we said we wanted to allow _multiple_ properties of type `T`, so the properties are an `Array` of `keyof T`, i.e. `Array<keyof T>`. So the very first thing we'll need to do here is loop over those properties. `map` should do:

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

For the actual string search between the property value and the query, I decided to use the nice [`String.prototype.includes()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes). However, if we try to use `includes()` directly on our `value` `const`, TypeScript will _still_ complain, and rightly so, since our `value` isn't necessarily of type `string`. We can do some type checks to make TypeScript happy (even if you decide to use a regex instead of `includes()`, you'll need to the same kind of type checking - since regex can only act on `string` types.)

With this type check, so far our function looks like this:

```typescript
export function genericSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
    properties.map(property => {
        const value = object[property];
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().includes(query)
        }
        return false;
    })
}
```

For the specific case of the search I was building, I decided it was most user friendly if it was case insensitive, so I used `toLowerCase()` on both the object and query values. However, this could be an additional flag or option where you could specify what to do within the final `if` block. So, adding these two `toLowerCase()` calls, we have:

```typescript
export function genericSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
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
export function genericSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
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
export function genericSearch<T>(object: T, properties: Array<keyof T>, query: string): boolean {
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

**But wait**, we can do _even_ better! Since our `if` statements and type checks _is_ our test function, we can refactor a bit, removing the `map` and `expressions` const, and calling `.some()` directly on properties, and returning the result of the `some()` function:

```typescript
// case insensitive search of n-number properties of type T
// returns true if at least one of the property values includes the query value
export function genericSearch<T>(
    object: T,
    properties: Array<keyof T>,
    query: string
): boolean {

    if (query === "") {
        return true;
    } 

    return properties.some((property) => {
        const value = object[property];
        if (typeof value === "string" || typeof value === "number") {
            return value.toString().toLowerCase().includes(query.toLowerCase());
        }
        return false;
    });
}
```

😊 beautiful!

# Second: Generic Sorters!

In the same line of thinking as the `genericSearch` function, let's write a `genericSort` function that can accept any type `T`. Where the `genericSearch` was used on a `filter` array function, the`genericSort` function will be of course applied as a callback to an array `sort` call. So, this needs to be a comparator function, accepting an 'a' and 'b' object of type `T`, as well as the currently active sorter:

```typescript
export function genericSort<T>(
  objectA: T,
  objectB: T,
  sorter: ISorter<T>
) {
...
}
```

Where ISorter (also generic) is a helper interface to help us keep track of the active filter property and if the sort should be descending or not:

```typescript
export default interface ISorter<T> {
    property: Extract<keyof T, string | number | Date>;
    isDescending: boolean;
}
```

Notice again that we use the `keyof T` syntax here, but then extract only those types which will function as expected with the `>` and `<` comparators operations (for us it is `string`s, `number`s, and `Date`s - you may have more in your own app!) which we can use as follows:

```typescript
const result = () => {
    if (objectA[property] > objectB[property]) {
        return 1;
    } else if (objectA[property] < objectB[property]) {
        return -1;
    } else {
        return 0;
    }
}
```

Finally, we negate the value of `result` if the sort descending is `true` and return it:

```typescript
return sorter.isDescending ? result() * -1 : result();
```

All together, our `genericSort` function looks like this:

```typescript
import ISorter from "../interfaces/ISorter";

// comparator function for any property within type T
// works for: strings, numbers, and Dates (and is typed to accept only properties which are those types)
// could be extended for other types but would need some custom comparison function here
export function genericSort<T>(
  objectA: T,
  objectB: T,
  sorter: ISorter<T>
) {
  const result = () => {
    if (objectA[sorter.property] > objectB[sorter.property]) {
        return 1;
    } else if (objectA[sorter.property] < objectB[sorter.property]) {
        return -1;
    } else {
        return 0;
    }
  }

  return sorter.isDescending ? result() * -1 : result();
}
```

# Third: Generic Filters!

For our final function, let's implement generic filtering. Where the `genericSearch` was a `filter` callback, it was a somewhat special one, comparing to the value of a user's input. For each given property of `T` (in our case `IWidget`), we are going to allow the user to select if they want to see all items which are _truthy_ for that property or _falsy_.

## Truthy? Falsy? Huh? :thinking:
Any property of `T` can have any type. To avoid writing a fancy filter function based on various types, I fallback to JavaScript's evaluation of _falsy_ and _truthy_ values - in other words, what a given value evaluates to when used in a boolean statement. As a recap, the _falsy_ values for the most common [JavaScript primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) are as follows:

| Type       |      Falsey Value(s)        |
|------------|-----------------------------|
| `object`   | `undefined`, `null`, `NaN`  |
| `string`   | `""`                        |
| `number`   | `0`                         |
| `boolean`  | `false` (duh! 😂)        |

Where any other value for each type will evaluate to `true` in a boolean evaluation. 

I realize providing the user with both truthy and falsy options for each property may be overkill. You may decide for certain properties to only provide a filter for one or the other. This depends on the actual items you are filtering and what you want in your UI. I've implemented both for completeness and your convenience. 😊

With that said, we can expect what kind of signature we need for our `genericFilter`. We need the object of type `T` that will be present in the `filter()` callback, and the active filters themselves:

```typescript
export function genericFilter<T>(object: T, filters: Array<IFilter<T>>) {
...
}
```

where `IFilter` is a helper interface (also generic) to help keep track of the properties we are filtering on and if the user has selected to view the truthy or falsy side of them:

```typescript
export default interface IFilter<T> {
    property: keyof T;
    isTruthyPicked: boolean;
}
```

Then, we want to ensure that _every_ filter selected is applicable to the item we are currently filtering on. This is a perfect use case for [JavaScript's `Array.prototype.every()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).

Falling back to JavaScript's truthy / falsy evaluation and using `Array.prototype.every()`, the actual filter logic of `genericFilter` is rather easy to read:

```typescript
return filters.every((filter) => {
    return filter.isTruthyPicked ? object[filter.property] : !object[filter.property];
});
```

Back to the truthy and falsy options for each property: I generate a pair of radio buttons where the user can explicitly filter the objects based on their truthy or falsy value. 

For example, for our `IWidget`'s `title` property, the user can explicitly choose to show all results in which the `title` is truthy. The 'is falsy' labeled radio button of course then provides the inverse results (displaying the widgets where `title` is an empty string - only one so far in my mock data in the [example repository](https://github.com/princefishthrower/react-typescript-generic-search-sort-and-filter)). Alternatively, when no radio buttons are selected for the given property of course there is no effect on filtering for that property. 

You maybe would want to also implement a clear all button which would remove all items from the `filters` array (which would be stateful, see next section for more details) used in the `genericSearch`, but I'll leave that to you. 😊

All in all our `genericFilter` function looks like this:

```typescript
import IFilter from "../interfaces/IFilters";

// filter n properties for truthy or falsy values on type T (no effect if no filter selected)
export function genericFilter<T>(object: T, filters: Array<IFilter<T>>) {
  // no filters; no effect - return true
  if (filters.length === 0) {
    return true;
  }

  return filters.every((filter) => {
    return filter.isTruthyPicked ? object[filter.property] : !object[filter.property];
  });
}
```

# Hooking it All Up

So, we've got (in my opinion) very cool generic `genericSearch`, `genericSort`, and `genericFilter` functions. Let's hook them up to our array.

For a standard list render (let's call it `widgets` with type `Array<IWidget>`) _without_ filtering, you would do something like this:

```tsx
widgets.map(item => return <SomeComponentToRenderYourWidget {...object}/>)
```

To hook in our functions, we would do something like this:

```tsx
import { genericSearch } from "./utils/genericSearch";
import { genericSort } from "./utils/genericSort";
import { genericFilter } from "./utils/genericFilter";
import IWidget from './interfaces/IWidget';

...

return (
    <>
        {widgets
            .filter((widget) =>
                genericSearch<IWidget>(widget, ["title", "description"], query)
            )
            .sort((widgetA, widgetB) =>
                genericSort<IWidget>(widgetA, widgetB, activeSorter)
            )
            .filter((widget) => 
                genericFilter<IWidget>(widget, activeFilters)
            ).map(widget => 
                return <SomeComponentToRenderYourWidget {...widget}/>
            )
        }
    </>
)

```

By providing the `<IWidget>` typing to the `genericSearch` function, TypeScript will yell at us if any of the strings passed in the `properties` array don't exist in `IWidget`. Likewise with `genericFilter` and `genericSort`. No more nasty runtime errors here! 

Even if we forget that a certain property in `IWidget` is an `object` or some other type that can't be sorted or searched, we know that those properties won't have any effect on the search results, due to our type checks within the `search` and `sort` functions (wherein such a case we return `false`). 

Our `filter` function is _so_ generic that we don't have to worry at all and can pass in properties of all types here, thanks to JavaScript's truthy and falsy functionality.

## Important Caveats
Indeed, there are steps I'm missing in the code snippet above to get a fully running app. You'd need your `query`, `activeSorter`, and `activeFilters` variables to be stateful, and we of course would have to actually implement the `<SomeComponentToRenderYourWidget/>` component to render the values within each `widget`. That's all implemented, however, in the [example repository](https://github.com/princefishthrower/react-typescript-generic-search-sort-and-filter).

# Should this Become a Node Package? :heart_eyes:

If there's interest, with further cleanup and option setups, and some fine-tuning, I believe this could be migrated to an open-source project and Node.js package - though I'm sure there are other filtering / sorting / searching packages and solutions out there. Let me know in the comments!

# Thank You!

I hope you enjoyed this post. I'm really enjoying TypeScript and the power of its generics abilities. I hope this post was useful to you!

Cheers! 🍺

-Chris