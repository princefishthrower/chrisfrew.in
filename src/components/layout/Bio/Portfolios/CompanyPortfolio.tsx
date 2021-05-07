import * as React from "react"
import Sparkles from "../../../utils/Sparkles"

export function CompanyPortfolio() {
    return (
        <>
            <p className="text-center font-weight-bold">Companies</p>
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
