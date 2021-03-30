---
title: "Releasing Five Products in 2021, Part 1: The Wheel Screener"
description: "Insights from the frontlines of a SaaS product release: an advanced cash secured put (CSP) and covered call (CC) options screener."
date: "2021-03-25"
draft: false
---

import FivePartProductSeries from "../../../components/utils/FivePartProductSeries"

<FivePartProductSeries dontLinkURL="/blog/releasing-5-products-in-2021-part-1-the-wheel-screener" isProductPage="true"/>

<!-- Stuff for medium: -->
<!-- # Greetings!

Hi everyone! You may recognize me from other full stack posts I've published here in The Startup relating to specific software challenges, some of which include:

https://medium.com/swlh/extending-react-standard-types-to-allow-for-children-as-a-function-ba7fdde52e0b

https://medium.com/swlh/c-net-core-and-typescript-using-generics-and-linq-to-secure-and-filter-operations-on-your-e85e23e065c3

https://medium.com/swlh/magento-2-ip-location-detection-geoip-and-store-context-control-using-the-ipstack-api-b48c17cc19c7

Today, I'm proud to say that I'm able to post here with an actual product of mine, and even prouder to say that it's my **first ever successful and profitable SaaS product!** * If you've liked my other code-based posts, I hope you'll read this one, and that you'll gain some insights into the other side of product development: marketing and the real-world product launch.

*Stay tuned, this post here talks about just the first of potentially **_five_** products I want to release in 2021! -->

# Product Overview

The Wheel Screener is a market-wide options screener. Currently, it focuses on both cash secured puts (CSPs) and covered calls (CCs). Each day before the market opens, I retrieve all options contracts across the entire market. I then run calculations on them, filtering out options by certain criteria and scoring the remaining by their estimated return (reward to risk ratio) and their probability of profit, as well as a few other select metrics.

Currently, The Wheel Screener has over 100 free subscribers, **and 20-30 premium subscribers!** The premium subscription is $5/month.

# Key Takeaways From Launch

## 1. Customer Value is Everything - Otherwise, What Else is Your Product For?

You want a profitable SaaS product? Then release your product. Listen to and implement your customers' feedback. Repeat. 

You **don't** need super fancy styles.

You **don't** need ultra-clean code.

You **don't** need a giant email list.

While these things are important in the long run, **the _most_ important thing about your product is the straight-up value it provides to the customer**. I mean, imagine designing _any_ product where the value it delivers to its customers isn't the top priority. Then it's at best a hobby project, or at worst - a bad product. If customer value isn't the top priority of your product, you should ask yourself, why are you building that product? 

If customers are happy and getting value out of your product, they will see things like styles and branding for example as an added benefit or afterthought at most, and they _certainly_ won't see whatever code or framework you are running behind the scenes!

At the beginning of the days I have blocked off to work on The Wheel Screener, I ask myself: 

>What feature or feature(s) have been asked about the most? What feature(s) will provide the most value?

and then I build those. 

I don't worry too much about using the ultimate newest tool or newest software pattern or the cleanest possible code in the whole universe to implement it. The extent to which I worry about the software portion of the project is only to the extent to which the feature or solution is sustainable and maintainable into the future. Yes, "clean enough" is a thing - and there will always be TODOs no matter what feature you build. _That's why they're called TODOs - you can implement them at any later date._

## 2. Customers and Early Adopters are Awesome

I knowingly released The Wheel Screener well before it was a tried-and-true alpha product - it was really more like a beta release to the public - but I didn't want to fall into the infinite loop of "let me just implement this feature, _then_ I'll release it." which has plagued me far too often with other projects. No, I wanted to get it out there for product validation, because, as I'll discuss below, true believers or customers of your product won't mind a few bugs here and there, especially when you are clear that it is a solo project.

To this point's title, the early adopters have been awesome. All of them have been understanding and many have pointed out sneaky bugs that I was able to fix only with their help! I was truly worried that paying customers might get angry and unsubscribe forever by just finding one bug. But so far, I have yet to see that happen. So, all you subscribing customers out there, you are awesome, and thanks for all the help so far! I hope I can return the favor to the best of my abilities with some awesome features I have planned!

## 3. Google Ads are Expensive

Currently, I have a small Google Ad campaign running for The Wheel Screener - I've yet to do an in-depth analysis on its performance - perhaps it will be a blog post to come. **Compared to the impressions that Instagram cites, these Google Ads are relatively more expensive (in terms of cost per click or impression).** However, I haven't done a side-by-side comparison - perhaps that is also a blog post to come.

## 4. Marketing is Difficult, Or At Least Not Free

Though I've been hearing it for years, it still seems like proper marketing is still a major pain point for indie hackers, solo entrepreneurs, and SaaS folks in general. **I think the hard part is finding marketing _without_ diving into the whole advertisement universe - people want to find a way to do it for free, or at least at very low cost.** Perhaps there really is no good free marketing out there? I'm not an expert on this, and time will tell. I'm hoping to improve and build my marketing skills in parallel throughout this year to figure out how to best market products efficiently.

## 5. Beware of Subreddit Rules!

My success so far with The Wheel Screener has come at a sad cost to my account on Reddit. My warning to future founders, product launchers, and marketers is this: 

**Beware of 'self-promotion posts' on various subreddits! You may get permanently banned for self-promotion even if your product has a totally free part, and even if that free part is totally generous! If you have _any_ reference to a payment plan or revenue model, your post may be deleted and you may be banned!**

I face this sad fate in two communities I've loved in the past - both /r/algotrading and /r/wallstreetbets, and it doesn't look like either of those ruling will be reversed 😞. Furthermore, I was looking at using Reddit's ad platform, and it seems like those massive communities like /r/wallstreetbets aren't available for advertising? Does anyone have insight into this? I would love to learn why certain subreddits don't seem to appear in [Reddit's ad platform](https://ads.reddit.com/).

## 6. A Staging or Testing Environment is Essential

This one is rather painful, but is really a requirement for anybody serious in releasing a SaaS product. Alongside the production site of The Wheel Screener, I have a staging site for it: [staging.wheelscreener.com](staging.wheelscreener.com). All the backend is in a staging environment as well - Stripe is in its test mode, PayPal is in its Sandbox mode, and even the PostgreSQL database has its own staging version of the database. 

Last week when I released a flurry of new features, I uncovered numerous bugs that were only revealed in such a "production-like" but "not quite production" environment - I didn't see them on my development machine. **I guarantee this is true for any SaaS product that anyone wishes to build, and so a real staging/test site is essential to catch these bugs before they move into the production product.** 

I _do_ have a [Bitbucket Pipelines Course](https://www.udemy.com/course/mastering-bitbucket-pipelines/?referralCode=1D00780943BAE3B9685B) which gets into this develop-staging-master chain as a part of teaching the greater BitBucket Pipelines environment, and you can also read [my blog post on Bitbucket Pipelines](https://chrisfrew.in/blog/mastering-bitbucket-pipelines-for-ci-and-cd/) as a brief overview of everything covered in that course. 

I plan to eventually release a course on how to set up a fully-automated dynamic staging and master environments, complete with separate databases, API keys, and so on - likely with a .NET backend and React TypeScript frontend. 

If you do some careful configuration and scripting, the only work you should need to do as a dev is merge your code to staging or master for the environment to configure and build itself. It is essential to learn how to do this if you are an indie hacker, maker, or solo founder. It saves an infinite amount of time and can catch an infinite amount of bugs.

# Next Steps For This Product

I've got something really big planned for The Wheel Screener, with goals to make it a major player in the (unfortunately?) limited niche of options trading tools. What I have planned specifically may be the first of its kind ever in terms of e-brokerage tools. 😉 In short, it's gonna be awesome! 🚀

While this first post in my "Products of 2021" series has come to an end, I encourage you to bookmark the blog on [The Wheel Screener's Blog](https://wheelscreener.com/blog) - unfortunately at the time, bookmarking and occasionally checking the blog is the _only_ way to find updates there. I'm still working on implementing a real email subscription there. (Remember what I said about customer value vs. building certain features? 😄)

Until next time!

Cheers 🍺

-Chris