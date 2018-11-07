import React from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Bio from '../components/Bio'
import Layout from '../components/layout'
import { rhythm } from '../utils/typography'
import { graphql } from "gatsby"

require('prismjs/themes/prism-okaidia.css');
require('../styles/styles.css');

const aColors = ['#F92672', '#66D9EF', '#A6E22E'];

class BlogIndex extends React.Component {
  render() {
    let i = 0;
    let sColor = '';
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = [ // combine both post types
      ...this.props.data.allMarkdownRemark.edges,
      ...this.props.data.allJavascriptFrontmatter.edges,
    ]
    let sortedPosts = posts.sort((a, b) => { // need to sort because markdown posts and JS posts are queried seperately
      return new Date(b.node.frontmatter.date) - new Date(a.node.frontmatter.date);
    });
    return (
      <div>
        <Layout location={this.props.location}>
          <Helmet title={siteTitle} />
            <div
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: rhythm(24),
                padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
              }}
            >
          <Bio />
          { sortedPosts.map(({ node }) => {
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
      </Layout>
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
    allJavascriptFrontmatter {
      edges {
        node {
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
