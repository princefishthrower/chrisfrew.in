import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import get from 'lodash/get'

import Bio from '../components/Bio'
import { rhythm, scale } from '../utils/typography'

const BlogPostTemplate = ({data, location, pathContext}) => {
    const { markdownRemark: post } = data;
    const { frontmatter, html } = post;
    const { next, prev } = pathContext;
    const { title, date } = frontmatter;
    const siteTitle = data.site.siteMetadata.title;
    
    return (
      <div>
        <Helmet title={`${frontmatter.title} | ${siteTitle}`} />
        <h1>{title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
          <hr
            style={{
              marginBottom: rhythm(1),
            }}
          />
          <p>
            { prev && (
              <Link to={prev.frontmatter.relativeLink}>
                Previous Post: {prev.frontmatter.title}
              </Link>
            )}
          </p>
          <p>
            { next && (
              <Link to={next.frontmatter.relativeLink}>
                Next Post: {next.frontmatter.title}
              </Link>
            )}
          </p>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />
      </div>
    )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        draft
      }
    }
  }
`
