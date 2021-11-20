import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/layout/Bio/Bio"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
// import { Disqus } from "gatsby-plugin-disqus"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { TagRenderer } from "../components/utils/tags/TagRenderer"
import { sanitizeTag } from "../utils/tags/getSanitizedTagsFromEdges"

class BlogPost extends React.Component {
    componentDidMount() {
        const footnotes = document.getElementsByClassName("footnote-ref")
        Array.prototype.forEach.call(footnotes, function (footnote) {
            footnote.addEventListener("click", function (e) {
                e.preventDefault()
                // The href value IS the id of the div
                const footnoteDiv = document.getElementById(
                    footnote.getAttribute("href").replace("#", "")
                )
                window.scrollTo(0, footnoteDiv.offsetTop)
                footnoteDiv.classList.add("highlight")
                setTimeout(
                    () => footnoteDiv.classList.remove("highlight"),
                    2000
                )
            })
        })
    }
    render() {
        const post = this.props.data.mdx
        const title = post.frontmatter.title
        const postDescription = post.frontmatter.description
        const siteTitle = this.props.data.site.siteMetadata.title
        const description = this.props.data.site.siteMetadata.description
        const { previous, next } = this.props.pageContext
        const tags = post.frontmatter.tags.split(",").map((x) => sanitizeTag(x))

        // const disqusConfig = {
        //     url: `${this.props.data.site.siteMetadata.siteUrl +
        //         this.props.location.pathname}`,
        //     identifier: post.id,
        //     title: title,
        // }

        const getNextPreviousText = () => {
            if (previous && next) {
                return "Next or Previous Post:"
            }
            if (previous && !next) {
                return "Previous Post:"
            }
            return "Next Post:"
        }

        return (
            <Layout
                location={this.props.location}
                title={siteTitle}
                description={description}
            >
                <SEO
                    frontmatter={post.frontmatter}
                    description={postDescription || post.excerpt}
                    isBlogPost={true}
                />
                <article>
                    <header>
                        <h1>{title}</h1>
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
                            Posted on {post.frontmatter.date}
                        </p>
                        <p
                            style={{
                                display: `block`,
                                marginBottom: `1rem`,
                            }}
                        >
                            <i>Tags: </i>
                            <TagRenderer withTitle={false} linkToTagPage={true} tags={tags} />
                        </p>
                    </header>
                    <MDXRenderer>{post.body}</MDXRenderer>
                    {/* <Disqus config={disqusConfig} /> */}
                    <div className="blog-post-footer">
                        <Bio />
                    </div>
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
                                        padding: 0,
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
                                        padding: 0,
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
                <h3>Or find more posts by tag:</h3>
                <TagRenderer withTitle={false} linkToTagPage={true} />
            </Layout>
        )
    }
}

export default BlogPost

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
            body
            frontmatter {
                title
                date(formatString: "MMMM D, YYYY")
                description
                tags
            }
        }
    }
`
