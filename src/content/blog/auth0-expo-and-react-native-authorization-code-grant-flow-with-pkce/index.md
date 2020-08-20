---
title: "Auth0, Expo, and React Native: Authorization Code Grant Flow with PKCE"
description: One of the most devious software problems I've encountered in some time.
date: "2020-08-20"
draft: false
starID: 132231231123
postType: dev
---

## Motivation: Never Log in Again!

I was trying to implement the PKCE flow on my react native application so that I could renew access tokens on the user's behalf. With this type of flow, a user only has to authenticate once&nbsp;[^1]. After this initial authentication, we securely store each user's refresh token, and can use it later to get another access token / refresh token pair exactly at the moment their current access token expires. (My application has an extra security step in that I have chosen to rotate the refresh tokens - with auth0 this is an optional setting, but recommended). 

Alas, at the end of the day, my troubles had _nothing_ to do with all these big scary-sounding cryptography words. It was an issue with environments, deprecated libraries, and dependencies!

## Introducing PKCE: Proof Key for Code Exchange

The aformentioned flow of 'renewing an access token on behalf of a user' is possible with a refresh token, and to get a refresh token via auth0, we can use Proof Key for Code Exchange, or PKCE. With auth0, the PKCE flow can be achieved by implementing a call to a pair of endpoints: a GET request on `/authorize`, and a POST request on `/oauth/token`. On the GET request you provide a `code_challenge` among a few other variables, getting a one time use authorization `code`. On the POST request you provide the `code_verifier` which was used to produce the `code_challenge` along with the `code` you just received, to get the access token / refresh token / id token combo.

Sounds simple enough... but it's never _that_ easy, right? Here's some code that I hunted down [from this github thread](https://github.com/expo/auth0-example/issues/16) that I had for the GET endpoint:

```javascript
import { AuthSession } from 'expo';
import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';

function URLEncode(str) {
    return str.replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function sha256(buffer) {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, buffer, { encoding: Crypto.CryptoEncoding.BASE64 });
}

const randomBytes = await Random.getRandomBytesAsync(32);
let verifier = URLEncode(btoa(randomBytes.toString()));
let challenge = URLEncode(await sha256(verifier));

const redirectUrl = AuthSession.getRedirectUrl();
let authUrl = `${auth0Domain}/authorize?` + this.toQueryString({
    audience: `${auth0Audience}`,
    client_id: `${auth0ClientID}`,
    connection: 'facebook',
    scope: 'openid profile email offline_access',
    redirect_uri: redirectUrl,
    response_type: 'code',
    code_challenge: challenge,
    code_challenge_method: "S256"
    nonce: 'test',
});

const result = await AuthSession.startAsync({
    authUrl: authUrl
});

console.log(JSON.stringify(result));
```

With this code, I was able to get a success response object, i.e. `console.log(JSON.stringify(result));` yields:

`{"type":"success","params":{"code":"t8-0Tq-lWvKugR8S","state":"3eyxl4n15j"},"errorCode":null,"url":"exp://127.0.0.1:19000/--/expo-auth-session?code=t8-0Tq-lWvKugR8S&state=3eyxl4n15j"}`

but then, upon using the returned `code` and my `code_verifier` in my POST request I was always getting the error:

`{"error":"access_denied","error_description":"Unauthorized"}`

Shaking my head at the not very useful error message, I tried and tried with various combinations and slight tweaks, all to no avail. My frustration led me even to open [an issue on the auth0 community](https://community.auth0.com/t/react-native-with-expo-oauth-token-endpoint-always-results-in-access-denied-in-pkce-flow/48145)&nbsp;[^2].

`jmangelo` was the first to reply and said:

> If you haven’t done so already I would suggest for you to do the flow outside of the application, for example Postman or another tool that can be used to perform the OAuth 2.0 flow. If you replicate the issue outside of the application you have reduced the scope of things to look for which may be useful.
> 
> As a first step I would check if the client identifier you’re using is indeed configured to NOT require authentication in the token endpoint. In other words, start by checking that the application in the Auth0 dashboard has Token Endpoint Authentication Method set to none.

I took his advice - taking a step back; going to a totally a clean slate. First, I recreated the POST request in Postman as he suggested, where all request fields and parameters could be easily organized and reviewed. Aha! In Postman I got an error message I could work with:

`Parameter 'code_verifier' must be between 43 and 128 characters long`

I checked the length of our code_verifier: 157 characters. Yep. That's too long. So, to be fully sure of the expected shape of the `code_challenge` and `code_validator` parameter, I went ahead and created a blank npm project called `crypto-test`:

```bash
mkdir crypto-test
cd crypto-test
npm init -y
```

I then put auth0's [javascript code examples to generate the `code_challenge` and `code_verifier` parameters](https://auth0.com/docs/flows/call-your-api-using-the-authorization-code-flow-with-pkce) verbatim into `index.js` and ran it:

```javascript
const crypto = require("crypto");

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

const code_verifier = base64URLEncode(crypto.randomBytes(32));
const code_challenge = base64URLEncode(sha256(code_verifier));
console.log("code_verifier: " + code_verifier);
console.log("code_challenge: " + code_challenge);
```

Which resulted in such an output:
```
code_verifier: XtXt_0n2w4k5mpty1noXyBN-M7DkK6FuCBXfgIa3TrQ
code_challenge: j564Gfuqd2DhQy4l_N9X-fHxxcUejgms6fKvTWBUEA8
```

So, what do we get? Two strings, both exactly 44 characters in length (trust me, I've done enough tests, you always get 44 characters. SHA256 returns 32 bytes, using Base64 encoding on top of that gives you 44 characters. See this [StackOverflow](https://stackoverflow.com/questions/27817282/sha256-giving-44-length-output-instead-64-length) thread for the details.)

So the ultimate question became: 

> Why the heck is our `expo-crypto` version of the code producing a 157 character length string for our `code_verifier`? We want the 44 character `code_verifier` that is produced by the vanilla node project.

My first suspicion was that it was an issue with the package I was using to produce the `code_verifier` field. After all, auth0's official documentation for node recommends to use node's built in `crypto` package, and my code snippet was using `expo-crypto`... 

"Hey", I hear you say, "an Expo project _is_ technically a node project... can't we just `npm install --save crypto` into our project and use the auth0 example code examples right away?!" Not so fast. The `crypto` package as a standalone is deprecated - and at the same time we can't use the standard included version of `crypto` from node since react native does not bundle a complete version of node!

So I was kind of stuck. I needed to hunt down the reason why the `expo-crypto` and `expo-random` packages were producing an incorrect `code_verifier` value...

I _did_ find [this blog post from Ryan Rampersad](https://blog.ryanrampersad.com/2018/02/01/expo-app-auth0-authorization-code-grant-flow-pkce/) which explained his similar troubles with the `crypto` and `expo-crypto` conundrum. Ultimately his mentioned solution is:

> Our compromise in this situation was actually to request the random string and hash from our own API service. This way, we can have unique verifier and challenge strings ready for each user, without app locally making these strings up itself. This is probably secure enough, given that our API service is protected with HTTPS, and if these simple strings are comproised [sic] somehow over the wire, there are even larger targets when going through the Auth0 authentication itself.

I think Ryan was being a little hard on himself, since even in the official auth0 tutorial documentation they _recommend_ generating a code verifier and challenge in-app (or _somewhere_ in your own code). Regardless, the post didn't address the specific I had encountered: why was this seemingly 'same' code using the `expo-crypto` and `expo-random` packages was not producing the same results I saw from the vanilla `crypto` package.

So, I did the hard work. I went line by line, comparing auth0's example code with the code snippet of the expo equivalent function that I had found on Github. It turns out they weren't _exactly_ equivalent.

## The Problem: Always Be Sure About the Types you are Working with!

I saw in the vanilla node version that the `code_verifier` is of type `Buffer` before it runs through through the `base64URLEncode` function. However, we can see that expo's `expo-random` package  `getRandomBytesAsync` returns a Uint8Array (TypeScript and IntelliSense helped a lot here where I could see the types directly in code and didn't have to hunt down the documentation as I would if it were plain JavaScript). So in the end, we just need to convert the `Uint8Array` variable to a Base64 encoded `Buffer`.

An additional problem was that the `btoa` function on the `Uint8Array` wasn't producing the correct results. So I looked for an alternative. I finally stumbled upon [this StackOverflow thread](https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string). I did not go with the accepted answer, but found the node based solution a bit further down, which is:

```javascript
const base64String = Buffer.from(yourUint8Array).toString('base64');
```

For TypeScript projects (of which my react native project was), this requires importing `Buffer`:

```typescript
import { Buffer } from 'buffer';
```

The node `buffer` package, unlike the `crypto` package, is _not_ deprecated, and safe to install into our project:

```bash
npm install --save buffer
```

So the error in the original code I found was in these two lines:

```javascript
const randomBytes = await Random.getRandomBytesAsync(32);
const verifier = URLEncode(btoa(randomBytes.toString()));
```

which should become:

```javascript
const randomBytes = await Random.getRandomBytesAsync(32);
const base64String = Buffer.from(randomBytes).toString('base64');
const code_verifier = URLEncode(base64String);
```

So, I now give you what you've been waiting for. The full code snippet!

```typescript
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';
import { AuthSessionResult } from 'expo-auth-session';
import { Buffer } from 'buffer';
import { generateShortUUID } from '../helpers/utilHelpers';
import AsyncStorageService from './AsyncStorageService';
import { getServer } from '../helpers/serverHelpers';

interface StringMap {
    [key: string]: string;
}

function toQueryString(params: StringMap) {
    '?' +
        Object.entries(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join('&');
}

function URLEncode(str) {
    return str
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function sha256(buffer) {
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        buffer,
        { encoding: Crypto.CryptoEncoding.BASE64 }
    );
}

export async function loginPKCEFlow(): Promise<void> {
    const state = generateShortUUID();
    const randomBytes = await Random.getRandomBytesAsync(32);
    const base64String = Buffer.from(randomBytes).toString('base64');
    const code_verifier = URLEncode(base64String);
    const code_challenge = URLEncode(await sha256(code_verifier));
    const redirectUrl = AuthSession.getRedirectUrl();
    const authenticationOptions = {
        response_type: 'code',
        code_challenge: code_challenge,
        code_challenge_method: 'S256',
        client_id: process.env.AUTH0_CLIENT_ID,
        redirect_uri: redirectUrl,
        scope: 'openid profile email offline_access',
        audience: process.env.ROOT_API_URL,
        state,
    };

    const authUrl =
        `${process.env.AUTH0_DOMAIN}authorize` +
        toQueryString(authenticationOptions);

    const result = await AuthSession.startAsync({
        authUrl: authUrl,
    });

    if (
        result.type === 'success' &&
        result.params &&
        result.params.code &&
        result.params.state === state
    ) {
        const code = result.params.code;
        const authorizationCodeResponse = await getServer(
            'authorization-code',
            {
                code,
                codeVerifier: code_verifier,
                redirectUrl,
            }
        );
        if (authorizationCodeResponse.data.accessToken) {
            await AsyncStorageService.setAccessToken(
                authorizationCodeResponse.data.accessToken
            );
        }
    }
}
```

Note that you'll the variables `AUTH0_CLIENT_ID`, `ROOT_API_URL`, and `AUTH0_DOMAIN` all to be set in your environment! You can also see in the final code that I'm utilizing the recommended (though optional) `state` parameter, by creating a random small string with this little function:

```typescript
export function generateShortUUID(): string {
    return Math.random()
        .toString(36)
        .substring(2, 15);
}
```

and ensuring the returned value from the GET call has the same `state` value. This is one way of reducing your app's vulnerability to cross-site request forgery (CSRF) attacks. Finally, my `AsyncStorageService` and `getServer` are just helpful wrappers of mine which go around React Native's `AsyncStorage` and a standard `fetch` GET request, respectively. I'll leave those for you to implement them how you'd like. :smile: And finally _finally_, the functions `toQueryString`, `URLEncode`, and `sha256` would probably best live in another util functions file. I've just put them all together for easy illustration.

While not in the scope of this post, just a friendly reminder that the subsequent call to the `/oauth/token` endpoint _cannot_ be made from the frontend (nor should it ever, even if auth0 let you! Note: auth0 _doesn't_ let you.) You have to create your own endpoint on your server to forward the values of `code`, `code_verifier`, and `redirect_uri`. It's the only secure way to do get your hands at the refresh token, since you need to store the refresh tokens in a secure place.

Well, that's all. I hope others find this perhaps after the chain of blog posts and StackOverflows that I found. You _can_ get PKCE with React Native and Expo all working together in harmony. :thumbsup:

Cheers :beer:

-Chris

# Footnotes

[^1]:
    There are, of course, technically a few edge cases to this. One case, of course, is if the refresh token _itself_ expires. Then we have no choice but to ask the user to authenticate with an OAuth method again.

[^2]:
    Which now has a link to this blog post in hopes to help those in the future! :smile: