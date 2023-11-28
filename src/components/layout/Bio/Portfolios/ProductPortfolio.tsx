import * as React from "react"

export function ProductPortfolio() {
    return (
        <>
            <h2 className="font-weight-bold">Products</h2>
            <div className="flex-container">

                <a
                    href="https://wheelscreener.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    The Wheel Screener
                </a>
                <a
                    href="https://option-screener.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Option Screener
                </a>
                <a
                    href="https://amtjoy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    AMT JOY
                </a>
                <a
                    href="https://codevideo.io"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    CodeVideo
                </a>
            </div>
        </>
    )
}
