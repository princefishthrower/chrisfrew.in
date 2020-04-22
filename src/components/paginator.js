/**
 * Paginator component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Paginator = () => {
  const data = useStaticQuery(graphql`
    query PaginatorQuery {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
  `)

  const posts = data.allMarkdownRemark.edges
  const postCount = posts.length
  let paginations = []
  let pageCount = 1
  for (let i = 1; i < postCount; i += 5) {
    let pathName = "/blog-page-" + pageCount
    let url = "/"
    let isActive = false
    if (i !== 1) {
      url = pathName
    }
    if (
      (i === 1 && window.location.pathname === "/") ||
      window.location.pathname === pathName
    ) {
      isActive = true
    }
    const text = i.toString() + "-" + (i + 5).toString()
    paginations.push({
      url: url,
      text: text,
      isActive: isActive,
    })
    pageCount = pageCount + 1
  }
  return (
    <>
      <br />
      <br />
      <p>More posts:</p>
      <div className="pagination">
        {paginations.map(pagination => {
          if (pagination.isActive) {
            return <button>{pagination.text}</button>
          } else {
            return <a href={pagination.url}>{pagination.text}</a>
          }
        })}
      </div>
    </>
  )
}

export default Paginator
