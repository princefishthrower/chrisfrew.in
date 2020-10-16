---
title: "Extending React Standard Types to Allow for Functional Children"
description: Sorting or filtering child components? You've come to the right place!
date: "2020-10-16"
---

[This post is mirrored on my Medium account.]()

We're going to do some advanced Typescript-ing today! We already know from awesome blogs like [Fettblog]() on [how to type components with children](). I'm glad to tell you. What if we need an additional type. For example, we are manipulating children via a sort like so:

```
<SortableComponent>
    {
        (item) => <ItemComponent>
    }
</SortableComponent>
```

_"Ah, c'mon"_ I hear you say, _"`ReactNode` is enough for me! Why would I need to even extend that type?"_

Well, let me show you.

We were working on some sorting functionality that would sort any given child components, based on a 'template', if you will, of that given child. We don't want to rely on what kind of component the child is, only the the type of list that will be used to generate that list of components. First we looked here. This is valid javascript, but TypeScript will complain saying that  there is no instance of `children` that is callable.

Thats fine. Let's copy the pattern of `ReactWithChildren` and create our own `PropsWithFunctionalChildren`:

```typescript
type PropsWithFunctionalChildren = {

}
```

That's great, TypeScript doesn't complain... but how exactly do we use this? Like this:

```tsx
<MyAwesomeWrapperComponent data={items}>
{
    (item) => (
        <SomeAwesomeChildComponent
            foo={item.foo}
            bar={item.bar}
        />
    )
}
</MyAwesomeWrapperComponent>
```

Incredible. Our only reliance on the type of items is by passing `items` into the `data` prop on the rest. The logic in `<MyAwesomeWrapperComponent>` does the rest!

# Thanks!

As always, a sincere thanks for taking the time to read this post. I hope it was useful to you, and that you learned a thing or two about extending standard React types.

Cheers! :beer:

-Chris
