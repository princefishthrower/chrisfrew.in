const path = require(`path`)
const { githubApiQuery } = require('./github-api')

module.exports = {
    siteMetadata: {
        title: `Chris' Full Stack Blog`,
        subtitle: `A professional software engineering blog.`,
        author: `Chris Frewin`,
        description: `A professional, high-quality, full stack software engineering blog. Featuring JavaScript, TypeScript, React, C#, ABAP, SAPUI5, and everything in between.`,
        siteUrl: `https://chrisfrew.in/`,
        lang: `en`,
    },
    plugins: [
        {
            resolve: `gatsby-source-github-api`,
            options: {
                url: "https://api.github.com/graphql", // default Github GraphQL v4 API endpoint

                // token: required by the GitHub API
                token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,

                // graphQLQuery: defaults to a search query
                graphQLQuery: githubApiQuery,

                // variables: defaults to variables needed for a search query
                variables: {
                  githubUsername: process.env.GITHUB_USERNAME,
                  repositoryName: "chrisfrew.in"
                },
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `content`,
                path: path.join(__dirname, `src`, `content`),
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: path.join(__dirname, `src`, `images`),
            },
        },
        `gatsby-plugin-image`,
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: [`.mdx`, `.md`],
                remarkPlugins: [
                    require(`remark-math`),
                    require(`remark-html-katex`),
                ],
                gatsbyRemarkPlugins: [
                    // {
                    //   resolve: `gatsby-remark-footnotes`,
                    //   options: {
                    //     footnoteBackRefDisplay: `inline`,
                    //     footnoteBackRefInnerText: `\u21E7 Back Up`,
                    //     footnoteBackRefAnchorStyle: `font-size: 0.75rem;`
                    //   },
                    // },
                    `gatsby-remark-images`,
                    `gatsby-remark-copy-linked-files`,
                ],
            },
        },
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: `UA-63301492-1`,
            },
        },
        {
            resolve: `gatsby-plugin-feed-mdx`,
            options: {
                query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMdx } }) => {
                            return allMdx.edges.map((edge) => {
                                return Object.assign(
                                    {},
                                    edge.node.frontmatter,
                                    {
                                        description: edge.node.excerpt,
                                        date: edge.node.frontmatter.date,
                                        url:
                                            site.siteMetadata.siteUrl +
                                            "/blog" +
                                            edge.node.fields.slug,
                                        guid:
                                            site.siteMetadata.siteUrl +
                                            "/blog" +
                                            edge.node.fields.slug,
                                        custom_elements: [
                                            {
                                                "content:encoded":
                                                    edge.node.body,
                                            },
                                        ],
                                    }
                                )
                            })
                        },
                        query: `
              {
                allMdx(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      body
                      fields { 
                        slug 
                      }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
                        output: "/rss.xml",
                        title: "Chris' Full Stack Blog",
                        match: "^/blog/",
                    },
                ],
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Chris' Full Stack Blog`,
                short_name: `Chris' Full Stack Blog: A professional software engineering blog.`,
                icon: `src/images/maskable_icon.png`,
                icon_options: {
                    purpose: `any maskable`,
                },
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#000000`,
                display: `standalone`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        `gatsby-plugin-image`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-offline`,
    ],
}
