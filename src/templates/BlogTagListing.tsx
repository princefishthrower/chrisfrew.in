import React from "react"
import { Link, PageProps, graphql } from "gatsby"
import Bio from "../components/layout/Bio/Bio"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import { TagRenderer } from "../components/utils/tags/TagRenderer"
import { ColoredTitle } from "../components/utils/ColoredTitle"
import { sanitizeTag } from "../utils/tags/getSanitizedTagsFromEdges"
import { PageContext } from "../types/PageContext"
import { PageData } from "../types/PageData"

const BlogTagListing = ({
    data,
    location,
    pageContext,
}: PageProps<PageData, PageContext>) => {
    const { tag } = pageContext
    const posts = data.allMdx.edges

    // only take those
    // const postsToRender = posts.filter(({ node }) => { node.frontmatter.tags.includes(tag) })
    const cleanTitle = `Posts Tagged With "${tag}"`
    const cleanDescription = `All posts on Chris' Full Stack Blog tagged with "${tag}"`
    return (
        <Layout location={location}>
            <SEO title={cleanTitle} description={cleanDescription} />
            <ColoredTitle title={`#️⃣ ${cleanTitle}`} />
            {posts.map(({ node }: any) => {
                const title = node.frontmatter.title || node.fields.slug
                const tags = node.frontmatter.tags
                    .split(",")
                    .map((x: any) => sanitizeTag(x))
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
                                <TagRenderer
                                    withTitle={false}
                                    linkToTagPage={true}
                                    tags={tags}
                                />
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
            <TagRenderer withTitle={false} linkToTagPage={true} />
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
                subsubtitle
                subsubsubtitle
            }
        }
        allMdx(
            sort: { frontmatter: { date: DESC } }
            filter: { frontmatter: { tags: { regex: $tagRegex } } }
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
