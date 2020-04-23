---
title: Dropdowns in Markdown README's!
description:
date: "2017-12-22"
draft: false
starID: 7
postType: dev
---

## HTML in Markdown!?
Well, it's a little known fact (at least it was for me) that you can use native HTML tags are supported in Markdown, though the support over different sites is varying. I would say the code presented here should work on about 99% of pages - let me know if that's not the case

## Code
To get this to work in most environments<sup>1</sup> all we have to do is to make use of the `<details>` tag. Since you probably want your dropdown to have a title, we also need to use the `<summary>` tag. So a cool markdown dropdown could look as simple as this:

```markdown
<details><summary>Cool Dropdown</summary><br>
blah blah blah blah you found me!
</details>
```

Or, rendered (go on and give the arrow a click!):
<details><summary>Cool Dropdown</summary><br>
blah blah blah blah you found me!
</details>

Of course, all goodies of markdown will work inside of this dropdown - lists, links, etc.

## Longer Example
Here's a bigger example for your copypasta pleasure:
```markdown
<p>
<details><summary>Cool Dropdown #1</summary><br>

```js
// so wow, much amazing... you can even put code in these drop downs!
document.getElementById('root')
```s

[Or a link - like to google](https://google.com)

- Or a List
  - or a nested List
  - like this
  - with :smile: emojis
- Like this

Or even just normal text

</details>

<details><summary>Cool Dropdown #2</summary><br>

More cool text hiding in my dropdown

</details>

<details><summary>Cool Dropdown #3</summary><br>

Easter egg! :egg::egg::egg:

</details>
</p>
```

Rendered on this page, that snippet looks like this:

<p>
<details><summary>Cool Dropdown #1</summary><br>

```js
// so wow, much amazing... you can even put code in these drop downs!
document.getElementById('root')
```

[Or a link - like to google](https://google.com)

- Or a List
  - or a nested List
  - like this
  - with :smile: emojis
- Like this

Or even just normal text

</details>

<details><summary>Cool Dropdown #2</summary><br>

More cool text hiding in my dropdown

</details>

<details><summary>Cool Dropdown #3</summary><br>

Easter egg! :egg::egg::egg:

</details>
</p>
```

## Most Important - Use It!

I for one am going to start using this in my README's. After all, it is the first page a lot of developers and users see, so using these dropdowns would be a nice simple way to keep your README uncluttered and organized - the communitiy at large will benefit and thank you for piece-wise docs.

<hr/>

## Footnotes
1. This page you are looking at right now is generated with Gatsby (which generates React HTML from markdown), and I know these dropdowns work on the Markdown of GitHub too.
