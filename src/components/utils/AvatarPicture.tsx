import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import * as React from "react"
import { ReactNode, useState } from "react"
import { getEasterByYear } from "./getEasterByYear"

export function AvatarPicture() {
    const [showNormalAvatar, setShowNormalAvatar] = useState(false)

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
            avatarSaintPatricksDay: file(
                relativePath: { eq: "avatarSaintPatricksDay.png" }
            ) {
                childImageSharp {
                    gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
                }
            }
            avatarSummerHoliday: file(
                relativePath: { eq: "avatarSummerHoliday.png" }
            ) {
                childImageSharp {
                    gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
                }
            }
        }
    `)

    const firstName = data.site.siteMetadata.author.name.split(" ")[0]

    const resolveAvatarData = (): [ReactNode, string] => {
        const now = new Date()
        const year = now.getFullYear()
        const epiphany = new Date(`${year}-01-06`)
        const easter = getEasterByYear(year)
        const saintPatricksDay = new Date(`${year}-03-17`)
        const firstOfJune = new Date(`${year}-06-01`)
        const lastOfAugust = new Date(`${year}-08-31`)

        // if we are between november 28th (the latest Thanksgiving can be)
        // and before January 6th (the epiphany AKA three kings day)
        // render the christmas avatar!!!
        if (now <= epiphany || now >= new Date(`${year}-11-28`)) {
            const titleAndAlt = `${firstName} is in the holiday spirit!`

            return [
                <GatsbyImage
                    onMouseEnter={() => setShowNormalAvatar(true)}
                    className="title-avatar-picture"
                    image={data.avatarChristmas.childImageSharp.gatsbyImageData}
                    alt={titleAndAlt}
                />,
                titleAndAlt,
            ]
        }

        // between january 6th and march 17th (saint patricks day)
        // render the saint patrick's day avatar!
        if (now >= epiphany && now <= saintPatricksDay) {
            const titleAndAlt = `${firstName} is thinking about St. Patrick's Day!`

            return [
                <GatsbyImage
                    onMouseEnter={() => setShowNormalAvatar(true)}
                    className="title-avatar-picture"
                    image={
                        data.avatarSaintPatricksDay.childImageSharp
                            .gatsbyImageData
                    }
                    alt={titleAndAlt}
                />,
                titleAndAlt,
            ]
        }

        // TODO:
        // This one is a bit more complex - easter does not have a fixed date
        // between saint patricks day and easter, render bunny ears avatar
        if (now >= saintPatricksDay && now <= easter) {
            const titleAndAlt = `${firstName} is thinking about Easter!`
            return [
                <GatsbyImage
                    onMouseEnter={() => setShowNormalAvatar(true)}
                    className="title-avatar-picture"
                    image={
                        data.avatarSaintPatricksDay.childImageSharp
                            .gatsbyImageData
                    }
                    alt={titleAndAlt}
                />,
                titleAndAlt,
            ]
        }

        // TODO:
        // june, july and august - summer holiday
        if (now >= firstOfJune && now <= lastOfAugust) {
            const titleAndAlt = `${firstName} is in summer chill mode!`
            return [
                <GatsbyImage
                    onMouseEnter={() => setShowNormalAvatar(true)}
                    className="title-avatar-picture"
                    image={
                        data.avatarSummerHoliday.childImageSharp.gatsbyImageData
                    }
                    alt={titleAndAlt}
                />,
                titleAndAlt,
            ]
        }

        // default: return normal avatar
        const titleAndAlt = firstName
        return [
            <GatsbyImage
                onMouseEnter={() => setShowNormalAvatar(true)}
                className="title-avatar-picture"
                image={data.avatar.childImageSharp.gatsbyImageData}
                alt={titleAndAlt}
            />,
            titleAndAlt,
        ]
    }

    // default: return normal avatar
    const [customAvatarComponent, titleAndAlt] = resolveAvatarData()

    return (
        <div title={titleAndAlt}>
            {!showNormalAvatar && customAvatarComponent}
            {showNormalAvatar && (
                <GatsbyImage
                    onMouseLeave={() => setShowNormalAvatar(false)}
                    className="title-avatar-picture"
                    image={data.avatar.childImageSharp.gatsbyImageData}
                    alt={titleAndAlt}
                />
            )}
        </div>
    )
}
