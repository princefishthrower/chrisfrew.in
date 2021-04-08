import * as React from "react"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"
import Sparkles from "../../utils/Sparkles"

export function Book() {
    return (
        <>
            <h1 className="cooper big">
                {colorizeStringBySeparator(
                    "📘 Full Stack SaaS Product Cookbook",
                    ""
                )}
            </h1>
            <h2>From Soup 🍜 to Nuts 🥜 - Creating a Profitable SaaS Product as a Solo Developer in Days</h2>
            <p>In the <i>Full Stack SaaS Product Cookbook</i>, you'll learn in step-by-step tutorials how to do the following:</p>
                <ul>
                    <li>Frontend: how to build an amazing Gatsby site using TypeScript and React, and use Netlify as your frontend CI / CD framework.</li> 
                    <li>Backend: how to use FaunaDB for user data storage and your own .NET 5.0 API runing on an Ubuntu 20.04 Digital Ocean Droplet with PostgreSQL 13 for anything more advanced that you may need, and use BitBucket Pipelines as your backend CI / CD framework.</li> 
                    <li>How to use Slack and logz.io for monitoring and logging, respectively.</li>
                    <li>How to implement Stripe, Gumroad, and PayPal as your three main payment providers.</li>
                </ul>
                <p>Sound like overkill? <strong>Good, because this isn't a get rich quick scheme. These full stack SaaS products take an enormous amount of work to develop and deploy. My book will show you every step along the way.</strong></p>
            <p>In the end, <strong>you'll be able to build your own completely working full stack SaaS app, from a fancy UI, to a custom API and lambda (AWS) functions, user authentication and authorization, with notifications, logging, emails, and more, at a total cost of $5 / month for the Digial Ocean server droplet.</strong> It's then up to you to market your product to make it profitable. (Or think of it this way: you'll need only 1 monthly $5 / month subscriber to break even on your per-month costs!)</p>
            <p>The full stack process you'll learn from my book is <i>identical</i> to the process I used on <a href="https://wheelscreener.com">The Wheel Screener</a>, and I'm more than happy to share the process with you, for FREE, or however much you'd like to donate.</p>
            <h2 style={{textAlign: 'center'}}><Sparkles>Book Coming Soon</Sparkles></h2>
        </>
    )
}
