module.exports = {
  siteMetadata: {
    title: `Chris' Full Stack Blog`,
    author: `Chris Frewin`,
    description: `A professional software engineering blog.`,
    siteUrl: `https://chrisfrew.in/`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-web-monetization`,
      options: {
        paymentPointer: `$ilp.uphold.com/BJGXHRXaMM8Z`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content`,
        name: `content`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-footnotes`,
            options: {
              footnoteBackRefDisplay: `inline`,
              footnoteBackRefInnerText: `\u21E7 Back Up`,
              footnoteBackRefAnchorStyle: `font-size: 0.75rem;`
            },
          },
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-emoji`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-63301492-1`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Chris' Full Stack Blog`,
        short_name: `Chris' Full Stack Blog`,
        icon: `src/images/icon.svg`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#000000`,
        display: `standalone`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `chrisfrew-in`
      }
    },
  ],
}
