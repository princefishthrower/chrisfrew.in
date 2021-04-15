import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/layout/Bio/Bio"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import Paginator from "../components/utils/Paginator"
import { TagRenderer } from "../components/utils/tags/TagRenderer"
import { useContext } from "react"
import { SearchContext } from "../context/search/SearchContext"
import shared from "../constants/shared.json"
import { ColoredTitle } from "../components/utils/ColoredTitle"
import { sanitizeTag } from "../utils/tags/getSanitizedTagsFromEdges"

const BlogPostListing = ({ data, location, pageContext }) => {
    const { query } = useContext(SearchContext)
    const { currentPage, limit, skip } = pageContext
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

    const getPostsToRender = () => {
        // search is allowed on the homepage
        if (currentPage === 1) {
            return query === ""
                ? posts.slice(skip, limit)
                : posts.filter(({ node }) => {
                      return (
                          node.excerpt
                              .toLowerCase()
                              .includes(query.toLowerCase()) ||
                          node.frontmatter.title
                              .toLowerCase()
                              .includes(query.toLowerCase()) ||
                          node.frontmatter.tags
                              .toLowerCase()
                              .includes(query.toLowerCase())
                      )
                  })
        }
        return posts.slice(skip, skip + limit)
    }
    const postsToRender = getPostsToRender()
    return (
        <Layout location={location} title={title} subtitle={subtitle}>
            {currentPage !== 1 && (
                <ColoredTitle title={`🔢 Posts Page No. ${currentPage}`} style={{marginBottom: 0}}/>
            )}
            {currentPage !== 1 && (
                <div style={{marginBottom: '3rem'}}>
                    <small className="blog-post-date">
                        {postsToRender[0].node.frontmatter.date}
                    </small>{" "}
                    -{" "}
                    <small className="blog-post-date">
                        {
                            postsToRender[postsToRender.length-1].node.frontmatter
                                .date
                        }
                    </small>
                </div>
            )}

            <SEO title={title} schemaMarkup={schema} />
            {postsToRender.length === 0 ? (
                <p>No posts found for your query! 😞</p>
            ) : (
                postsToRender.map(({ node }) => {
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
                                <small className="blog-post-date">
                                    {node.frontmatter.date}
                                </small>
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
                })
            )}
            <Paginator />
            <h3>Posts by tag:</h3>
            <TagRenderer linkToTagPage={true}/>
            <Bio />
        </Layout>
    )
}

export default BlogPostListing

export const blogListQuery = graphql`
    query blogListQuery {
        site {
            siteMetadata {
                title
                description
                subtitle
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
                    }
                }
            }
        }
    }
`
