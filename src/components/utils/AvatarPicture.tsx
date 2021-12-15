import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import * as React from "react"

export function AvatarPicture() {
    const data = useStaticQuery(graphql`
        query AuthorQuery {
            site {
                siteMetadata {
                    author {
                        name
                    }
                }
            }
            avatar: file(relativePath: { eq: "avatar.jpg" }) {
                childImageSharp {
                    gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
                }
            }
            avatarChristmas: file(relativePath: { eq: "avatarChristmas.png" }) {
                childImageSharp {
                    gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
                }
            }
        }
    `)

    const now = new Date()
    const year = now.getFullYear()

    // if we are between november 28th (the latest Thanksgiving can be)
    // and before January 6th (the epiphany AKA three kings day)
    // render the christmas avatar!!!
    if (now >= new Date(`${year}-11-28`) && now <= new Date(`${year + 1}-01-06`)) {
        return (
            <GatsbyImage
                className="title-avatar-picture"
                image={data.avatarChristmas.childImageSharp.gatsbyImageData}
                alt={data.site.siteMetadata.author.name}
            />
        )
    }

    // TODO: more photos (June to August sunglasses, hawaiin shirt)

    return (
        <GatsbyImage
            className="title-avatar-picture"
            image={data.avatar.childImageSharp.gatsbyImageData}
            alt={data.site.siteMetadata.author.name}
        />
    )
}
