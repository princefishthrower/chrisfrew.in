import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import * as React from "react"
import { getEasterByYear } from "./getEasterByYear"

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
            avatarSaintPatricksDay: file(relativePath: { eq: "avatarSaintPatricksDay.png" }) {
                childImageSharp {
                    gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
                }
            }
        }
    `)

    const now = new Date()
    const year = now.getFullYear()
    const epiphany = new Date(`${year}-01-06`)
    const easter = getEasterByYear(year)
    const saintPatricksDay = new Date(`${year}-03-17`);
    const firstOfJuly = new Date(`${year}-07-01`);
    const lastOfAugust = new Date(`${year}-08-31`);

    // if we are between november 28th (the latest Thanksgiving can be)
    // and before January 6th (the epiphany AKA three kings day)
    // render the christmas avatar!!!
    if (now <= epiphany || now >= new Date(`${year}-11-28`)) {
        return (
            <GatsbyImage
                className="title-avatar-picture"
                image={data.avatarChristmas.childImageSharp.gatsbyImageData}
                alt={`${data.site.siteMetadata.author.name} is in the holiday spirit!`}
            />
        )
    }

    // between january 6th and march 17th (saint patricks day)
    // render the saint patrick's day avatar!
    if (now >= epiphany && now <= saintPatricksDay) {
        return (
            <GatsbyImage
                className="title-avatar-picture"
                image={data.avatarSaintPatricksDay.childImageSharp.gatsbyImageData}
                alt={`${data.site.siteMetadata.author.name} is thinking about St. Patrick's Day`}
            />
        )
    }

    // TODO:
    // This one is a bit more complex - easter does not have a fixed date
    // between saint patricks day and easter, render bunny ears avatar
    if (now >= saintPatricksDay && now <= easter) {
        return (
            <GatsbyImage
                className="title-avatar-picture"
                image={data.avatarSaintPatricksDay.childImageSharp.gatsbyImageData}
                alt={`${data.site.siteMetadata.author.name} is thinking about Easter.`}
            />
        )
    }

    // TODO:
    // july and august
    if (now >= firstOfJuly && now <= lastOfAugust) {
        return (
            <GatsbyImage
                className="title-avatar-picture"
                image={data.avatarChristmas.childImageSharp.gatsbyImageData}
                alt={`${data.site.siteMetadata.author.name} is in summer chill mode.`}
            />
        )
    }

    // default: return normal picture

    return (
        <GatsbyImage
            className="title-avatar-picture"
            image={data.avatar.childImageSharp.gatsbyImageData}
            alt={data.site.siteMetadata.author.name}
        />
    )
}
