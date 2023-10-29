import * as React from "react"
import PostListingType from "../../../enums/PostListingType"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { FilterableAndSortablePostsWidget } from "../../utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget"
import { Search } from "../../utils/search/Search"
import { useStaticQuery, graphql } from "gatsby"

export function Posts() {
    const data = useStaticQuery(graphql`
        query PostCountQuery {
            allMdx(sort: {frontmatter: {date: DESC}}, limit: 1000) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                            date
                            tags
                        }
                    }
                }
            }
            # comment this whole block when working offline:
            allGithubData {
                edges {
                    node {
                        id
                        rawResult {
                            data {
                                repository {
                                    object {
                                        history {
                                            edges {
                                                node {
                                                    commitUrl
                                                    committedDate
                                                }
                                            }
                                            totalCount
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `)
    return (
        <>
            <ColoredTitle title="📜 All Posts From All Time" />
            <p style={{ textAlign: "center" }}>
                Search all <b>{data.allMdx.edges.length}</b> posts!
            </p>
            <Search />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                }}
            >
            <FilterableAndSortablePostsWidget
                postListingType={PostListingType.ALL}
            />
            </div>
        </>
    )
}
