import * as React from "react"
import LinkPreview from "../utils/blog-posts/shared/LinkPreview"

export default function FullStackSaasProductCookBookLinks() {
    return (
        <div className="full-stack-saas-product-cookbook-links">
            <h3>Plug Zone</h3>
            Speaking of <a href="https://reduxplate.com">ReduxPlate</a>, which automatically generates Redux code for you - I'm
            writing a book, and pairing it with a course, which documents every
            step I took along the way to build ReduxPlate - from boilerplate starters
            to the finished live product. I'd love it if you check out any or all of
            the following links!
            <p><b>The book:</b></p>
            <LinkPreview
                url="https://chrisfrew.in/book"
                fallbackTitle="Full Stack SaaS Product Cookbook"
                fallbackDescription="From Soup 🍜 to Nuts 🥜 - Create a Profitable SaaS Product as a Solo Developer in Days!"
                fallbackImage="https://coffee-app.sfo2.cdn.digitaloceanspaces.com/full-stack-sass-product-cookbook/cover.jpg"
            />
            <p><b>The GitHub organization:</b></p>
            <LinkPreview
                url="https://github.com/Full-Stack-SaaS-Product-Cookbook"
                fallbackTitle="Full Stack SaaS Product Cookbook GitHub Organization"
                fallbackDescription="From Soup 🍜 to Nuts 🥜 - Create a Profitable SaaS Product as a Solo Developer in Days!"
                fallbackImage="https://coffee-app.sfo2.cdn.digitaloceanspaces.com/full-stack-sass-product-cookbook/cover.jpg"
            />
            <p><b>The product:</b></p>
            <LinkPreview
                url="https://reduxplate.com"
                fallbackTitle="ReduxPlate"
                fallbackDescription="Never write a line of Redux again."
                fallbackImage="https://coffee-app.sfo2.cdn.digitaloceanspaces.com/reduxplate/ReduxPlateLogo.png"
            />
            <p>You're reading this correctly! I literally build ReduxPlate from start to finish, right before your eyes - and the code is all public!</p>
        </div>
    )
}
