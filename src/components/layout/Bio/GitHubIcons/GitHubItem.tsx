import * as React from "react"

export interface IGitHubItemProps {
    repoName: string
    hasNpmBadge: boolean
}

export function GitHubItem(props: IGitHubItemProps) {
    const { repoName, hasNpmBadge } = props
    return (
        <>
            <a
                href={`https://github.com/princefishthrower/${repoName}`}
                target="_blank"
                rel="noreferrer"
            >
                {" "}
                <pre style={{ display: "inline", marginBottom: "15px" }}>
                    {repoName}
                </pre>
            </a>
            {hasNpmBadge && (
                <img
                    src={`https://img.shields.io/npm/v/${repoName}.svg?style=flat`}
                />
            )}
            {hasNpmBadge && (
                <img style={{ marginLeft: "5px" }} src={`https://img.shields.io/npm/dt/${repoName}`} />
            )}
            <img
                style={{ marginLeft: "5px" }}
                src={`https://img.shields.io/github/stars/princefishthrower/${repoName}?style=social`}
            />
        </>
    )
}
