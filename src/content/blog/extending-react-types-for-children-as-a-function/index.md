---
title: "Extending React Standard Types to Allow for Children as a Function"
description: Sorting or filtering child components? You've come to the right place!
date: "2021-01-19"
---

[This post is mirrored on my Medium account.](https://chrisfrewin.medium.com/extending-react-standard-types-to-allow-for-children-as-a-function-ba7fdde52e0b)


# Example Repository

This code is on my GitHub account at [react-typescript-generic-search-sort-and-filter-children-function](https://github.com/princefishthrower/react-typescript-generic-search-sort-and-filter-children-function).

# Live Demo

[The live demo is on GitHub Pages.](https://princefishthrower.github.io/react-typescript-generic-search-sort-and-filter-children-function/build/)

# Overview

We're going to do some advanced TypeScript-ing today! We already know from awesome blogs like [Fettblog](https://fettblog.eu/) about [how to type functional components with children](https://fettblog.eu/typescript-react/children/). An additional way not listed in that post, which also prevents TypeScript from complaining about using the `children` variable is the `PropsWithChildren` type, which you can import from React:

```tsx
import * as React from "react";
import { PropsWithChildren } from "react";

interface IFooBarComponentProps {
  foo: string;
  bar: string;
}
export default function FooBarComponent(
  props: PropsWithChildren<IFooBarComponentProps>
) {
  const { foo, bar, children } = props;
  return (
    <>
      <h1>Hello world</h1>
      <h2>Foo is: {foo}</h2>
      <h3>Bar is: {bar}</h3>
      <p>My children are:</p>
      {children}
    </>
  );
}
```

Where `children` will have type `React.ReactNode`. 

**Take note of this example, I'm also going to stick with this `FooBar` typing throughout the post.**

# Give Me MORE Functionality!

This snippet shown above, or the snippets from the Fettblog post are great for when we simply need TypeScript to understand the `children` prop in our component. But what if we wanted to ensure our children were of a _certain_ type? 

To stick with our `FooBar` typing (with simply `foo` and `bar` properties of type `string`), imagine we have an array called `fooBarItems`, where each item is of type `IFooBarItem`:

```typescript
interface IFooBarItem {
    foo: string;
    bar: string;
}
```

and just to show an example of what a `fooBarItems` could look like:

```typescript
const fooBarItems: Array<IFooBarItem> = [
    {
        foo: 'foo',
        bar: 'bar',
    },
    {
        foo: 'foo2',
        bar: 'bar2',
    },
    {
        foo: 'foo_three',
        bar: 'bar_three',
    }
]
```

Then imagine a `FooBarSorter`, which is a wrapper component, where we could just "know" that any children under the component will be sorted. For such functionality you might picture something like this:

```tsx
<FooBarSorter>
    fooBarItems.map(fooBarItem => {
        return (
            <FooBarRenderer foo={fooBarItem.foo} bar={fooBarItem.bar}/>
        )
    })
</FooBarSorter>
```

But this won't quite do, since `FooBarSorter` won't have any way to manipulate each `fooBarItem` within the `map` function. 

(It will be able to _render_ them if we do `{children}` it's `render()` or return value, but we won't be able to _manipulate_ each child separately.) 

# React Children... As a Function?!

One way we can give our wrapper component access to each child is from passing the `fooBarItems` _into_ the wrapper component and composing the children of the wrapper component like this:

```tsx
<FooBarSorter foorBarItems={fooBarItems}>
    {
        (fooBarItem: IFooBarItem) => <FooBarRenderer foo={item.foo} bar={item.bar}/>
    }
</FooBarSorter>
```

Interesting... a function as child?! No worries, it's valid React right? (Answer: right!) We just need to make TypeScript happy now. So, `children` in a typical React component is just a normal prop! It's _not_ a function! How can we get such a typing to work? I present to you a new type, `PropsWithChildrenFunction`:

```typescript
type PropsWithChildrenFunction<P, T> = P & {
    children?(item: T): ReactNode;
}
```

There's lots to unpack in this type:

- First of all, we see that `children` is altogether optional. We don't require our wrapper component to have any children! (For example, if they are being loaded asynchronously or are for any other reason you can think of not accessible in the component yet.) 
- Second, we see if children _are_ defined, those children must be functions, and accept an `item` of type `T`, and return a `ReactNode` just like a standard `render()` function would return in any old React component. 
- Finally, the other generic type `P`. Type `P` is there so we can keep our standard props for component! We don't want to lose those! While this may look _very_ fancy, it's really just a more complex use case based on React's standard `PropsWithChildren` type, which, directly from the `index.d.ts` of the React types is:

```typescript
type PropsWithChildren<P> = P & { children?: ReactNode };
```

So essentially all we've done with `PropsWithChildrenFunction` is strengthened the standard typing by changing `children` to a function, and furthermore, a function that must accept one argument of type `T`. Everything else is the same as the standard `PropsWithChildren`.

# How Does it Work?

Now that we understand `PropsWithChildrenFunction`, I can show an example of the actual contents of our wrapper component `FooBarSorter`. But, since our `PropsWithChildrenFunction` type accepts generics, our wrapper component won't need to be tied to the `FooBar` type at all. Therefore I will call it `GenericSorter`! 

```tsx
import * as React from 'react';
import { Component } from 'react';

type PropsWithChildrenFunction<P, T> = P & {
    children?(item: T): ReactNode;
}

export abstract class GenericSorter<T> extends Component<PropsWithChildrenFunction<ISortableBaseProps<T>, T>> {

}
```

To render the children from within `GenericSorter`, the most simple way would be as follows:

```tsx
render() {
    return (
        {children && dataSource
            .sort(this.sortFunc)
            .map(x => children(x))
        }
    )
}
```

where the sort function (`this.sortFunc`) is generic, looking like this (lots of details left out, but this is just an example):

```typescript
function sortFunc(a: T, b: T): number {
    const filteredSorters = this.props.sorters.filter(sorter => `${sorter.property}_${sorter.direction}` === this.state.activeFilterValue);
    if (filteredSorters.length === 0) {
        return 0;
    }
    const filteredSorter = filteredSorters[0];
    const property = filteredSorter.property;
    const result = () => {
        if (a[property] > b[property]) {
            return 1;
        } else if (a[property] < b[property]) {
            return -1;
        } else {
            return 0;
        }
    }

    switch (filteredSorter.direction) {
        case Direction.Desc:
            return result() * -1;
        default:
            return result();
    }
}
```

(Much like [the generic search, sort, and filter functions I wrote about previously.](blog/react-typescript-generic-search-sort-and-filters/)).

So what do we get in the end? A generic sorting component which can be wrapped around a child generation function, where our only reliance on the type of items is by passing `items` into the `data` prop on the rest. Incredible. The logic in the `GenericSorter` component does the rest! So really, the true way this looks in its final form is like this:

```tsx
<GenericSorter<IFooBarItem> data={fooBarItems}>
    {
        item => <FooBarRenderer foo={item.foo} bar={item.bar}/>
    }
</GenericSorter>
```

The only reference to the `IFooBarItem` is as the type passed into the `GenericSorter`, which is anyway in the parent component, and the typing itself and never enters or affects the logic of `GenericSorter`! Yay! :smile: 

Also note that because of the way we designed `PropsWithChildrenFunction`, our renderer component couldn't have something like `otherProp={item.otherProp}` because we know explicitly that item _must_ take on the type `IFooBarItem`, and `IFooBarItem` only has properties `foo` and `bar`! Double yay! :smile: :smile:

# But... There's a Composition Issue Here...

This solution isn't all sunshine :sunny: and rainbows :rainbow:. Our special `PropsWithChildrenFunction` has the requirement that _all_ children need to be functions. Therefore we can't nest various wrapper components within each other, or else TypeScript will complain. As a visual example I what I mean, imagine we had search, sort, and filter wrapper components. We WOULDN'T be able to do the following:

```tsx
<GenericSorter<IFooBarItem> data={fooBarItems}>
    <GenericFilter>
        <GenericSearch>
        {
            item => <FooBarRenderer foo={item.foo} bar={item.bar}/>
        }
        </GenericSearch>
    </GenericFilter>
</GenericSorter>
```

Since TypeScript would complain that `GenericFilter` and `GenericSearch`, as children of the `GenericSorter` component, are they themselves _not_ functions.

We _could_ modify the typing to `PropsWithChildrenFunction`, but then in the implementation of each wrapper component, we would need to put in logic to find the children we actually want to render. Then you get into problems like needing to order the components in a certain way, which is never a good sign.

# The End Solution

In totally clean and final solution, we would need to compose an additional component that orchestrates all operations we want to use to manipulate our array of items. We could definitely still use the `PropsWithChildrenFunction` for the rendering side of things, but the ultimate reusable and least intrusive arrangement (least intrusive in terms of keeping styling and typing out of the component) would look something like this:

```tsx
interface IGenericListManipulation {
    renderComponent: ReactNode;
    renderProps: Props;
}

export default function GenericListManipulation<T>(props: IGenericListManipulation) {
    const { renderComponent, renderProps } = props;
    return (
        <GenericSearch<T> />
        <GenericSorter<T> />
        <GenericFilter<T> />
        <GenericRenderer data={data} applyingFunctions={}>
        {
            item => React.cloneElement(renderComponent,{ ...renderProps })
        }
        </GenericRenderer>
    )
}
```

and within `GenericRenderer` we would call `apply()` on the various functions you would want to manipulate the list of items with. React's [context API](https://reactjs.org/docs/context.html) could also be useful here to make the code even cleaner - where the manipulating function itself could be passed around simple as an 'operation' variable, for example.

I break down this full solution in my course "Advanced TypeScript: Generic Search, Sort, and Filter" which will soon be available on both Skillshare and Udemy! Stay :radio: &nbsp; tuned! &nbsp; :radio:

# Example Code Repository

As a full example of what was described in this post, I went through [the original generic search, sort, and filter repository](https://github.com/princefishthrower/react-typescript-generic-search-sort-and-filter) and refactored it to take on the function children form using `PropsWithChildrenFunction`. 

Note, however, due to the composition issue mentioned above, that the search, filter, and sort now are forced to operate on their own copies of the render list. You can check out what I mean by looking into `App.tsx` in the code in detail. The **new** repository is at [react-typescript-generic-search-sort-and-filter-children-function](https://github.com/princefishthrower/react-typescript-generic-search-sort-and-filter-children-function) GitHub repository. (I know, long name, but it works, right? :joy:)

# Thanks!

As always, a sincere thanks for taking the time to read this post. I hope it was useful to you, and that you learned a thing or two about generics and extending standard React types!

Cheers! :beer:

-Chris
