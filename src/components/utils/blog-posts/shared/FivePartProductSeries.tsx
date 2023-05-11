import React from "react"
import { Link } from "gatsby"

export interface IFivePartProductSeriesProps {
    dontLinkURL: string
    isProductPage: boolean
}

export default function FivePartProductSeries(props: IFivePartProductSeriesProps) {
    const { dontLinkURL, isProductPage } = props
    const thisPostText = "(This Post!)"

    const configs = [
        {
            link: "/blog/im-launching-five-profitable-products-in-2021",
            label: "Introduction and Overview Post",
        },
        {
            link:
                "/blog/releasing-5-products-in-2021-part-1-the-wheel-screener",
            label: "Product 1: The Wheel Screener",
        },
        {
            link: "/blog/releasing-5-products-in-2021-part-2-moniter",
            label: "Product 2: Moniter",
        },
        { link: "", label: "Product 3: ReduxPlate (Details Coming Soon!)" },
        { link: "", label: "Product 4: Advanced TypeScript Cookbook (Details Coming Soon!)" },
        {
            link: "",
            label:
                "Product 5: Git Stickers (Details Coming Soon!)",
        },
    ]

    return (
        <>
            <i>
                <p>
                    This "Products of 2021" series will be a total of six posts.
                    The first is the introduction to the series itself. The five
                    product links will be updated throughout 2021 as I release
                    the products to the world. These links will be pinned to the
                    top of each post in the series.
                </p>
                <ul>
                    {configs.map((config, index) => {
                        const text =
                            dontLinkURL === config.link
                                ? <b> {config.label} {thisPostText} </b>
                                : config.label
                        if (config.link === "" || dontLinkURL === config.link) {
                            return <li key={index}>{text}</li>
                        }

                        return (
                            <li key={index}>
                                <Link to={config.link}>{text}</Link>
                            </li>
                        )
                    })}
                </ul>
                {isProductPage && (
                    <p>
                        These product posts will all have the same format for
                        readability. They will always have the same three
                        sections:
                        <br />
                        <br />
                        1. 'Product Overview', where I describe the product
                        itself.
                        <br />
                        2. 'Key Takeaways From Launch', where I discuss
                        everything I've learned from before and after launch.
                        <br />
                        3. 'Next Steps', where I mention what I am planning to
                        develop further for the product.
                    </p>
                )}
            </i>
        </>
    )
}
