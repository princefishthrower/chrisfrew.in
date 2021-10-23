import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/layout/Bio/Bio"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import Paginator from "../components/utils/Paginator"
import { TagRenderer } from "../components/utils/tags/TagRenderer"
import { useContext } from "react"
import { SearchContext } from "../context/search/SearchContext"
import { ColoredTitle } from "../components/utils/ColoredTitle"
import { sanitizeTag } from "../utils/tags/getSanitizedTagsFromEdges"
import { DuckContainer } from "../components/layout/Duck/DuckContainer"
import { ThemeContext } from "../context/theme/ThemeContext"
import { getActiveTheme } from "../utils/getActiveTheme"

const BlogPostListing = ({ data, location, pageContext }) => {
    const { query } = useContext(SearchContext)
    const { currentPage, limit, skip } = pageContext
    const title = data.site.siteMetadata.title
    const subtitle = data.site.siteMetadata.subtitle
    const posts = data.allMdx.edges

    const { themeBodyClass } = useContext(ThemeContext)
    const activeTheme = getActiveTheme(themeBodyClass)
    const hexColorsLength = activeTheme.themeColorHexCodes.length
    const cleanTitle =
    currentPage !== 1
        ? `Posts Page No. ${currentPage}`
        : `Chris' Full Stack Blog`

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
    
    
    const cleanDescription = postsToRender.length > 0 ? `All posts from ${
        postsToRender[0].node.frontmatter.date
    } to ${postsToRender[postsToRender.length - 1].node.frontmatter.date}` : `No posts found :(`
    
    return (
        <Layout location={location} title={title} subtitle={subtitle}>
            {currentPage !== 1 && (
                <ColoredTitle
                    title={`🔢 ${cleanTitle}`}
                    style={{ marginBottom: 0 }}
                />
            )}
            {currentPage !== 1 && (
                <div style={{ marginBottom: "3rem" }}>
                    <small className="blog-post-date">
                        All posts from{" "}
                        <b>{postsToRender[0].node.frontmatter.date}</b> to{" "}
                        <b>
                            {
                                postsToRender[postsToRender.length - 1].node
                                    .frontmatter.date
                            }
                        </b>
                    </small>
                </div>
            )}
            <SEO
                frontmatter={{
                    title: cleanTitle,
                    description: cleanDescription,
                }}
            />
            {postsToRender.length === 0 ? (
                <p>No posts found for your query! 😞</p>
            ) : (
                postsToRender.map(({ node }, index) => {
                    const title = node.frontmatter.title || node.fields.slug
                    const tags = node.frontmatter.tags
                        .split(",")
                        .map((x) => sanitizeTag(x))

                    // for the bottom border color: cycle through hex colors in cyclic fashtion
                    const color =
                        activeTheme.themeColorHexCodes[
                            ((index % hexColorsLength) + hexColorsLength) %
                                hexColorsLength
                        ]
                    return (
                        <>
                            
                            <article key={node.fields.slug}>
                                <header>
                                <div
                                className="blog-post-separator-top small-only"
                                style={{ borderColor: color }}
                            />
                                    <h3>
                                        <Link
                                            style={{ boxShadow: `none`, color }}
                                            to={node.fields.slug}
                                        >
                                            {title}
                                        </Link>
                                    </h3>
                                    <div
                                className="blog-post-separator-bottom small-only"
                                style={{ borderColor: color }}
                            />
                                    <small className="blog-post-date">
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
                                <TagRenderer linkToTagPage={true} tags={tags} />
                            </article>
                            <div style={{marginBottom: '3rem'}} className="large-only"/>
                            <div style={{marginBottom: '3rem'}} className="medium-only"/>
                        </>
                    )
                })
            )}
            <Paginator />
            <h3>Posts by tag:</h3>
            <TagRenderer linkToTagPage={true} />
            <Bio />
            <DuckContainer />
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
