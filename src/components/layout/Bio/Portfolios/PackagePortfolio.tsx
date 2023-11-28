import * as React from "react"
import { GitHubItem } from "../GitHubIcons/GitHubItem"

export function PackagePortfolio() {
    return (
        <>
            <h2 className="font-weight-bold">npm Packages</h2>
            <div className="packages-flex-container">
                <GitHubItem repoName="react-use-please-stay" hasNpmBadge={true}/>
            </div>
        </>
    )
}
