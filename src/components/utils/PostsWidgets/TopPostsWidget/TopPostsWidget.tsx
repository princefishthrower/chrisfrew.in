import { graphql, Link, useStaticQuery } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../../context/theme/ThemeContext"
import { getActiveTheme } from "../../../../utils/getActiveTheme"
import { sanitizeTag } from "../../../../utils/tags/getSanitizedTagsFromEdges"
import { TagRenderer } from "../../tags/TagRenderer"

export interface ITopPostsWidgetProps {}

// TODO: this and the other post widgets should be refactored to accept limit, fitler, and sort functions
// See: https://www.gatsbyjs.com/docs/graphql-reference/#query-variables
export function TopPostsWidget() {
    const data = useStaticQuery(
        graphql`
            query topPostQuery {
                site {
                    siteMetadata {
                        title
                        description
                        subtitle
                        subsubtitle
                    }
                }
                allMdx(
                    sort: { fields: [frontmatter___topPostOrder], order: ASC }
                    filter: { frontmatter: { topPostOrder: { ne: null } }}
                ) {
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
                            }
                        }
                    }
                }
            }
        `
    )
    const { themeBodyClass } = useContext(ThemeContext)
    const activeTheme = getActiveTheme(themeBodyClass)

    const posts = data.allMdx.edges
    const hexColorsLength = activeTheme.themeColorHexCodes.length
    return (
        <>
            {posts.map(({ node }, index) => {
                const title = node.frontmatter.title || node.fields.slug
                const tags = node.frontmatter.tags
                    .split(",")
                    .map((x) => sanitizeTag(x))
                    const color = activeTheme.themeColorHexCodes[
                        ((index % hexColorsLength) +
                            hexColorsLength) %
                            hexColorsLength
                    ]
                return (
                    <>
                    <div className="top-post-container">
                        <article key={node.fields.slug}>
                            <header>
                                <div
                                    style={{ borderColor: color }}
                                />
                                <h3 style={{marginTop: '1rem', fontWeight: 700}}>
                                    <Link
                                        style={{
                                            boxShadow: `none`,
                                        }}
                                        to={node.fields.slug}
                                    >
                                        {title}
                                    </Link>
                                </h3>
                                <div
                                    style={{ borderColor: color }}
                                />
                                <small className="blog-post-date" style={{color}}>
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
                    </div>
                    </>
                )
            })}
        </>
    )
}
