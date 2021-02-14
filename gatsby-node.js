const constants = require("./src/constants/constants.json")
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const blogPost = path.resolve(`./src/templates/blog-post.js`)
    const blogPostListing = path.resolve("./src/templates/blog-post-listing.js")
    const result = await graphql(
        `
            {
                allMdx(
                    sort: { fields: [frontmatter___date], order: DESC }
                    limit: 1000
                ) {
                    edges {
                        node {
                            fields {
                                slug
                            }
                            frontmatter {
                                title
                            }
                        }
                    }
                }
            }
        `
    )

    if (result.errors) {
        throw result.errors
    }

    // get all posts - will need these for building pages
    const posts = result.data.allMdx.edges

    // Create blog listing pages
    const numPages = Math.ceil(posts.length / constants.postsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
        if (i !== 0) {
            const path = `/blog-page-${i + 1}`
            createPage({
                path,
                component: blogPostListing,
                context: {
                    limit: constants.postsPerPage,
                    skip: i * constants.postsPerPage,
                    numPages,
                    currentPage: i + 1,
                },
            })
            console.log(`created page at "${path}" !`)
        }
    })

    // Create blog posts pages.
    posts.forEach((post, index) => {
        const previous =
            index === posts.length - 1 ? null : posts[index + 1].node
        const next = index === 0 ? null : posts[index - 1].node

        createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
                slug: post.node.fields.slug,
                previous,
                next,
            },
        })
    })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions
    if (node.internal.type === `Mdx`) {
        const value = createFilePath({ node, getNode })
        createNodeField({
            name: `slug`,
            node,
            value,
        })
    }
}
