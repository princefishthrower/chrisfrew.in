import React from 'react'
import { Link } from 'gatsby'
import Helmet from 'react-helmet'
import Bio from '../components/Bio'
import { rhythm, scale } from '../utils/typography'
import { graphql } from 'gatsby'
import Star from '../components/Star'

const BlogPostTemplate = ({data, location, pageContext}) => {
    const { markdownRemark: post } = data;
    const { frontmatter, html } = post;
    const { next, prev } = pageContext;
    const { title, date, starID } = frontmatter;
    const siteTitle = data.site.siteMetadata.title;
    const siteDescription = post.excerpt;
    return (
      <div className="postBackground">
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
            Chris'<br/>
            <span style={{color:'#F92672'}}>Full</span><br/>
            <span style={{color:'#66D9EF'}}>Stack</span><br/>
            <span style={{color:'#A6E22E'}}>Blog</span>.<br/>
            <br/>
          </div>
          </Link>
        </h3>
        <br/>
        <Star starID={starID}/>
        <br/>
        <h1>{title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1)
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
        starID
      }
    }
  }
`
