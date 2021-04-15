import { useStaticQuery, graphql, Link } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import { getThemeColorHexCodes } from "../../../utils/getThemeColorHexCodes"
import Sparkles from "../../utils/Sparkles"
import { Tag } from "../../utils/tags/Tag"
import { TagRenderer } from "../../utils/tags/TagRenderer"
import { getUniqueTagsFromEdges } from "../../../utils/tags/getUniqueTagsFromEdges"
import { getTagDataFromEdges } from "../../../utils/tags/getTagDataFromEdges"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { getActiveTheme } from "../../../utils/getActiveTheme"

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
        }
    `)

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
    const uniqueTags = getUniqueTagsFromEdges(posts);
    const uniqueTagData = getTagDataFromEdges(posts);
    
    const tagDataByCount = uniqueTagData.sort((a, b) => {
        if (b.count > a.count) {
            return 1
        }
        if (a.count > b.count) {
            return -1
        }
        return 0
    })

    

    return (
        <>
            <ColoredTitle title="📊 Blog Stats"/>
            <p>
                These stats are generated at build time through GraphQL queries,
                so you can be sure they are up to date!
            </p>
            <h2>General Stats</h2>
            <p>
                <Link to={firstPost.node.fields.slug}>First post</Link> publish
                date: <b>{firstPublishDate.toLocaleDateString()}</b>
            </p>
            <p>
                <Link to={newestPost.node.fields.slug}>Most recent post</Link>{" "}
                publish date:{" "}
                <b>{mostRecentPublishDate.toLocaleDateString()}</b>
            </p>
            <>
                {yearData.map((x) => {
                    if (x.year !== currentYear) {
                        return (
                            <p key={x.year}>
                                Number of posts created in {x.year}:{" "}
                                <b>{x.count}</b>
                            </p>
                        )
                    }
                    return (
                        <p key={x.year}>
                            Number of posts created in {x.year}:{" "}
                            <b>
                                {x.count} (and counting - the year's not over
                                yet!)
                            </b>
                        </p>
                    )
                })}
            </>
            <p>
                Total Number of Posts:{" "}
                <span style={{ fontSize: "2rem", letterSpacing: "0.1rem" }}>
                    <Sparkles>{totalPosts}</Sparkles>
                </span>
            </p>

            {/* TODO: ADD TAGS AND SEARCH AND FILTER */}
            <h2>Tag Stats</h2>
            <p>
                Unique tags:{" "}
                <span style={{ fontSize: "2rem", letterSpacing: "0.1rem" }}>
                    <Sparkles>{uniqueTags.length}</Sparkles>
                </span>
            </p>
            <TagRenderer linkToTagPage={true}/>
            {tagDataByCount.map((x, index) => {
                const nextIndex = index + 1
                return (
                    <p>
                        Number of posts tagged with{" "}
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
                            defaultColor={activeTheme.defaultHexColor}
                            tagClassName="tag"
                        />
                        : {x.count}
                    </p>
                )
            })}
        </>
    )
}
