import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import Paginator from "../components/paginator"
import EmailForm from "../components/email-form"

const BlogPostListing = ({ data, location }) => {
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
    return (
        <Layout
            location={location}
            title={title}
            subtitle={subtitle}
        >
            <SEO title={title} schemaMarkup={schema} />
            {posts.map(({ node }) => {
                const title = node.frontmatter.title || node.fields.slug
                return (
                    <article key={node.fields.slug}>
                        <header>
                            <h3
                                style={{
                                    marginBottom: rhythm(1 / 4),
                                }}
                            >
                                <Link
                                    style={{ boxShadow: `none` }}
                                    to={node.fields.slug}
                                >
                                    {title}
                                </Link>
                            </h3>
                            <small>{node.frontmatter.date}</small>
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
            <Paginator />
            <Bio />
            <EmailForm />
        </Layout>
    )
}

export default BlogPostListing

export const blogListQuery = graphql`
    query blogListQuery($skip: Int!, $limit: Int!) {
        site {
            siteMetadata {
                title
                description
                subtitle
            }
        }
        allMdx(
            sort: { fields: [frontmatter___date], order: DESC }
            limit: $limit
            skip: $skip
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
                    }
                }
            }
        }
    }
`
