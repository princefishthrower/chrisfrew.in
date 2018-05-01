const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const fs = require('fs') // added to write metadata file
const { createFilePath } = require('gatsby-source-filesystem')
fs.writeFile('./static/metadata.json', '[', function(){console.log('metadata.json cleared!')}) // clear

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(limit: 1000) {
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
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        var iCount = 1;
        _.each(result.data.allMarkdownRemark.edges, edge => {
          console.log(edge.node.frontmatter);
          console.log(iCount);
          console.log(result.data.allMarkdownRemark.edges.length);
          if (iCount === result.data.allMarkdownRemark.edges.length) {
            fs.appendFile('./static/metadata.json',  JSON.stringify(edge.node.frontmatter) + "]", function (err) {
              if (err) {
                console.log(err);
              }
            });
          } else {
            fs.appendFile('./static/metadata.json', JSON.stringify(edge.node.frontmatter) + ",\n", function (err) {
              if (err) {
                console.log(err);
              }
            });
          }
          createPage({
            path: edge.node.fields.slug,
            component: blogPost,
            context: {
              slug: edge.node.fields.slug,
            },
          })
          iCount = iCount + 1;
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
