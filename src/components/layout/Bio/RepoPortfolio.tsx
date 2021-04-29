import * as React from "react"
import { GitHubItem } from "./GitHubIcons/GitHubItem"

export function RepoPortfolio() {
    const repoNames = [
        "chrisfrew.in",
        "react-redux-shopify-storefront-api-example",
        "react-redux-typescript-shopify-storefront-api-example",
        "react-typescript-generic-search-sort-and-filter",
        "instagramize"
    ]
    return (
        <>
            <p className="text-center font-weight-bold">Selected Repositories</p>
            <div className="packages-flex-container">
                {repoNames.map((repoName) => {
                    return <GitHubItem repoName={repoName} hasNpmBadge={false} />
                })}
            </div>
        </>
    )
}
