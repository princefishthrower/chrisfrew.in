---
title: "Persist and Remember Page Scroll Position, i.e. window.scrollY Using React Hooks"
description: An elegant React hook gets the job done!
date: "2020-10-11"
---

[This post is mirrored on my Medium account.](https://medium.com/@frewin.christopher/persist-and-remember-page-scroll-position-i-e-window-scrolly-using-react-hooks-f80884211f2d)

In a recent project, I was tasked with maintaining scroll position between pages. At first, I was certain the solution would have to be a complex one, where we would have to listen to `scroll` event listeners (always a critical task in terms of performance and efficiency), and share a complex state of various page scroll positions (the value of `window.scrollY`) for everything to work properly. 

In the end, leveraging both [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and some advanced abilities of React hooks resulted in a rather elegant solution.

I'm happy to share it with you.

Let's go!

# Requirements

1. First, we need to remember the `window.scrollY` value per page - this can be solved with [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). We'll pass a page key to identify which `localStorage` variable has the `scrollY` value we need to rehydrate.

2. We only need to store the scroll position _when the user leaves that page_. This is where I realized that there was no event listener required. No need to listen to the `scroll` event to complete this functionality! (Already a huge plus). The 'trick', if you will, is leveraging React's `useEffect` `return` value, which can be a function, i.e., a `useEffect` call can have the following form:

```tsx
useEffect(() => {
    // ...some effect code here...
    return () => {
        // this code fires on unmount! Perfect for our use case!
    }
})
```

3. We should also allow the component which uses the hook to be able to override the default behavior and set a custom `scrollY` value whenever needed. I called it `customScrollValue` It is definitely possible to imagine a component that has a change in state unrelated to calling `window.scrollTo`. Since any state change causes a rerender, the page would jump to the old value we had stored in the `localStorage` value. In these cases of unrelated state changes, we should be able to set any value for a scrollY position, for example the `window.scrollY` value at that moment (to maintain the exact page position). You could probably think up some more complex situations where you might want instead to override and jump to the top or bottom of the page :smile:.

4. Finally, and maybe the most tricky one: _we should only rehydrate the page scroll position after the full content for the page has loaded_. For example, if we are loading a bunch of tiles or pictures (or anything really that ends up in the DOM) from an async process, we wait to make sure that data is set in the DOM before restoring our `scrollY` position. Therefore, our hook should also be able to accept a parameter which is `boolean` type. I called it `setViaStorageCondition`. We'll only call `window.scrollTo` if that `setViaStorageCondition` variable is `true`.

# The Implementation

I present to you `useWindowScrollPosition` (in TypeScript):

```typescript
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

// sets scrollY position of window based on a setting condition, i.e. when api calls are done
// also sets the scroll position when unmounting, i.e. a user navigates to a different page
export default function useWindowScrollPosition(localStorageKey: string, setViaStorageCondition: boolean, customScrollValue?: number): void {
    const [scrollYStorage, setScrollYStorage] = useLocalStorage(localStorageKey, 0);
    useEffect(() => {
        // allow the hook to accept an arbitrary scroll value: if is actually defined, always choose that one over the storage based value
        if (customScrollValue !== undefined) {
            setScrollYStorage(customScrollValue)
            window.scrollTo(0, customScrollValue);
        // otherwise, trigger a reload when the set condition changes
        } else if (setViaStorageCondition) {
            window.scrollTo(0, scrollYStorage);
        }
        // on un mount: store the scroll position the user was at to localStorage
        return () => {
            if (window.scrollY !== 0) {
                setScrollYStorage(window.scrollY)
            }
        };
    }, [scrollYStorage, setViaStorageCondition, setScrollYStorage, customScrollValue])
}
```

Where `useLocalStorage` is a 'dependency', if you will, [from a nice hook created by Gabe Ragland on his **useHooks** site](https://usehooks.com/useLocalStorage/).

Because this hook interacts with the window object directly, using it in your components is a true one-liner:

```tsx
import * as React from "react";
import { useEffect, useState } from "react";
import useWindowScrollPosition from "../hooks/useWindowScrollPosition";

export default function MyAwesomeComponent() {
    const [data, setData] = useState<any>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [customScrollValue, setCustomScrollValue] = useState<number | undefined>(undefined);

    // look at this; easy as pie:
    useWindowScrollPosition('MyAwesomeComponent_ScrollY', !isLoading, customScrollValue);
    // done :)

    // example of setting a loading to false, which will trigger the scroll position logic (isLoading)
    const fetchData = async () => {
        try {
            const data = await fetch('https://your-api-url-here.com');
            setData(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    // example of using the customScrollValue to maintain scroll position of the page (no jumping)
    const onClick = () => {
        // ...some state changing code here...
        // then also set:
        setCustomScrollValue(window.scrollY);
    }

    useEffect(() => {
        if (!data) {
            fetchData();
        }
    });

    return (
        <p>Hello world!</p>
        <button onClick={onClick}>Click me!</button>
    );
}
```

# Final Remarks

Since this hook leverages [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), **this is a solution that will work for both single-page applications (SPAs) and multiple page applications, like sites generated with Gatsby - like this blog!**

You only need to provide the name of the `localStorage` key, and the `boolean` trigger condition of when to call `window.scrollTo`. (If you want to call `window.scrollTo` immediately on mount, you can simply pass `true` to the hook).

I've left the `localStorage` key parameter as a `string` type, but you could refactor it to a specific `enum` of allowed page names for example, or create your own validators.

Finally, **and rather importantly**, you should use this hook only _once_ within a 'page'. It _can_ be used in a child component of a page if the `setViaStorageCondition` perhaps lives deeper in the page - but it doesn't make much sense trying to call `window.scrollTo` more than once to restore the old scroll position. I've found 99% of the time I can use it right in my top level page components - which is where I tend to do all my API calls and loading handling.

# Thanks!

As always, thank you for your time! I hope this hook is useful to you.

Cheers! :beer:

-Chris