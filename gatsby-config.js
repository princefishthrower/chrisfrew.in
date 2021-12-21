const path = require(`path`)
const { githubApiQuery } = require("./github-api")
const config = require("./config/website")
const siteUrl = "https://chrisfrew.in"

module.exports = {
    siteMetadata: {
        siteUrl,
        subtitle: config.subtitle,
        subsubtitle: config.subsubtitle,
        title: config.siteTitle,
        twitterHandle: config.twitterHandle,
        description: config.siteDescription,
        keywords: [
            "Software Engineer",
            "React",
            "React Hooks",
            ".NET",
            "TypeScript",
        ],
        canonicalUrl: siteUrl,
        image: config.siteLogo,
        author: {
            name: config.author,
            minibio: config.minibio,
        },
        organization: {
            name: config.organization,
            url: siteUrl,
            logo: config.siteLogo,
        },
        social: {
            twitter: config.twitterHandle,
            fbAppID: "",
        },
    },
    plugins: [
        {
            resolve: `gatsby-source-github-api`,
            options: {
                url: "https://api.github.com/graphql", // default Github GraphQL v4 API endpoint

                // token: required by the GitHub API
                token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,

                // graphQLQuery: defaults to a search query
                // comment out when working offline
                graphQLQuery: githubApiQuery,

                // variables: defaults to variables needed for a search query
                variables: {
                    githubUsername: process.env.GITHUB_USERNAME,
                    repositoryName: "chrisfrew.in",
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
            resolve: `gatsby-plugin-feed`,
            options: {
                feeds: [
                    getBlogFeed({
                        filePathRegex: `//content/blog//`,
                        blogUrl: "https://chrisfrew.in/blog",
                        output: "/rss.xml",
                        title: "Chris' Full Stack Blog RSS Feed",
                    }),
                ],
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: config.siteTitle,
                short_name: config.siteTitleShort,
                description: config.siteDescription,
                start_url: config.pathPrefix,
                lang: config.lang,
                background_color: config.backgroundColor,
                theme_color: config.themeColor,
                display: "standalone",
                icon: `src/images/maskable_icon.png`,
                icon_options: {
                    purpose: `any maskable`,
                },
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        `gatsby-plugin-image`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-offline`,
        `gatsby-plugin-sitemap`,
        `gatsby-plugin-robots-txt`,
    ],
}

function getBlogFeed({ filePathRegex, blogUrl, ...overrides }) {
    /**
     * These RSS feeds can be quite expensive to generate. Limiting the number of
     * posts and keeping each item's template lightweight (only using frontmatter,
     * avoiding the html/excerpt fields) helps negate this.
     */
    return {
        serialize: ({ query: { allMdx } }) => {
            const stripSlash = (slug) =>
                slug.startsWith("/") ? slug.slice(1) : slug
            return allMdx.edges.map((edge) => {
                const url = `${siteUrl}/${stripSlash(edge.node.fields.slug)}`

                return {
                    ...edge.node.frontmatter,
                    url,
                    guid: url,
                    custom_elements: [
                        {
                            "content:encoded": `<div style="width: 100%; margin: 0 auto; max-width: 800px; padding: 40px 40px;">
                    <p>
                      There's a new blog post <em>"${edge.node.frontmatter.title}"</em> and you can <a href="${url}">read it online</a>.
                      <br>
                      ${edge.node.fields.plainTextDescription}
                      <br>
                      You can also <a href="${config.subscriptionUrl}">subscribe</a> for weekly emails on my latest posts - if I publish anything that week!
                    </p>
                  </div>`,
                        },
                    ],
                }
            })
        },
        query: `
         {
           allMdx(
             limit: 25,
             filter: {
               fileAbsolutePath: {regex: "${filePathRegex}"}
             }
             sort: { order: DESC, fields: [frontmatter___date] }
           ) {
             edges {
               node {
                 fields {
                   slug
                 }
                 frontmatter {
                   date
                   title
                   description
                 }
               }
             }
           }
         }
       `,
        ...overrides,
    }
}

// old feed (doesn't work anymore after mdx migration)
//   {
//     resolve: `gatsby-plugin-feed-mdx`,
//     options: {
//         query: `
//   {
//     site {
//       siteMetadata {
//         title
//         description
//         siteUrl
//         site_url: siteUrl
//       }
//     }
//   }
// `,
//         feeds: [
//             {
//                 serialize: ({ query: { site, allMdx } }) => {
//                     return allMdx.edges.map((edge) => {
//                         return Object.assign(
//                             {},
//                             edge.node.frontmatter,
//                             {
//                                 description: edge.node.excerpt,
//                                 date: edge.node.frontmatter.date,
//                                 url:
//                                     site.siteMetadata.siteUrl +
//                                     "/blog" +
//                                     edge.node.fields.slug,
//                                 guid:
//                                     site.siteMetadata.siteUrl +
//                                     "/blog" +
//                                     edge.node.fields.slug,
//                                 custom_elements: [
//                                     {
//                                         "content:encoded":
//                                             edge.node.body,
//                                     },
//                                 ],
//                             }
//                         )
//                     })
//                 },
//                 query: `
//       {
//         allMdx(
//           sort: { order: DESC, fields: [frontmatter___date] },
//         ) {
//           edges {
//             node {
//               excerpt
//               body
//               fields {
//                 slug
//               }
//               frontmatter {
//                 title
//                 date
//               }
//             }
//           }
//         }
//       }
//     `,
//                 output: "/rss.xml",
//                 title: "Chris' Full Stack Blog",
//                 match: "^/blog/",
//             },
//         ],
//     },
// },
