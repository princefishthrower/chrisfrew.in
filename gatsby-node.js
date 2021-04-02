const path = require(`path`)
const spawn = require("child_process").spawn
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const blogPost = path.resolve(`./src/templates/BlogPost.tsx`)
    const blogPostListing = path.resolve("./src/templates/BlogPostListing.tsx")
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

    // Create blog post pages.
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

    // TODO: This 10 posts per page won't work as a process.env. variable... why?
    const postsPerPageInt = parseInt(10)
    // Create blog listing pages
    const numPages = Math.ceil(posts.length / postsPerPageInt)
    Array.from({ length: numPages }).forEach((_, i) => {
        const path = i === 0 ? `/` : `/blog-page-${i + 1}`
        createPage({
            path,
            component: blogPostListing,
            context: {
                limit: postsPerPageInt,
                skip: i * postsPerPageInt,
                numPages,
                currentPage: i + 1,
            },
        })
        console.log(`created page at "${path}" !`)
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

exports.onPostBuild = async () => {
    await spawnChild();
}

async function spawnChild() {
    const child = spawn("node", ["create-snippets-pdf.js"])
    for await (const chunk of child.stdout) {
        console.log(chunk.toString())
    }
    let error = ""
    for await (const chunk of child.stderr) {
        console.error(chunk.toString())
    }
    const exitCode = await new Promise((resolve) => {
        child.on("close", resolve)
    })
    if (exitCode) {
        throw new Error(`Subprocess error exit ${exitCode}, ${error}`)
    }
    console.log("All PDF exports successful!")
}


