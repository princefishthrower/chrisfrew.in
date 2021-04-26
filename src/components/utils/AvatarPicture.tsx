import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import * as React from "react"
import { CSSProperties } from "react"

export interface IAvatarPictureProps {
    style: CSSProperties
}

export function AvatarPicture(props: IAvatarPictureProps) {
    const { style } = props
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
            image={data.avatar.childImageSharp.gatsbyImageData}
            alt={data.site.siteMetadata.author.name}
            style={style}
        />
    )
}
