import React from "react"
import BlogPostListing from "../templates/blog-post-listing"

const IndexPage = ({data, location}) => {
    return (
        <BlogPostListing data={data} location={location}/>
    )
}

export default IndexPage

export const homePageQuery = graphql`
    query homePageQuery {
        site {
            siteMetadata {
                title
                description
                subtitle
            }
        }
        allMdx(
            sort: { fields: [frontmatter___date], order: DESC }
            limit: 10
            skip: 0
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