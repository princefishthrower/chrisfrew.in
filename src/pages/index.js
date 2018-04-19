import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import { rhythm } from '../utils/typography'

require('prismjs/themes/prism-okaidia.css');
require('../styles/styles.css');

const aColors = ['#F92672', '#66D9EF', '#A6E22E'];

class BlogIndex extends React.Component {
  render() {
    let i = 0;
    let sColor = '';
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        {posts.map(({ node }) => {
          // console.log(node.frontmatter);
          // console.log(Boolean(node.frontmatter.draft));
          if (node.frontmatter.draft) {
            return; // if the markdown is still a 'draft post'
          }
          if (i === aColors.length) {
            i = 0;
          }
          sColor = aColors[i];
          i = i + 1;
          const title = get(node, 'frontmatter.title') || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <Link style={{ boxShadow: 'none', color: 'black' }} to={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                  color: sColor
                }}
              >
                  {title}
              </h3>
              <small>{node.frontmatter.date}</small>
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              </Link>
            </div>
          )
        })}
      </div>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            draft
          }
        }
      }
    }
  }
`
