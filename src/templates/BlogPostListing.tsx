import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import { TagRenderer } from "../components/utils/tags/TagRenderer"
import { useContext } from "react"
import { SearchContext } from "../context/search/SearchContext"
import { ColoredTitle } from "../components/utils/ColoredTitle"
import { sanitizeTag } from "../utils/tags/getSanitizedTagsFromEdges"
import { DuckContainer } from "../components/layout/Duck/DuckContainer"
import { ThemeContext } from "../context/theme/ThemeContext"
import { getActiveTheme } from "../utils/getActiveTheme"
import { MostRecentPostWidget } from "../components/utils/PostsWidgets/LatestPostWidget/LatestPostWidget"
import { TopPostsWidget } from "../components/utils/PostsWidgets/TopPostsWidget/TopPostsWidget"

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

    const cleanDescription =
        postsToRender.length > 0
            ? `All posts from ${postsToRender[0].node.frontmatter.date} to ${
                  postsToRender[postsToRender.length - 1].node.frontmatter.date
              }`
            : `No posts found :(`

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
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                <MostRecentPostWidget />
            </div>
            <h2>Popular Posts:</h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
            >
                <TopPostsWidget />
            <Link to="/posts"><h2 className="monokaiRedFont">View All Posts</h2></Link>

            </div>
            <h2>Post Learning Series:</h2>
            <p><b>Clean React TypeScript</b> - coming soon!</p>
            <p><b>Clean Functional JavaScript</b> - coming soon!</p>
            <h2>Posts By Tag:</h2>
            <TagRenderer withTitle={false} linkToTagPage={true} />
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
                    }
                }
            }
        }
    }
`
