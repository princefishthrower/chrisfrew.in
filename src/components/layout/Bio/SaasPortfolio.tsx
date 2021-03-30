import * as React from "react"

export interface ISaaSPortfolioProps {}

export function SaaSPortfolio(props: ISaaSPortfolioProps) {
    return (
        <>
            <div>SaaS Products I've built solo:</div>
            <div>
                <a
                    href="https://wheelscreener.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    wheelscreener.com
                </a>
            </div>
        </>
    )
}
