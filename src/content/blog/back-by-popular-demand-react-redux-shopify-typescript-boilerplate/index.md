---
title: "Back By Popular Demand: React + Redux + Shopify + TypeScript Boilerplate"
description: "Now with TypeScript: Strongly typed E-commerce for all!"
date: "2020-07-21"
draft: false
tags: react,redux,shopify,typescript
topPostOrder: 2
---

*This is a 2020 followup to my original article [A detailed tutorial: how to use Shopify’s Storefront API with React and Redux](https://www.freecodecamp.org/news/a-detailed-tutorial-how-to-use-shopifys-storefront-api-with-react-and-redux-37f95cbab7f/), featured on freeCodeCamp.*

*This post is also mirrored on [my Medium site](https://medium.com/@frewin.christopher/react-redux-shopify-typescript-boilerplate-f20614bf5bb1)*

## Background and Motivation

One of the blog posts / Medium articles I wrote that have provided a lot of freelance work leads was my [Shopify + Redux + React article](https://www.freecodecamp.org/news/a-detailed-tutorial-how-to-use-shopifys-storefront-api-with-react-and-redux-37f95cbab7f/), which I wrote in 2018 and was featured on freeCodeCamp. Although only two years old, I realized there were some improvements I could make to the provided code base, as well as better patterns that I myself have learned in the past few years.

[You can jump right to the new repository here.](https://github.com/princefishthrower/react-redux-shopify-typescript-storefront-api-example)

I welcome you to read on and learn about the insights I made.

Let’s get started.

## Introducing TypeScript

I’ve fallen in love with the TypeScript and VSCode environment in the past year or so. It’s like a drug: once you have the editor IntelliSense with quick navigation, type recommendations, and possible bug warnings, you don’t want to work with anything else in your projects! Small plug: if you want to dig into a strongly typed full-stack framework (TypeScript Nodejs backend, TypeScript React frontend) that shares the same types between the frontend and backend, see my [full stack typing boilerplate article](https://medium.com/@frewin.christopher/introducing-the-full-stack-typing-boilerplate-once-you-orm-you-cant-go-back-e97b53a36f).

I’ll now go through all the changes I made to upgrade the codebase to a 2020 standard. Where relevant, I’ll include code snippets to provide a window into my thought process.

## Changes for 2020 #1 — Cleaning Up the Create React App (CRA) Boilerplate

I reorganize even the base boilerplate that CRA provides us with — I like having as little as possible in the root of the `src` folder, only keep things like `index.tsx` and type declarations (`react-app-env.d.ts`). Everything else I organize into folders.

You’ll see that while I kept the styles and images from the original CRA, I organize the style files into the `styles` folder and likewise images into the `images` folder. Pretty self-explanatory.

I also like to start with the base `App` component in a `components` folder and build more components in that folder, organized into subfolders like the `shopify` folder as is in the example repository.

## Changes for 2020 #2 — Reorganizing the Redux Store and Reducers

The first thing to do is reorganize the Redux store and reducers to be TypeScript-friendly, following their documentation for [Redux and TypeScript](https://redux.js.org/recipes/usage-with-typescript).

In the 2018 version of this boilerplate, I made a `store.js` file in the `src` root, and a big reducer handling all state changes throughout the whole app in `reducers/cart.js`. This was a fairly standard implementation for Redux back then.

With TypeScript, the recommended pattern from the [official Redux + TypeScript documentation](https://redux.js.org/recipes/usage-with-typescript) has a different form. They recommend creating three separate files, under a named folder, for each slice of state: actions, reducers, and types. All of these slice folders live under a store folder. See below to get the file tree to see how this looks or explore the store folder directly on GitHub.

As I start to make the `actions.ts`, `reducers.ts`, and `types.ts` files, I realized my 2018 codebase had a few problems with respect to the Redux configuration, or rather, a few overly complicated design choices that could be *reduced* (heh) into a form that was both cleaner and more concise.

### Separating the Redux State into Three Parts, or ‘Slices’: 'shopify’ , ‘cart’, and ‘variants’

I first wanted to separate what was previously a single state object, `cart.js`, into three smaller parts of state (or ‘slices’ as described in the documentation). [Looking at the reducer in my original code](https://github.com/princefishthrower/react-redux-shopify-storefront-api-example/blob/master/src/reducers/cart.js), I realized I was mixing actions based on the Shopify retrieval functions themselves, and the cart actions, which were purely UI functions (simply showing and hiding the cart).

I also realized the original reducer name of ‘cart’ that I chose was not the most descriptive name — and it’s especially confusing when the Shopify part of state also has a component called `cart`. I renamed this to `shopify`.

Finally, I noticed in the `Product` component that I was using the standard local state (i.e. `this.state`) instead of a Redux state. I usually don’t like to do this: if I am using Redux, I want all of the app’s state to be in Redux. In the end, I find it’s the cleanest route to go — otherwise, there is the mental hurdle every time you see ‘ah, here is a component using local state’ or ‘oh, this one is a Redux state component’ — it’s just too much context switching. Plus, the whole point of Redux is to cleanly manage your state — so let’s use it for that!

So, to summarize, in this new 2020 boilerplate, I decided to break the app’s state into three parts (or slices):

* a `cartUI` part only specifically for the cart UI actions

* a `shopify` part, specific for actions with the `client` object

* a `variants` part, specific for handling selected product variants

In the end, the folder and file structure for our new Redux state looks like this:

    ├── store
    │   ├── index.ts
    │   ├── cartUI
    │   │   ├── actions.ts
    │   │   ├── reducers.ts
    │   │   └── types.ts
    │   ├── shopify
    │   │   ├── actions.ts
    │   │   ├── reducers.ts
    │   │   └── types.ts
    │   └── variants
    │       ├── actions.ts
    │       ├── reducers.ts
    │       └── types.ts

Where `index.ts` is the main store file. For this project, it looks like this:

```typescript
import { createStore, combineReducers } from 'redux';
import { shopifyReducer } from './shopify/reducers';
import { cartUIReducer } from './cartUI/reducers';
import { variantsReducer } from './variants/reducers';

const rootReducer = combineReducers({
    shopify: shopifyReducer,
    cartUI: cartUIReducer,
    variants: variantsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(
    rootReducer
);
```

More slices of state would need their reducer to be included here. I realize this is a lot of boilerplate, but when you recognize that TypeScript can follow the types (we can import and use the `RootState` type anywhere we’d like) within our app, I think in the long run the boilerplate is well worth it and actually *saves* time in terms of time saved testing and debugging.

### Redux Actions — Renaming and Refactoring

Next were the action names themselves — they should be as close to the names of what they are actually doing as possible. For example, the name `PRODUCTS_FOUND` isn’t the best word choice. It should be `PRODUCTS_FETCHED`, since the source function from the Shopify `client` is called `fetchAll()`. The same is true for the event `CHECKOUT_FOUND`, it should be `CHECKOUT_CREATED` since the source function is `create()`.

Furthermore, we can improve these Shopify-based actions, not by just sending the whole payload as a confusing, poorly labeled `res` variable, but actually naming them by what they are, according to what types Shopify gives us. For `products`, `shop`, and `client`, we can keep the names, but the checkout object is a bit different: the type for checkout as defined in the `@types/shopify-buy` package is actually that of `Client.Cart`, so we will call that part of the Redux state `cart` instead of `checkout`.

Finally, I realized the `SHOW_CART` and `HIDE_CART` actions, although more declarative, was a bit more cumbersome than just creating an action `SET_CART_OPEN`, where you can be free to pass the boolean if the cart should be shown or not. This way of doing things, while losing the static `true` and `false` declarative functions, ultimately results in less code and is more flexible to use.

Additionally, I was using hardcoded strings for the action names in Redux in the original code 😱. This is a big no-no for a number of reasons, one of the most critical being that hunting down typos in any action name (i.e. — why the heck isn’t my action firing?!) can be very difficult to debug.

Following Redux’s recommended TypeScript implementation, the action names are all `export`’ed `const` variables organized into their respective slice of state in the types.ts file, which we are free to import when they are needed. Nice! 😄 👍

I realize some may be rolling their eyes 🙄 at all of these small tweaks that appear to be nothing more than superfluous simple variable naming, but being as clear as possible is one of the best things you can do to make re-learning and re-reading your code (or showing your code to someone else!) months (or even years) later that much easier!

## Changes for 2020 #4 — Utilizing Functional Components

I realize my original intentions for putting the Shopify `client` functions in `index.js` to try and start off the Shopify bootstrapping as fast as possible, but in actuality, because we are using Redux, there is no need for them to live there. I created a `bootstrapShopify()` function in the `utils/utils.ts` file that contains our Shopify `client` creation and subsequent Redux action calls. I call this function in the `App` functional component since we are firing off Redux actions and need to be sure the `Provider` is initialized first (done in `index.tsx`).

There are a few intermediary steps here. First, I ‘upgraded’ (a matter of opinion in this case) from the Promise `.then()` syntax to the `async` / `await` syntax. For example, fetching products from Shopify originally looked something like this:

```typescript
client.product.fetchAll().then((products) => {
    this.setState({
        products,
    });
});
```

Using `async` / `await` syntax, that becomes:

```typescript
const products = await client.product.fetchAll();
this.setState({
    products,
});
```

We are anyway using Redux, so we dispatch an event to set the products. So the final code ends up looking like this:

```typescript
const products = await client.product.fetchAll();
store.dispatch({
    type: PRODUCTS_FETCHED,
    payload: {
        products,
    },
});
```

The nice thing about this syntax is that it allows us to add a try /catch block around *all* of the async functions, instead of writing a separate `.catch()` for each `.then()` block. A try/catch block will prevent your app from crashing if any of then Shopify calls fail. For now, I have left the catch block with the typical `console.log` line, but in production, you could choose to send it to the logger of your choice (or handle it however you want, really). In the end, the full `boostrapShopify()` function looks like this:

```typescript
export async function bootstrapShopify(): Promise<void> {
    try {
        // client
        const client = Client.buildClient({
            storefrontAccessToken: "ae91e5b2087c0193b38321bd8757a475",
            domain: "mighty-oak-roasters.myshopify.com",
        });
        store.dispatch({ type: CLIENT_CREATED, payload: { client } });

        // products
        const products = await client.product.fetchAll();
        store.dispatch({
            type: PRODUCTS_FETCHED,
            payload: {
                products,
            },
        });

        // cart
        const cart = await client.checkout.create();
        store.dispatch({ type: CHECKOUT_CREATED, payload: { cart } });

        // shop
        const shop = await client.shop.fetchInfo();
        store.dispatch({ type: SHOP_INFO_FETCHED, payload: { shop } });

    // catch any errors thrown in bootstrapping process
    } catch (error) {
        // TODO: real error handling here, perhaps to real logs or do something else
        console.log(error);
    }
}
```
## Changes for 2020 #3— Utilizing Functional Components

Finally, I went through all the React components and changed the old (though *not *deprecated!) class components to functional components. In general, I was way too fancy with passing props around. In the old code, I was leveraging the central store of Redux for only a few parts of state. I’ve extended the advantage of Redux state to all components now. Combining that with the functional component syntax and the `useSelector()` hook from `react-redux`, we have exquisitely clean components!

Furthermore, there was a bit of functional logic mixed in with some of the components (an old habit I am still trying to shake!). In this case, Redux again gives us a perfect place to put that logic: in the action creators!

I think what I have left is just about the cleanest Shopify TypeScript boilerplate code base that I could get. I hope it’s useful for you! :rocket::rocket::rocket:

As always, don’t forget to include your own credentials for Shopify to get it to start loading your products.

### Other Notes and Changes

As I went through this “upgrade”, I noticed various changes to the Shopify API. They are listed here:

* I noticed (thank you TypeScript) that `webUrl` no longer exists on the cart object. it is now `checkoutUrl`.

* It also appears that the `totalTax` and `totalPrice` properties have been removed from the checkout object (`ShopifyBuy.Cart`) type. At least, they’re not in the typing for `ShopifyBuy.Cart`. All that remains from the original 2018 example is that `subtotalPrice` . For now they are commented in the component code, and I currently have an [open issue on the Shopify repository](https://github.com/Shopify/storefront-api-examples/issues/122) and looking into why this is the case.

* The entire `variant` component of the `lineItem` object has apparently been removed. I.e., `lineItem.variant.image` is simply `lineItem.image`, and so on. Also, the title component `lineitem.variant.title` is now simply `lineItem.variantTitle`

* `client.product.helpers.variantForOptions()` is now simply `client.product.variantForOptions()` (`helpers` has been removed)

## Questions / Comments / Problems

Please leave a response if there are any issues with this boilerplate. I don’t currently have a Shopify store to play around with, so I’m not 100% sure everything will work exactly as expected.

## Example Code Repository

Code or it didn’t happen, right? Well, I’ve set up a [new repository](https://github.com/princefishthrower/react-redux-shopify-typescript-storefront-api-example) just like [the old one](https://github.com/princefishthrower/react-redux-shopify-storefront-api-example) to share with you.

Cheers! 🍺

Chris
