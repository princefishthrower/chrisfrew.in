---
title: "Releasing Five Products in 2021, Part 2: ReduxPlate"
description: "Insights from the frontlines of a SaaS product release: an interactive Redux code generator."
date: "2021-06-13"
draft: false
tags: products,miscellaneous,companies
---

import FivePartProductSeries from "../../../components/utils/blog-posts/shared/FivePartProductSeries"

<FivePartProductSeries dontLinkURL="/blog/releasing-5-products-in-2021-part-2-reduxplate" isProductPage="true"/>

<!-- Stuff for medium: -->
<!-- # Greetings!

Hi everyone! You may recognize me from other full stack posts I've published here in The Startup relating to specific software challenges, some of which include:

https://medium.com/swlh/extending-react-standard-types-to-allow-for-children-as-a-function-ba7fdde52e0b

https://medium.com/swlh/c-net-core-and-typescript-using-generics-and-linq-to-secure-and-filter-operations-on-your-e85e23e065c3

https://medium.com/swlh/magento-2-ip-location-detection-geoip-and-store-context-control-using-the-ipstack-api-b48c17cc19c7

Today, I'm proud to say that I'm able to post here with an actual product of mine, and even prouder to say that it's my **first ever successful and profitable SaaS product!** * If you've liked my other code-based posts, I hope you'll read this one, and that you'll gain some insights into the other side of product development: marketing and the real-world product launch.

*Stay tuned, this post here talks about just the first of potentially **_five_** products I want to release in 2021! -->

# Product Overview

ReduxPlate is a Redux code generator. 

**It can generate your entire Redux codebase just from the shape of your state alone.** 

As a visual example, let's say you wanted the following slice of state for your forms, perhaps with an `email`, `name`, and `messageText` field, and maybe a checkbox with value `receiveEmailCopy` if the customer wants to receive a copy of the message they send. Such a slice of state might have the following type:

```typescript
export interface FormState {
    email: string
    name: string
    messageText: string
    receiveEmailCopy: boolean
}   
```

This is all you need to provide for ReduxPlate to write all of your Redux boilerplate for you. I've gone ahead and submitted this to ReduxPlate, and these are the three files I got back:

For `types.ts`:

```typescript
export interface FormState {
    email: string
    name: string
    messageText: string
    receiveEmailCopy: boolean
}
export const SET_EMAIL = "SET_EMAIL"
export const SET_NAME = "SET_NAME"
export const SET_MESSAGE_TEXT = "SET_MESSAGE_TEXT"
export const SET_RECEIVE_EMAIL_COPY = "SET_RECEIVE_EMAIL_COPY"
export interface SetEmailAction {
    type: typeof SET_EMAIL;
    payload: {
        email: string;
    };
}
export interface SetNameAction {
    type: typeof SET_NAME;
    payload: {
        name: string;
    };
}
export interface SetMessageTextAction {
    type: typeof SET_MESSAGE_TEXT;
    payload: {
        messageText: string;
    };
}
export interface SetReceiveEmailCopyAction {
    type: typeof SET_RECEIVE_EMAIL_COPY;
    payload: {
        receiveEmailCopy: boolean;
    };
}
export type FormActionTypes = SetEmailAction | SetNameAction | SetMessageTextAction | SetReceiveEmailCopyAction
```

For `reducers.ts`:

```typescript
import { FormActionTypes, FormState, SET_EMAIL, SET_MESSAGE_TEXT, SET_NAME, SET_RECEIVE_EMAIL_COPY } from "./types"

export const initialFormState: FormState = {
  email: '',
  name: '',
  messageText: '',
  receiveEmailCopy: false
}
export function FormReducer(
    state = initialFormState,
    action: FormActionTypes
): FormState {
switch (action.type) {
    case SET_EMAIL:
        return {
            ...state,
            email: action.payload.email
        }
    case SET_NAME:
        return {
            ...state,
            name: action.payload.name
        }
    case SET_MESSAGE_TEXT:
        return {
            ...state,
            messageText: action.payload.messageText
        }
    case SET_RECEIVE_EMAIL_COPY:
        return {
            ...state,
            receiveEmailCopy: action.payload.receiveEmailCopy
        }
    default:
        return state;
    }
}
```

For `actions.ts`:

```typescript
import { FormActionTypes, SET_EMAIL, SET_MESSAGE_TEXT, SET_NAME, SET_RECEIVE_EMAIL_COPY } from "./types";

export function setEmail(email: string): FormActionTypes {
    return {
        type: SET_EMAIL,
        payload: {
            email
        }
    } as const;
}
export function setName(name: string): FormActionTypes {
    return {
        type: SET_NAME,
        payload: {
            name
        }
    } as const;
}
export function setMessageText(messageText: string): FormActionTypes {
    return {
        type: SET_MESSAGE_TEXT,
        payload: {
            messageText
        }
    } as const;
}
export function setReceiveEmailCopy(receiveEmailCopy: boolean): FormActionTypes {
    return {
        type: SET_RECEIVE_EMAIL_COPY,
        payload: {
            receiveEmailCopy
        }
    } as const;
}
```

Beautiful! 🥲

## Try It Out!

Please, try it for yourself - it's publicly available at [reduxplate.com](https://reduxplate.com)! Give it a bookmark or better yet, sign up if you're really interested. I plan to be releasing the full product in July or August.

## MVP Has Purposely Restricted Functionality

Currently, ReduxPlate's functionality is limited to the following:

- Only a maximum of one "slice" or state object 
- Only a maximum of 5 properties in the state object
- Only primitive typings (or arrays of primitive types) allowed for each state parameter
- Only TypeScript
- Only traditional three file output (`actions.ts`, `reducers.ts`, and `types.ts`)

Of course, backend behind the code generation process is not limited by these requirements. I have restricted it in these way so I can convince customers to subscribe to the full product. 

## Full Product Features

Speaking of thte full product, I envision including the support for the following:

- Vanilla JavaScript input and generation
- Codebase syncing (Bitbucket, GitHub, GitLab, etc.)
- Redux Toolkit
- `index.ts` generation to include the actual `configureStore` calls
- `usage.ts` generation, showing how all actions can be called with `dispatch`
- multiple state slices and allowing complex types within those slices
- "ReduxDoc" - draws and maps all your action calls throughout your app, providing recommendations on how your actions can be better composed

# Key Takeaways From Launch

I was a bit worried about the launch of this product. It is a much lower feature count MVP than the amount of features I had with The Wheel Screener for example. I don't have any user sign up or log in ability, or even the app page built out. It will really be up to potential customers to make a leap up faith and use their imagination to picture how ReduxPlate will turn out.

# Next Steps

Build the full app of course! While doing this, I'll be updating my book as I write code, and recording episodes for each implementation - as it is on the MVP, there hasn't been a line of code I _haven't_ written while recording the course. It truly will be "From Soup 🍜 to Nuts 🥜" as advertised.

Cheers 🍺

-Chris