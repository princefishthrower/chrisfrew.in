import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import { Fade } from "react-awesome-reveal"
import { ColoredTitle } from "../../utils/ColoredTitle"
import Sparkles from "../../utils/Sparkles"

export function Book() {
    return (
        <>
            <ColoredTitle title="📘 Full Stack SaaS Product Cookbook" />
            <Fade
                triggerOnce={true}
                direction="down"
                delay={1000}
                style={{ textAlign: "center" }}
            >
                <StaticImage
                    src="../../../images/saas-cookbook.png"
                    placeholder="blurred"
                    alt="Chris"
                    width={400}
                    height={400}
                />
            </Fade>
            <h2>
                From Soup 🍜 to Nuts 🥜 - Create a Profitable SaaS Product as a
                Solo Developer in Days!
            </h2>
            <p>
                In the <i>Full Stack SaaS Product Cookbook</i>, you'll learn
                with step-by-step tutorials how to do the following:
            </p>
            <ul>
                <li>
                    Frontend: how to build an amazing Gatsby site using
                    TypeScript and React with Bootstrap styling, and use Netlify
                    as your frontend CI / CD framework.
                </li>
                <li>
                    Backend: how to use Netlify Identity and FaunaDB for user
                    data storage and your own .NET 5.0 API running on an Ubuntu
                    20.04 Digital Ocean Droplet with PostgreSQL 13 for anything
                    more advanced that you may need, and use BitBucket Pipelines
                    as your backend CI / CD framework.
                </li>
                <li>
                    How to use Slack and logz.io for monitoring and logging,
                    respectively.
                </li>
                <li>
                    How to use Mailjet for custom emails and email templates.
                </li>
                <li>
                    How to implement Stripe, Gumroad, and PayPal as your main
                    payment providers.
                </li>
                <li>How to run automation jobs on the backend.</li>
            </ul>
            <p>
                Sound like overkill?{" "}
                <strong>
                    Good, because this isn't a get rich quick scheme. These full
                    stack SaaS products take an enormous amount of work to
                    develop and deploy. My book will show you every step along
                    the way, with plenty of real working code snippets and
                    recipes for anything you may need during the development
                    process.
                </strong>
            </p>
            <p>
                In the end,{" "}
                <strong>
                    you'll be able to build your own completely working full
                    stack SaaS app, from a fancy UI, to a custom API and lambda
                    (AWS) functions, user authentication and authorization, with
                    notifications, logging, emails, and more, at a total cost of
                    $5 / month for the Digital Ocean server droplet.
                </strong>{" "}
                It's then up to you to market your product to make it
                profitable. (Or think of it this way: you'll need only 1 monthly
                $5 / month subscriber to break even on your per-month costs!)
            </p>
            <p>
                The full stack process you'll learn from my book is{" "}
                <i>identical</i> to the process I used on products like{" "}
                <a href="https://wheelscreener.com">The Wheel Screener</a> and{" "}
                <a href="https://park-and-rail.netlify.app">
                    The P+Rail Parking Forecast
                </a>
                . I'm more than happy to share the process with you, for FREE,
                or however much you'd like to donate.
            </p>
            <h2 style={{ textAlign: "center" }}>
                <a
                    href="https://github.com/Full-Stack-SaaS-Product-Cookbook/full-stack-saas-product-cookbook/blob/master/SaaSProductCookbook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Sparkles>View the draft here!</Sparkles>
                </a>
            </h2>
            <p>or</p>
            <h2 style={{ textAlign: "center" }}>
                <a
                    href="https://www.amazon.com/dp/B0949HXN63"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Sparkles>
                        Support me by reserving the Kindle E-Book here!
                    </Sparkles>
                </a>
            </h2>
            {/* Uncomment here on july 2nd! */}
            {/* <p>and</p>
            <h2 style={{ textAlign: "center" }}>
                <a
                    href="https://www.amazon.com/dp/B0949HXN63"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Sparkles>
                        Paperback to be launched with Kindle E-Book (July 2nd)!
                    </Sparkles>
                </a>
            </h2> */}
            <p>
                I've also created a{" "}
                <a
                    href="https://github.com/Full-Stack-SaaS-Product-Cookbook"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub Organization for the book and corresponding code
                    bases
                </a>
                . This organization will include the book source itself (LaTeX)
                as I write it, as well as what I am calling 'milestone'
                repositories that are linked to landmark development points
                throughout book. I invite you to star the book repository and
                join me on this SaaS product journey!
            </p>
        </>
    )
}
