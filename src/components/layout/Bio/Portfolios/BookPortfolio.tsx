import * as React from "react"
import Sparkles from "../../../utils/Sparkles"

export function BookPortfolio() {
    return (
        <>
            <h2 className="font-weight-bold">Books</h2>
            <div className="flex-container">
                <a
                    href="/books"
                    target="_blank"
                    rel="noreferrer"
                >
                    {" "}
                    <Sparkles wipeType="alternate">Go for Real World Applications</Sparkles>
                </a>
                <a
                    href="https://www.amazon.com/dp/B0949HXN63"
                    target="_blank"
                    rel="noreferrer"
                >
                    {" "}
                    <Sparkles wipeType="alternate">Full Stack SaaS Product Cookbook</Sparkles>
                </a>
            </div>
        </>
    )
}
