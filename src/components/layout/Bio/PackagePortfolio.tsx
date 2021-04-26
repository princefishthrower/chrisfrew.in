import * as React from "react"
import { GitHubItem } from "./GitHubIcons/GitHubItem"

export function PackagePortfolio() {
    return (
        <>
            <p className="text-center font-weight-bold">npm Packages</p>
            <div className="packages-flex-container">
                <GitHubItem repoName="react-use-please-stay" hasNpmBadge={true}/>
            </div>
        </>
    )
}
