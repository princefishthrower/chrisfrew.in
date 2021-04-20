import { useStaticQuery, graphql, Link } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import { Tag } from "../../utils/tags/Tag"
import { getUniqueTagsFromEdges } from "../../../utils/tags/getUniqueTagsFromEdges"
import { getTagDataFromEdges } from "../../../utils/tags/getTagDataFromEdges"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { getActiveTheme } from "../../../utils/getActiveTheme"
import BlogTagClass from "../../../enums/BlogTagClass"
import { StatTile } from "./StatTile"
import { getDaysLeftInYear } from "../../../utils/getDaysLeftInYear"
import Sparkles from "../../utils/Sparkles"
import { HundredPostChallengeStat } from "./HundredPostChallengeStat"

export function Stats() {
    const data = useStaticQuery(graphql`
        query StatsQuery {
            allMdx(
                sort: { fields: [frontmatter___date], order: DESC }
                limit: 1000
            ) {
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
            allGithubData {
                edges {
                    node {
                        id
                        rawResult {
                            data {
                                repository {
                                    object {
                                        history {
                                            edges {
                                                node {
                                                    commitUrl
                                                    committedDate
                                                }
                                            }
                                            totalCount
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `)

    const totalCommits = data.allGithubData.edges[0].node.rawResult.data.repository.object.history.totalCount
    const latestCommitDate = new Date(data.allGithubData.edges[0].node.rawResult.data.repository.object.history.edges[0].node.committedDate)

    // work for the fancy colored tags
    const { themeBodyClass } = useContext(ThemeContext)
    const activeTheme = getActiveTheme(themeBodyClass)
    const hexColorsLength = activeTheme.themeColorHexCodes.length

    // some calculations on all the posts
    const posts = data.allMdx.edges
    const newestPost = posts[0]
    const firstPost = posts[posts.length - 1]
    const totalPosts = posts.length
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

    // some calculations and manipulations on the post tags
    const uniqueTags = getUniqueTagsFromEdges(posts)
    const uniqueTagData = getTagDataFromEdges(posts)

    const tagDataByCount = uniqueTagData.sort((a, b) => {
        if (b.count > a.count) {
            return 1
        }
        if (a.count > b.count) {
            return -1
        }
        return 0
    })

    const postsLeft = 30 - yearData.find((x) => x.year === 2021)?.count
    const hundredPostChallenge = Math.round(getDaysLeftInYear() / postsLeft)

    return (
        <>
            <ColoredTitle title="📊 Blog Stats" />
            <p>
                These stats are generated at build time through GraphQL queries,
                so you can be sure they are up to date!
            </p>
            <div className="stat-tile-container">
                <StatTile
                    stat={mostRecentPublishDate.toLocaleDateString()}
                    label={
                        <>
                            <Link to={newestPost.node.fields.slug}>
                                Most recent post
                            </Link>{" "}
                            publish date
                        </>
                    }
                />
                <StatTile
                    stat={firstPublishDate.toLocaleDateString()}
                    label={
                        <>
                            <Link to={firstPost.node.fields.slug}>
                                First post
                            </Link>{" "}
                            publish date
                        </>
                    }
                />
                <>
                    {yearData.map((x) => {
                        if (x.year !== currentYear) {
                            return (
                                <StatTile
                                    stat={x.count}
                                    label={`Posts created in ${x.year}`}
                                />
                            )
                        }
                        return (
                            <StatTile
                                stat={x.count}
                                label={`Posts created in ${x.year} (and
                                        counting - the year's not over yet!)`}
                            />
                        )
                    })}
                </>
                <StatTile stat={totalPosts} label="Total Posts" />
                <StatTile stat={totalCommits} label="Total Commits" />
                <StatTile stat={latestCommitDate.toLocaleDateString()} label="Latest Commit" />
                <StatTile stat={uniqueTags.length} label="Unique Tags" />
                <HundredPostChallengeStat/>
                <StatTile
                    stat={postsLeft}
                    label={
                        <>
                            Posts of the <Sparkles>30</Sparkles> that Chris
                            still needs to write for the{" "}
                            <Link to="/blog/one-hundred-posts-challenge">
                                <Sparkles>
                                    One Hundred Posts Challenge!
                                </Sparkles>
                            </Link>
                        </>
                    }
                />
                {/* <TagRenderer linkToTagPage={true} /> */}
                {tagDataByCount.map((x, index) => {
                    const nextIndex = index + 1
                    return (
                        <StatTile
                            stat={x.count}
                            label={
                                <>
                                    <p>Posts tagged with</p>
                                    <Tag
                                        tag={x.label}
                                        linkToTagPage={true}
                                        backgroundColor={
                                            activeTheme.themeColorHexCodes[
                                                ((index % hexColorsLength) +
                                                    hexColorsLength) %
                                                    hexColorsLength
                                            ]
                                        }
                                        hoverBackgroundColor={
                                            activeTheme.themeColorHexCodes[
                                                ((nextIndex % hexColorsLength) +
                                                    hexColorsLength) %
                                                    hexColorsLength
                                            ]
                                        }
                                        defaultColor={
                                            activeTheme.defaultHexColor
                                        }
                                        tagClassName={BlogTagClass.BLOG_TAG}
                                    />
                                </>
                            }
                        />
                    )
                })}
            </div>
        </>
    )
}
