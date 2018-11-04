import React from 'react'
import { Link } from 'gatsby'
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
    const siteDescription = post.excerpt;
    
    return (
      <div>
        <Helmet 
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${frontmatter.title} | ${siteTitle}`} 
        />
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: rhythm(-1),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
          <div>
            Chris's&nbsp;
            <span style={{color:'#F92672'}}>Full Stack</span>,&nbsp;
            <span style={{color:'#66D9EF'}}>Web Development</span>,&nbsp;
            <span style={{color:'#A6E22E'}}>ABAP</span>,&nbsp;
            <span style={{color:'#F92672'}}>SAPUI5</span>,&nbsp;
            <span style={{color:'#66D9EF'}}>Machine Learning</span>,&nbsp;
            &&nbsp;
            <span style={{color:'#A6E22E'}}>Natural Language Processing</span>&nbsp;
            <span style={{color:'#F92672'}}>Blog</span>.
            <br/>
          </div>
          </Link>
        </h3>
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
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        draft
      }
    }
  }
`
