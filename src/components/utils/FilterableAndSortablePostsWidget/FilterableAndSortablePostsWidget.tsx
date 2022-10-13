import { graphql, Link, useStaticQuery } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import PostListingType from "../../../enums/PostListingType"
import { getActiveTheme } from "../../../utils/getActiveTheme"
import { applyPostListingTypeToPosts } from "../../../utils/applyPostListingTypeToPosts"
import { sanitizeTag } from "../../../utils/tags/getSanitizedTagsFromEdges"
import { TagRenderer } from "../tags/TagRenderer"
import { genericSearch } from "../../../utils/genericSearch"
import { SearchContext } from "../../../context/search/SearchContext"

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
            allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
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
    return (
        <>
            {filteredPosts
                .filter((filteredPost) =>
                    genericSearch(
                        filteredPost.node.frontmatter,
                        ["title", "description", "tags"],
                        query
                    )
                )
                .map(({ node }, index) => {
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
                        <Link
                            className={wrapperClassName}
                            to={node.fields.slug}
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
                                        {title}
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
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                node.frontmatter.description ||
                                                node.excerpt,
                                        }}
                                    />
                                </section>
                                <TagRenderer
                                    withTitle={false}
                                    linkToTagPage={true}
                                    tags={tags}
                                />
                            </article>
                        </Link>
                    )
                })}
        </>
    )
}
