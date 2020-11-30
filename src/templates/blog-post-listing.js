import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import Paginator from "../components/paginator"
import EmailForm from "../components/email-form"

class BlogPostListing extends React.Component {
  render() {
    const { data } = this.props
    const title = data.site.siteMetadata.title
    const description = data.site.siteMetadata.description
    const posts = data.allMdx.edges
    return (
      <Layout location={this.props.location} title={title} description={description}>
        <SEO title="Chris' Full Stack Blog. A professional software engineering blog." />
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
                  <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <small>{node.frontmatter.date}</small>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
            </article>
          )
        })}
        <Paginator/>
        <Bio />
        <EmailForm/>
      </Layout>
    )
  }
}

export default BlogPostListing

export const blogListQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!){
    site {
      siteMetadata {
        title
        description
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
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
