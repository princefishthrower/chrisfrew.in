const path = require(`path`)
const { exec, spawn } = require("child_process")
const { createFilePath } = require(`gatsby-source-filesystem`)
const getTagDataFromEdges = require(`./utils/tags/getTagDataFromEdges`)
const shared = require(`./src/constants/shared.json`)

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const blogPost = path.resolve(`./src/templates/BlogPost.tsx`)
    const blogPostListing = path.resolve("./src/templates/BlogPostListing.tsx")
    const blogTagListing = path.resolve("./src/templates/BlogTagListing.tsx")
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
                                tags
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
    
    // Create blog listing pages
    const numPages = Math.ceil(posts.length / shared.POSTS_PER_PAGE)
    Array.from({ length: numPages }).forEach((_, i) => {
        const path = i === 0 ? `/` : `/blog-page-${i + 1}`
        createPage({
            path,
            component: blogPostListing,
            context: {
                limit: shared.POSTS_PER_PAGE,
                skip: i * shared.POSTS_PER_PAGE,
                numPages,
                currentPage: i + 1,
            },
        })
        console.log(`Created blog listing page at "${path}" !`)
    })

    // Create tag listing pages
    const tagData = getTagDataFromEdges(posts);
    tagData.forEach(x => {
        createPage({
            path: x.link,
            component: blogTagListing,
            context: {
                tag: x.label,
                tagRegex: x.tagRegex
            }
        })
        console.log(`Created tag listing page at "${x.link}" (Tag regex was "${x.tagRegex}", clean tag label was "${x.label}") !`)
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
    // build all code snippet pdfs
    await spawnChild("node", ["create-snippets-pdf.js"], "All PDF exports successful!\n");

    // copy cv from dev folder to the exports folder with all the other pdfs
    await spawnChild("cp", ["dev/chris-frewin-cv.pdf", "public/exports/"], "CV successfully copied to public/exports!");
}

async function spawnChild(command, arguments, successConsoleLog) {
    const child = spawn(command, arguments)
    for await (const chunk of child.stdout) {
        console.log(chunk.toString())
    }
    for await (const chunk of child.stderr) {
        console.error(chunk.toString())
    }
    const exitCode = await new Promise((resolve) => {
        child.on("close", resolve)
    })
    if (exitCode) {
        throw new Error(`Child exited with error code ${exitCode}!`)
    } else {
        console.log(successConsoleLog)
    }
}


