import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/layout/Bio/Bio"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import Paginator from "../components/utils/Paginator"
import { TagRenderer } from "../components/utils/tags/TagRenderer"
import { ColoredTitle } from "../components/utils/ColoredTitle"
import { sanitizeTag } from "../utils/tags/getSanitizedTagsFromEdges"

const BlogTagListing = ({ data, location, pageContext }) => {
    const { tag } = pageContext;
    const title = data.site.siteMetadata.title
    const description = data.site.siteMetadata.description
    const subtitle = data.site.siteMetadata.subtitle
    const posts = data.allMdx.edges
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "chrisfrew.in",
        alternateName: "Chris' Full Stack Blog",
        description: description,
        url: "https://chrisfrew.in",
        logo: "https://chrisfrew.in/favicon.ico",
        sameAs: [
            "https://github.com/princefishthrower",
            "https://www.youtube.com/channel/UCLaNEXFBI1wpGtxvGVjfHKw",
            "https://instagram.com/fullstackcraft",
        ],
    }
    // only take those
    // const postsToRender = posts.filter(({ node }) => { node.frontmatter.tags.includes(tag) })
    return (
        <Layout location={location} title={title} subtitle={subtitle}>
            <SEO title={title} schemaMarkup={schema} />
            <ColoredTitle title={`#️⃣ Posts Tagged With "${tag}"`}/>
            {posts.map(({ node }) => {
                const title = node.frontmatter.title || node.fields.slug
                const tags = node.frontmatter.tags.split(",").map(x => sanitizeTag(x))
                return (
                    <article key={node.fields.slug}>
                        <header>
                            <h3>
                                <Link
                                    style={{ boxShadow: `none` }}
                                    to={node.fields.slug}
                                >
                                    {title}
                                </Link>
                            </h3>
                            <small className="blog-post-date">{node.frontmatter.date}</small>
                            <div>
                                <TagRenderer linkToTagPage={true} tags={tags}/>
                                </div>
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
                    </article>
                )
            })}
            <h3>All Post Tags:</h3>
            <TagRenderer linkToTagPage={true}/>
            <Bio />
        </Layout>
    )
}

export default BlogTagListing

export const blogTagListQuery = graphql`
    query blogTagListQuery($tagRegex: String!) {
        site {
            siteMetadata {
                title
                description
                subtitle
            }
        }
        allMdx(
            sort: { fields: [frontmatter___date], order: DESC },
            filter: { frontmatter: { tags: { regex: $tagRegex}}}
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
