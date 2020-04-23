---
title: A Detailed Tutorial - Shopify's Storefront API + React + Redux
description: A Detailed Tutorial - Shopify's Storefront API + React + Redux
date: "2018-11-07"
draft: false
starID: 30
postType: dev
---

_Originally published on the [Siren Apparel Press on Medium](https://medium.com/siren-apparel-press/adding-shopifys-storefront-api-to-an-existing-react-app-with-react-redux-ea442bd7543)_

# A Detailed Tutorial: Shopify’s Storefront API + React + Redux

## E-commerce for all! (…websites, that is 😄)

*Written by *[Chris](https://medium.com/@frewin.christopher)* on Wednesday,
August 22nd, 2018*

![](https://cdn-images-1.medium.com/max/2000/1*HU6qT6c4a54QX-mnuPMj7w.jpeg)
<span class="figcaption_hack">Siren Apparel’s flagship shirt — Hydrant Removal.</span>

#### Background and Motivation

So the motivation here was pretty simple. I wanted my users to be able to
browse, search, and select products directly on my custom domain without having
to go to Shopify.

The secondary motivation is that I’d much rather have my own codebase for a
website than use one of Shopify’s factory templates. No offence Shopify team!
The templates are modern and clean, but they are rather basic.

So this is the best of both worlds — my custom React site (already built and
online 😄), with the added API and checkout process of Shopify!

By the end of this tutorial, you’ll be able to add your Shopify products on
*any* page of your site. The only part of the shopping process that will occur
on Shopify is when the user clicks ‘Checkout’.

The motivation specifically for writing here on Medium was simply that I
couldn’t find a tutorial on this process myself— so I decided to make one
myself!

I’ve been a professional developer for 4 years now, and programming for 7. I’ve
worked in tech stacks from old-school Fortran and Perl to React, Javascript, and
Nodejs.

Siren Apparel is one of my side project / startup / maker company that I’ve run
for 5 years now, and we’ve donated to 5 different police and fire departments.

Let’s finally get started with this tutorial.

#### Shopify’s Storefront API

The wonderful folks at Shopify have put together the [Storefront
API](https://help.shopify.com/en/api/custom-storefronts/storefront-api). With
the Storefront API, you can create React components to add product pictures,
product variations, product sizes, a cart, and ‘add to cart’ and ‘checkout’
buttons into your own, non-Shopify site.

Note that this tutorial is NOT about [Shopify
Polaris](https://github.com/Shopify/polaris), which is used to create components
in React for Shopify store management itself.

#### Getting Started: `react-js-buy` Repository

Take a look at [this React example built by the Shopify
team](https://github.com/Shopify/storefront-api-examples/tree/master/react-js-buy).
Most of the code in this walkthrough tutorial comes from that repository.

…Did you take a look? Good!

Now we’re going to hop right into code! Head to your React site’s root folder
and install the `shopify-buy` module via the terminal:

```bash
cd my-awesome-react-node-project/
npm install --save shopify-buy
```

(or `yarn add shopify-buy` if you prefer `yarn`)

Then, in your frontend `index.js`, (note: NOT `App.js`!) you will need to import
`Client` from the JS Buy SDK:

```javascript
import Client from 'shopify-buy';
```

Then add the following configuration object above the `ReactDOM.render()`call:

```javascript
const client = Client.buildClient({
    storefrontAccessToken: 'your-access-token',
    domain: 'your-shopify-url.myshopify.com'
});
```

That’s it for `index.js` for now — we’ll come back to it soon.

Now we’re going to add in all the components needed for a smooth shopping and
checkout experience. Copy all the components from the `react-js-buy` repository:

`Cart.js`

`LineItem.js`

`Product.js`

`Products.js`

`VariantSelector.js`

We will paste these components into a`components/shopify/` folder in your `src/`
folder. You could put these component files anywhere else in the `src/` folder,
if you wished. The rest of the tutorial assumes you have put them in
`components/shopify/` .

#### Modifying App.js

`App.js` will need extensive changes. First, import that Cart component you just
copied into your own project:

    import Cart from './components/shopify/Cart';

If your `App.js` component was stateless, like mine, you should be safe copying
this entire `constructor()` function:

```javascript
constructor() {
    super();
    this.updateQuantityInCart = this.updateQuantityInCart.bind(this);
    this.removeLineItemInCart = this.removeLineItemInCart.bind(this);
    this.handleCartClose = this.handleCartClose.bind(this);
}
```

if you already have state, copy only those `bind` lines. They are event handler
functions that the Shopify cart needs to function properly.

“But what about state for the cart!?”

You may ask; or:

“What about defining those four methods for the cart!?”

Indeed, that’s coming, but not yet! 😄

You can then append the `<Cart/>` component to the bottom of your render()
function, before the ending div. In my opinion, the cart should be accessible
anywhere in your app. I think it makes sense then to put the `<Cart/>` component
in the root component of your app:

```javascript
    return (
    <div>
    ...
    <Cart
        checkout={this.state.checkout}
        isCartOpen={this.state.isCartOpen}
        handleCartClose={this.handleCartClose}
        updateQuantityInCart={this.updateQuantityInCart}
        removeLineItemInCart={this.removeLineItemInCart}
     />
    </div>
    );
```

So, you may have noticed I didn’t include any code on the event handlers for the
cart yet. Additionally, I didn’t address the lack of state components for the
cart in App.js.

Well, about halfway through this project, I realized my products component was
not in my `App.js` file.

Instead, it was buried about three children components down.

So instead of passing products three levels down to children, and then function
handlers all the way back up…

I decided to use…

**😱 Redux!!! 😱**

Ugh! I know, I know, Redux, while not being very difficult, is a pain in the
%*$! to wire up initially with all the boilerplate required. But, if you are a
developer working on an E-commerce store or an E-commerce store owner, think of
it this way: Redux will enable you to access the state of the cart from any
component or page in our app.

This ability will be essential as Siren Apparel expands and we develop more
products. As we create more products, I’ll make a seperate dedicated store page
with all products, while leaving just a handful of featured products on the
homepage.

The ability to access the cart is essential if a user shops around a bit, reads
some stories or info about Siren Apparel, and *then* decides to checkout. It
doesn’t matter how much they navigate around, nothing from their cart will be
lost!

So, in short, I decided it’s probably better to implement Redux now while the
codebase for [our site](https://sirenapparel.us/) isn’t too large.

#### Implementing Redux for Shopify Buy SDK With Bare Minimum Boilerplate

Install NPM packages `redux` and `react-redux`:

    npm install --save redux react-redux

In `index.js` , import `Provider` from `react-redux`and your `store` from
`./store`:

```javascript
import { Provider } from 'react-redux';
import store from './store';
```

Wrap the `<Provider>` component with the passed `store` around your`<App>`in
`index.js`to hook up your App to your Redux store:

```javascript
ReactDOM.render(
<Provider store={store}>
    <IntlProvider locale={locale} messages={flattenMessages(messages[locale.substring(0, 2)])}>
      <App locale={locale}/>
    </IntlProvider>
 </Provider>,
document.getElementById('root')
);
```

Note that I also have a `<IntlProvider>`, but that’s in [a different post about
how I applied internationalization and localization to dynamically render the
content on Siren Apparel’s
site.](https://medium.com/@sirenapparel/internationalization-and-localization-of-sirenapparel-eu-sirenapparel-us-and-sirenapparel-asia-ddee266066a2)
A different story for a different day.

Now of course we haven’t made a `./store.js` file yet. Create your store in
`store.js`in the `src/` root and put this in it:

```javascript
import {createStore} from 'redux';
import reducer from './reducers/cart'; 

export default createStore(reducer);
```

Create your reducers file in `src/reducers/cart.js`and paste this code:

```javascript
// initial state
const initState = {
  isCartOpen: false,
  checkout: { lineItems: [] },
  products: [],
  shop: {}
}

// actions
const CLIENT_CREATED = 'CLIENT_CREATED'
const PRODUCTS_FOUND = 'PRODUCTS_FOUND'
const CHECKOUT_FOUND = 'CHECKOUT_FOUND'
const SHOP_FOUND = 'SHOP_FOUND'
const ADD_VARIANT_TO_CART = 'ADD_VARIANT_TO_CART'
const UPDATE_QUANTITY_IN_CART = 'UPDATE_QUANTITY_IN_CART'
const REMOVE_LINE_ITEM_IN_CART = 'REMOVE_LINE_ITEM_IN_CART'
const OPEN_CART = 'OPEN_CART'
const CLOSE_CART = 'CLOSE_CART'

// reducers
export default (state = initState, action) => {
  switch (action.type) {
    case CLIENT_CREATED:
      return {...state, client: action.payload}
    case PRODUCTS_FOUND:
      return {...state, products: action.payload}
    case CHECKOUT_FOUND:
      return {...state, checkout: action.payload}
    case SHOP_FOUND:
      return {...state, shop: action.payload}
    case ADD_VARIANT_TO_CART:
      return {...state, isCartOpen: action.payload.isCartOpen, checkout: action.payload.checkout}
    case UPDATE_QUANTITY_IN_CART:
      return {...state, checkout: action.payload.checkout}
    case REMOVE_LINE_ITEM_IN_CART:
      return {...state, checkout: action.payload.checkout}
    case OPEN_CART:
      return {...state, isCartOpen: true}
    case CLOSE_CART:
      return {...state, isCartOpen: false}
    default:
      return state
  }
}
```

Don’t worry, I’m not going to just post this big reducer and not discuss what is
going on; we’ll get to each event! Note a few things:

We take the initial state from what the state is written as in the Shopify
GitHub example and put it in our initState, namely the following four parts of
state:

```javascript
isCartOpen: false,
checkout: { lineItems: [] },
products: [],
shop: {}
  ```

However, in my implementation, I also create a `client` part of the state. I
call the `createClient()` function once and then immediately set it in the Redux
state in `index.js` . So let’s head into `index.js`:

#### Back to index.js

```javascript
const client = Client.buildClient({
  storefrontAccessToken: 'your-shopify-token',
  domain: 'your-shopify-url.myshopify.com'
});
store.dispatch({type: 'CLIENT_CREATED', payload: client});
```

In the Shopify buy SDK example, there are a few async calls to get information
about the products and store information in React’s `componentWillMount()`
function. That code looks like this:

```javascript
componentWillMount() {
    this.props.client.checkout.create().then((res) => {
      this.setState({
        checkout: res,
      });
    });

    this.props.client.product.fetchAll().then((res) => {
      this.setState({
        products: res,
      });
    });

    this.props.client.shop.fetchInfo().then((res) => {
      this.setState({
        shop: res,
      });
    });
  }
  ```

I opted to do that instead as far upstream as possible, directly in `index.js`.
Then, I issued a corresponding event when each part of the response has been
received:

```javascript
// buildClient() is synchronous, so we can call all these after!
client.product.fetchAll().then((res) => {
  store.dispatch({type: 'PRODUCTS_FOUND', payload: res});
});
client.checkout.create().then((res) => {
  store.dispatch({type: 'CHECKOUT_FOUND', payload: res});
});
client.shop.fetchInfo().then((res) => {
  store.dispatch({type: 'SHOP_FOUND', payload: res});
});
```

By now the reducer is created, and the initialization of the Shopify API
`client` is complete all for`index.js`.

#### Back to `App.js`

Now in `App.js`, wire up Redux’s store to the App state:

```javascript
import { connect } from 'react-redux';
```

and don’t forget to import the store as well:

```javascript
import store from './store';
```

At the bottom where `export default App` should be, modify it to this:

```javascript
export default connect((state) => state)(App);
```

This connects the redux state to the `App` component.

Now in the `render()` function we are able to access the Redux’s state with
Redux’s `getState()` (as apposed to using vanilla react’s `this.state`):

```javascript
render() {
    ...    
    const state = store.getState();
}
```

#### Finally: the Event Handlers (Still in App.js)

From above, you know that there are only three event handlers that we need in
`App.js`, because the cart uses only three: `updateQuantityInCart`,
`removeLineItemInCart`, and `handleCartClose`. The original cart event handlers
from the example GitHub repository, which used local component state looked like
this:

```javascript
updateQuantityInCart(lineItemId, quantity) {
  const checkoutId = this.state.checkout.id
  const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]

return this.props.client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
    this.setState({
      checkout: res,
    });
  });
}

removeLineItemInCart(lineItemId) {
  const checkoutId = this.state.checkout.id

return this.props.client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {
    this.setState({
      checkout: res,
    });
  });
}

handleCartClose() {
  this.setState({
    isCartOpen: false,
  });
}
```

We can refactor them to dispatch events to the Redux store as follows:

```javascript
updateQuantityInCart(lineItemId, quantity) {
    const state = store.getState(); // state from redux store
    const checkoutId = state.checkout.id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]
    state.client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
      store.dispatch({type: 'UPDATE_QUANTITY_IN_CART', payload: {checkout: res}});
    });
}
removeLineItemInCart(lineItemId) {
    const state = store.getState(); // state from redux store
    const checkoutId = state.checkout.id
    state.client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {
      store.dispatch({type: 'REMOVE_LINE_ITEM_IN_CART', payload: {checkout: res}});
    });
}
handleCartClose() {
    store.dispatch({type: 'CLOSE_CART'});
}
handleCartOpen() {
    store.dispatch({type: 'OPEN_CART'});
}
```

You can add these between the `constructor()` and `render()` methods as usual.

If you were following along, I already mentioned that I added my own
`handleCartOpen` function, because I pass that function down as a prop to my
`<Nav/>` component, so a user is able to open and close the cart from a link in
the nav. At a future time, I could move that function to the Nav itself instead
of passing it as a prop, since of course the Redux store will also be avaliable
there!

#### Finally Add that <Products/> Component!

So, you’ve got a basic store maybe with some simple `href`’s that link to the
corresponding product on your Shopify store? Ha! Throw those out, and replace
them with your brand spankin’ new `<Products/>` component!

First, import the component into wherever your store markup should be (remember,
in my code base I’ve put the shopify example components in a folder called
`shopify/`)

This will be where ever your products currently are. (In[ the boilerplate
repository](https://github.com/frewinchristopher/react-redux-shopify-storefront-api-example)
I made, I put this in the `GenericProductsPage` component, to signal that this
code could be applied to any page that has a products section):

    import Products from './shopify/Products';

Now finally, that past 15–20 minutes of redux boilerplate code edits pays off:
we can grab the `products` component of our state — not from a vanilla React
state passed down over and over again through props — but through grabbing it in
a neat one liner `const state = store.getState();`:


render () {
const state = store.getState(); // state from redux store
let oProducts = <Products
  products={state.products}
  client={state.client}
  addVariantToCart={this.addVariantToCart}
/>;


Don’t forget to drop the component itself into where it should go in your
`render()` function. For me, that location was buried in Bootstrap style classes
and HTML:

```javascript
...
<div className="service-content-one">
    <div className="row">
        <Products/>
    </div>{/*/.row*/}
</div>{/*/.service-content-one*/}
...
```

Finally, we will need a single event function `addVariantToCart` for the cart to
work with this products component. Again, for reference, here is the original,
vanilla React local `state` version of `addVariantToCar`(again, from the shopify
example repository):

```javascript
addVariantToCart(variantId, quantity){
  this.setState({
    isCartOpen: true,
  });

const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]
const checkoutId = this.state.checkout.id

return this.props.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
    this.setState({
      checkout: res,
    });
  });
}
```

and the new, Redux-friendly `store.dispatch()` version:

```javascript
addVariantToCart(variantId, quantity) {
    const state = store.getState(); // state from redux store
    const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]
    const checkoutId = state.checkout.id
    state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
      store.dispatch({type: 'ADD_VARIANT_TO_CART', payload: {isCartOpen: true, checkout: res}});
    });
}
```

which is of course the one we will use 😄

don’t forget to bind it in the constructor:

```javascript
this.addVariantToCart = this.addVariantToCart.bind(this);
```

Don’t forget, you’ll need to connect this component to the store like you did
`App.js` , and import the store:

```javascript
import { connect } from 'react-redux'
import store from '../store';
```

at the top, and (assuming the component where you put the Shopify `Product`
component name is `GenericProductPage`:

    export default connect((state) => state)(GenericProductsPage);

at the bottom.

Great! Now, no matter how deep in components or where ever your products
component is declared, it can communicate with the cart’s state!

#### Final BONUS Example: Cart in Your Header or Nav

If you want to have a ‘Cart’ button in your header / nav, add this button in
your Nav component’s render function (again, an example from my current site,
which has Bootstrap styles — a very simple version is in the [boilerplate
example](https://github.com/frewinchristopher/react-redux-shopify-storefront-api-example):

```javascript
<div className="App__view-cart-wrapper">
<button className="App__view-cart" onClick={this.props.handleCartOpen}>
    Cart
    </button>
</div>
```

where `handleCartOpen` is a new handler method you’ll have to add to `App.js`:

```javascript
this.handleCartOpen = this.handleCartOpen.bind(this);
```

in the constructor. Then when you are referencing your Nav component in App.js
(or wherever you place your Nav) you pass the function handler:

```javascript
<Nav handleCartOpen={this.handleCartOpen}/>
```

#### Styling Component(s)

I relied on the CSS file, `app.css`, located in the`shared/` folder in th e
`storefront-api-example` repository (you can’t miss it, it’s the only file in
`shared/` ! Make sure to copy that into your `styles/` folder or wherever it
needs to be and include it in your `index.js`file. In my `index.js` it looks
like this:

```javascript
import './styles/shopify.css';
```

Since I renamed the `app.css` which was in the Shopify example repository to
`shopify.css` , and put it folder `styles`. This convention is also used in the
boilerplate repository code.

From here it’s pretty easy to identify where exactly in `shopify.css` the
default bright blue color for the buttons is defined, and so on. I’m going to
save detailed CSS customization for you to handle. 😃

But who knows, maybe I’ll post on that eventually — but I find the styles from
Shopify pretty good and easy enough to modify.

#### Takeaways

In my opinion, this is a perfect (non-todo list 😜) use of Redux. Redux cleanly
organizes the event functions and state of the Shopify cart and makes it easy to
access the cart’s state from any other component. This is much easier to
maintain than passing pieces of state to children and using multiple event
handlers to pass events back up to parent functions all over a React app.

As shown as an example in the tutorial, the cart’s state is accessed easily in
the nav component and the shop section of the front page. I’ll also be able to
easily add it to a sort of ‘featured’ product section as well, once we’re ready
for that.

#### Find the Code

A boilerplate repository of this implementation [can be found
here](https://github.com/frewinchristopher/react-redux-shopify-storefront-api-example).
It is a near blank create-react-app app, but with all the changes of this
tutorial implemented in `index.js` and `App.js` , as well as a super basic
`GenericStorePage` and `Nav` components.

I built the code on the repo while re-reading and updating my own tutorial here,
to make sure this tutorial makes sense.

Because I am crazy 😜, Siren Apparel’s website is all open-sourced. So if you
want to fool around with my implementation, [check out the
respository!](https://github.com/frewinchristopher/sirenapparel.us)

I hope you enjoyed this tutorial! If anything isn’t clear or just plain not
working, let me know! I’ll try to assist you!

Thanks to [Lisa Catalano](http://css-snippets.com/author/lisa/) at CSS-Snippets
for [the simple Nav
example](http://css-snippets.com/simple-horizontal-navigation/#code)!

Cheers! 🍺

Chris
