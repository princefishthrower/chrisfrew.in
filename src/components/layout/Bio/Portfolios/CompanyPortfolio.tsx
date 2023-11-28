import * as React from "react"
import Sparkles from "../../../utils/Sparkles"

export function CompanyPortfolio() {
    return (
        <>
            <h2 className="font-weight-bold">Company</h2>
            <div className="flex-container">
                <a
                    href="https://fullstackcraft.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    {" "}
                    <Sparkles>Full Stack Craft</Sparkles>
                </a>
            </div>
        </>
    )
}
