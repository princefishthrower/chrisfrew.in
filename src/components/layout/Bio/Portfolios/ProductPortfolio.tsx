import * as React from "react"

export function ProductPortfolio() {
    return (
        <>
            <p className="text-center font-weight-bold">Products</p>
            <div className="flex-container">
            <a
                    href="https://reduxplate.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ReduxPlate
                </a>
                 • 
                <a
                    href="https://wheelscreener.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    The Wheel Screener
                </a>
                 • 
                <a
                    href="https://rœst.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    RŒST
                </a>
            </div>
        </>
    )
}
