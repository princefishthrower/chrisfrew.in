import * as React from "react"
import Sparkles from "../../../utils/Sparkles"

export function BookPortfolio() {
    return (
        <>
            <p className="text-center font-weight-bold">Books</p>
            <div className="flex-container">
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
