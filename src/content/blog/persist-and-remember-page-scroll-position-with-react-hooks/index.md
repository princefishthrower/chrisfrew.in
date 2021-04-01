---
title: "Persist and Remember Page Scroll Position, i.e. window.scrollY Using React Hooks"
description: An elegant React hook gets the job done!
date: "2020-10-11"
---

[This post is mirrored on my Medium account.](https://medium.com/@frewin.christopher/persist-and-remember-page-scroll-position-i-e-window-scrolly-using-react-hooks-f80884211f2d)

In a recent project, I was tasked with creating functionality that would maintain scroll position between pages. At first, I was certain the solution would have to be a complex one, where we would have to listen to `scroll` event listeners (always a critical task in terms of performance and efficiency), and share a complex state of various page scroll positions (the value of `window.scrollY`) for everything to work properly. 

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
}, [])
```

3. Finally, and maybe the most tricky one: _we should only rehydrate the page scroll position after the full content for the page has loaded_. For example, if we are loading a bunch of tiles or pictures (or anything really that ends up in the DOM) from an async process, we wait to make sure that data is set in the DOM before restoring our `scrollY` position. Therefore, our hook should also be able to accept a parameter which is `boolean` type. I called it `setCondition`. We'll only call `window.scrollTo` if that `setCondition` variable is `true`.

# The Implementation

I present to you `useWindowScrollPosition` (in TypeScript):

```typescript
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

// sets scrollY position of window based on a setting condition, i.e. when api calls are done
// also sets the scroll position when unmounting, i.e. a user navigates to a different page
export default function useWindowScrollPosition(localStorageKey: string, setCondition: boolean): void {
    const [scrollYStorage, setScrollYStorage] = useLocalStorage(localStorageKey, 0);
    useEffect(() => {
        // if the setcondition is true (AKA everything in the DOM is loaded: fire off the scrollTo()!)
        if (setCondition) {
            window.scrollTo(0, scrollYStorage)
        }
    }, [setCondition, scrollYStorage])

    // purely on un mount (and thus we ignore the ESLint warning): store the scroll position the user was at to localStorage
    // see the yellow note at https://reactjs.org/docs/hooks-effect.html near the very bottom
    useEffect(()=> {
        return () => {
            setScrollYStorage(window.scrollY)
        };
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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

    // look at this; easy as pie:
    useWindowScrollPosition('MyAwesomeComponent_ScrollY', !isLoading);
    // done :)

    // example of setting a loading to false, which upon being set to 'true', triggers the effectful parts of useWindowScrollPosition
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

# Final Remarks and Notes

- **Most critically**, this hook makes use of the infamous empty dependency array in one of its `useEffect` hooks. (You can see the link to the official React docs about this special usage in the comments in the code, or [just click here](https://reactjs.org/docs/hooks-effect.html).). If you are using ESLint (highly recommended) you _will_ get a warning about exhaustive dependencies when using the empty array. But in this case, we truly only want the logic there (to set the localStorage key) specifically when the component unmounts, and no other time. So providing the second `useEffect` hook with the empty dependency array (`[]`) is justified.

- Since this hook leverages [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), **this is a solution that will work for both single-page applications (SPAs) and multiple page applications, like sites generated with Gatsby - like this blog!**

- You only need to provide the name of the `localStorage` key, and the `boolean` trigger condition of when to call `window.scrollTo`. (If you want to call `window.scrollTo` immediately on mount, you can simply pass `true` to the hook).

- I've left the `localStorage` key parameter as a `string` type, but you could refactor it to a specific `enum` of allowed page names for example, or create your own validators.

- Finally, **and rather importantly**, you should use this hook only _once_ within a 'page'. It _can_ be used in a child component of a page if the `setCondition` perhaps lives deeper in the page - but it doesn't make much sense trying to call `window.scrollTo()` more than once to restore the old scroll position. I've found 99% of the time I can use it right in my top-level page components - which is where I tend to do all my API calls and loading handling.

# Thanks!

As always, thank you for your time! I hope this hook is useful to you.

Cheers! 🍺

-Chris