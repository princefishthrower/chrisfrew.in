import { graphql, Link, useStaticQuery } from "gatsby"
import * as React from "react"
import { useContext, useEffect } from "react"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import PostListingType from "../../../enums/PostListingType"
import { getActiveTheme } from "../../../utils/getActiveTheme"
import { applyPostListingTypeToPosts } from "../../../utils/applyPostListingTypeToPosts"
import { sanitizeTag } from "../../../utils/tags/getSanitizedTagsFromEdges"
import { TagRenderer } from "../tags/TagRenderer"
import { genericSearch } from "../../../utils/genericSearch"
import { SearchContext } from "../../../context/search/SearchContext"
import { HighlightText } from "../HighlightText"

export interface IFilterableAndSortablePostsWidgetProps {
    postListingType: PostListingType
}

export interface IPost {
    node: {
        excerpt: string
        fields: {
            slug: string
        }
        frontmatter: {
            title: string
            description: string
            tags: string
            date: string
            topPostOrder?: number
            cleanReactTypeScriptHooksOrder?: number
            cleanCrudApisOrder?: number
        }
    }
}

export function FilterableAndSortablePostsWidget(
    props: IFilterableAndSortablePostsWidgetProps
) {
    const { setQuery } = useContext(SearchContext)
    // on unmount, reset the search query
    useEffect(() => {
        return () => {
            setQuery("")
        }
    }, [])

    const { postListingType } = props
    const allPosts = useStaticQuery(graphql`
        query allPostsQuery {
            site {
                siteMetadata {
                    title
                    description
                    subtitle
                    subsubtitle
                }
            }
            allMdx(sort: { frontmatter: { date: DESC } }) {
                edges {
                    node {
                        excerpt
                        fields {
                            slug
                        }
                        frontmatter {
                            date(formatString: "MMMM D, YYYY")
                            title
                            description
                            tags
                            topPostOrder
                            cleanReactTypeScriptHooksOrder
                            cleanCrudApisOrder
                        }
                    }
                }
            }
        }
    `)
    const posts = allPosts.allMdx.edges
    const filteredPosts = applyPostListingTypeToPosts(postListingType, posts)
    const { themeBodyClass } = useContext(ThemeContext)
    const { query } = useContext(SearchContext)
    const activeTheme = getActiveTheme(themeBodyClass)

    const hexColorsLength = activeTheme.themeColorHexCodes.length
    const wrapperClassName =
        postListingType === PostListingType.LATEST || PostListingType.RECENTS
            ? "latest-post-container"
            : "standard-post-container"
    const filteredAndSearchedPosts = filteredPosts.filter((filteredPost) =>
        genericSearch(
            filteredPost.node.frontmatter,
            ["title", "description", "tags"],
            query
        )
    )
    if (filteredAndSearchedPosts.length === 0) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "1rem",
                }}
            >
                <h3>No posts matching "{query}"!</h3>
                <p>
                    Try searching for something else, or{" "}
                    <Link to="/">head back to the homepage</Link> for most posts.
                </p>
            </div>
        )
    }

    return (
        <>
            {filteredAndSearchedPosts.map(({ node }, index) => {
                const title = node.frontmatter.title || node.fields.slug
                const tags = node.frontmatter.tags
                    .split(",")
                    .map((x) => sanitizeTag(x))
                const color =
                    activeTheme.themeColorHexCodes[
                        ((index % hexColorsLength) + hexColorsLength) %
                            hexColorsLength
                    ]
                return (
                    <div
                        key={node.fields.slug}
                        className={wrapperClassName}
                        onClick={() => {
                            // redirect to the post page
                            window.location.href = node.fields.slug
                        }}
                    >
                        <article key={node.fields.slug}>
                            <header>
                                <div style={{ borderColor: color }} />
                                <h3
                                    style={{
                                        marginTop: "1rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    <HighlightText text={title} highlights={[query]} />
                                </h3>
                                <div style={{ borderColor: color }} />
                                <small
                                    className="blog-post-date"
                                    style={{ color }}
                                >
                                    {node.frontmatter.date}
                                </small>
                            </header>
                            <section>
                                {/* <p
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            node.frontmatter.description ||
                                            node.excerpt,
                                    }}
                                /> */}
                                <HighlightText text={node.frontmatter.description ||
                                            node.excerpt} highlights={[query]} />
                            </section>
                            <TagRenderer
                                withTitle={false}
                                linkToTagPage={true}
                                tags={tags}
                            />
                        </article>
                    </div>
                )
            })}
        </>
    )
}
