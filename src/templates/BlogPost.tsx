import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/layout/Bio"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
// import { Disqus } from "gatsby-plugin-disqus"
import { MDXRenderer } from "gatsby-plugin-mdx"

class BlogPost extends React.Component {
    componentDidMount() {
        const footnotes = document.getElementsByClassName("footnote-ref")
        Array.prototype.forEach.call(footnotes, function(footnote) {
            footnote.addEventListener("click", function(e) {
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
        // const disqusConfig = {
        //     url: `${this.props.data.site.siteMetadata.siteUrl +
        //         this.props.location.pathname}`,
        //     identifier: post.id,
        //     title: title,
        // }

        return (
            <Layout
                location={this.props.location}
                title={siteTitle}
                description={description}
            >
                <SEO
                    title={title}
                    description={postDescription || post.excerpt}
                />
                <article>
                    <header>
                        <h1
                            style={{
                                marginTop: `1rem`,
                                marginBottom: 0,
                            }}
                        >
                            {title}
                        </h1>
                        {postDescription && <p
                            className="monokaiRedFont"
                            style={{
                                
                                marginTop: 0,
                                marginBottom: 0,
                                fontWeight: 'bold',
                            }}
                        >
                            {postDescription}
                        </p>}
                        <p
                            style={{
                                
                                display: `block`,
                                marginBottom: `1rem`,
                                fontStyle: "italic",
                            }}
                        >
                            Posted on {post.frontmatter.date}
                        </p>
                    </header>
                    <MDXRenderer>{post.body}</MDXRenderer>
                    {/* <Disqus config={disqusConfig} /> */}
                    <div className="blog-post-footer">
                        <Bio />
                    </div>
                </article>

                <nav>
                    <ul
                        style={{
                            display: `flex`,
                            flexWrap: `wrap`,
                            justifyContent: `space-between`,
                            listStyle: `none`,
                            padding: 0,
                        }}
                    >
                        <li>
                            {previous && (
                                <Link to={previous.fields.slug} rel="prev">
                                    ← {previous.frontmatter.title}
                                </Link>
                            )}
                        </li>
                        <li>
                            {next && (
                                <Link to={next.fields.slug} rel="next">
                                    {next.frontmatter.title} →
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
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
            }
        }
    }
`