import { graphql, Link, useStaticQuery } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../../context/theme/ThemeContext"
import { getActiveTheme } from "../../../../utils/getActiveTheme"
import { sanitizeTag } from "../../../../utils/tags/getSanitizedTagsFromEdges"
import { TagRenderer } from "../../tags/TagRenderer"

export interface IMostRecentPostWidgetProps {}

export function MostRecentPostWidget() {
    const data = useStaticQuery(
        graphql`
            query mostRecentPostQuery {
                site {
                    siteMetadata {
                        title
                        description
                        subtitle
                        subsubtitle
                    }
                }
                allMdx(
                    limit: 1
                    sort: { fields: [frontmatter___date], order: DESC }
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
    const color = activeTheme.themeColorHexCodes[0]
    return (
        <>
            {posts.map(({ node }) => {
                const title = node.frontmatter.title || node.fields.slug
                const tags = node.frontmatter.tags
                    .split(",")
                    .map((x) => sanitizeTag(x))
                return (
                    <>
                    <h2>Most Recent Post:</h2>
                    <div className="latest-post-container">
                        
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
