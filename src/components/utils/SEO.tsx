import React from "react"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import SchemaOrg from "./SchemaOrg"
import { TwitterMetaTags } from "./TwitterMetaTags"

export interface ISEOProps {
    title: string
}
export default function SEO(props: ISEOProps) {
    const { title } = props
    const { site } = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        title
                        description
                        author
                    }
                }
            }
        `
    )

    const description = site.siteMetadata.description
    const organization = site.siteMetadata.organization
    const author = site.siteMetadata.author
    const lang = site.siteMetadata.lang

    return (
        <>
            <Helmet
                htmlAttributes={{
                    lang,
                }}
            >
                {/* SEO Stuff */}
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="og:title" content={title} />
                <meta name="og:description" content={description} />
                <meta name="og:type" content="website" />
                <meta name="twitter:title" content="Chris' Full Stack Blog" />
                <TwitterMetaTags author={author} description={description}/>

            </Helmet>
            <SchemaOrg
                title={title}
                description={description}
                author={author}
                organization={organization}
            />
        </>
    )
}
