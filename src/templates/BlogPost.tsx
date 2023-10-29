import React, { useEffect } from "react"
import Bio from "../components/layout/Bio/Bio"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import { sanitizeTag } from "../utils/tags/getSanitizedTagsFromEdges"
import { TagRenderer } from "../components/utils/tags/TagRenderer"
import { Link,  graphql } from "gatsby"

export default function BlogPost({ location, pageContext, data, children }: any) {
    useEffect(() => {
        const footnotes = document.getElementsByClassName("footnote-ref")
        Array.prototype.forEach.call(footnotes, function (footnote) {
            footnote.addEventListener("click", function (e: any) {
                e.preventDefault()
                // The href value IS the id of the div
                const footnoteDiv = document.getElementById(
                    footnote.getAttribute("href").replace("#", "")
                )
                if (!footnoteDiv) {
                    return
                }
                window.scrollTo(0, footnoteDiv.offsetTop)
                footnoteDiv.classList.add("highlight")
                setTimeout(
                    () => footnoteDiv.classList.remove("highlight"),
                    2000
                )
            })
        })
    }, [])

    const title = data.mdx.frontmatter.title
    const postDescription = data.mdx.frontmatter.description
    const { previous, next } = pageContext
    const tags = data.mdx.frontmatter.tags
        .split(",")
        .map((x: any) => sanitizeTag(x))

    const getNextPreviousText = () => {
        if (previous && next) {
            return "Next / Previous Post:"
        }
        if (previous && !next) {
            return "Previous Post:"
        }
        return "Next Post:"
    }

    return (
        <Layout location={location}>
            <SEO
                title={title}
                description={postDescription || data.mdx.excerpt}
            />
            <div className="blog-article-wrapper">
                <article>
                    <header>
                        <h1 style={{marginBottom:"0.8rem"}}>{title}</h1>
                        {postDescription && (
                            <p
                                className="monokaiRedFont"
                                style={{
                                    marginTop: 0,
                                    marginBottom: 0,
                                    fontWeight: "bold",
                                }}
                            >
                                {postDescription}
                            </p>
                        )}
                        <p
                            style={{
                                display: `block`,
                                marginBottom: `1rem`,
                                fontStyle: "italic",
                            }}
                        >
                            Posted on {data.mdx.frontmatter.date}
                        </p>
                        <div
                            style={{
                                display: `block`,
                                marginBottom: `1rem`,
                            }}
                        >
                            <i>Tags: </i>
                            <TagRenderer
                                withTitle={false}
                                linkToTagPage={true}
                                tags={tags}
                            />
                        </div>
                    </header>
                    {children}
                </article>
                <h3>{getNextPreviousText()}</h3>
                <nav>
                    <div
                        style={{
                            display: `flex`,
                            flexWrap: `wrap`,
                            justifyContent: `space-around`,
                            alignContent: "center",
                            padding: 0,
                        }}
                    >
                        {previous && (
                            <Link to={previous.fields.slug} rel="prev">
                                <div
                                    style={{
                                        display: `flex`,
                                        flex: `flex-row`,
                                        justifyContent: `space-around`,
                                        alignItems: "center",
                                        padding: "1rem",
                                        margin: "1rem",
                                        backgroundColor: "#272A2A",
                                        borderRadius: "50px",
                                    }}
                                >
                                    <div>⬅️</div>
                                    <div
                                        style={{
                                            maxWidth: "400px",
                                            padding: "1rem",
                                        }}
                                    >
                                        {previous.frontmatter.title}
                                    </div>
                                </div>
                            </Link>
                        )}
                        {next && (
                            <Link to={next.fields.slug} rel="next">
                                <div
                                    style={{
                                        display: `flex`,
                                        flex: `flex-row`,
                                        justifyContent: `space-around`,
                                        alignItems: "center",
                                        padding: "1rem",
                                        margin: "1rem",
                                        backgroundColor: "#272A2A",
                                        borderRadius: "50px",
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "400px",
                                            padding: "1rem",
                                            textAlign: "right",
                                        }}
                                    >
                                        {next.frontmatter.title}
                                    </div>
                                    <div>➡️</div>
                                </div>
                            </Link>
                        )}
                    </div>
                </nav>
                <div className="blog-post-footer">
                    <Bio />
                </div>
                <h3>Find more posts by tag:</h3>
                <TagRenderer withTitle={false} linkToTagPage={true} />
            </div>
        </Layout>
    )
}

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!) {
        site {
            siteMetadata {
                title
                siteUrl
                description
            }
        }
        mdx(fields: { slug: { eq: $slug } }) {
            id
            excerpt(pruneLength: 160)
            frontmatter {
                title
                date(formatString: "MMMM D, YYYY")
                description
                tags
            }
            body
        }
    }
`
