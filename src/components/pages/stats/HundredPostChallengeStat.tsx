import { graphql, Link, useStaticQuery } from "gatsby"
import * as React from "react"
import { getDaysLeftInYear } from "../../../utils/getDaysLeftInYear"
import Sparkles from "../../utils/Sparkles"
import { StatTile } from "./StatTile"

export function HundredPostChallengeStat() {
    const data = useStaticQuery(graphql`
        query HundredPostsChallengeQuery {
            allMdx(sort: {frontmatter: {date: DESC}}, limit: 1000) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                            date
                            tags
                        }
                    }
                }
            }
        }
    `)

    // some calculations on all the posts
    const posts = data.allMdx.edges
    const newestPost = posts[0]
    const firstPost = posts[posts.length - 1]
    const firstPublishDate = new Date(firstPost.node.frontmatter.date)
    const mostRecentPublishDate = new Date(newestPost.node.frontmatter.date)
    const firstPublishYear = firstPublishDate.getFullYear()
    const currentYear = mostRecentPublishDate.getFullYear()

    const yearData = []
    for (let year = firstPublishYear; year <= currentYear; year++) {
        yearData.push({
            year,
            count: posts.filter(
                (x: any) =>
                    new Date(x.node.frontmatter.date).getFullYear() === year
            ).length,
        })
    }

    const postsLeft = 40 - yearData.find((x) => x.year === 2021)?.count
    const hundredPostChallenge = postsLeft <= 0 ? "Completed!" : Math.round(getDaysLeftInYear() / postsLeft * 100) / 100

    return (
        <StatTile
            stat={hundredPostChallenge}
            label={
                <>
                    Days on average that Chris has to publish, per post, to achieve the{" "}
                    <Link to="/blog/one-hundred-posts-challenge">
                        <Sparkles>One Hundred Posts Challenge!</Sparkles>
                    </Link>
                </>
            }
        />
    )
}
