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
        }
    `)

    return (
        <GatsbyImage
            className="title-avatar-picture"
            image={data.avatar.childImageSharp.gatsbyImageData}
            alt={data.site.siteMetadata.author.name}
        />
    )
}
