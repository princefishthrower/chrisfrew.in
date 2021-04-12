import { useStaticQuery, graphql, Link } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { Fade } from "react-awesome-reveal"
import { ThemeContext } from "../../../context/ThemeContext"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"
import Sparkles from "../../utils/Sparkles"

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
                        }
                    }
                }
            }
        }
    `)

    // work for the fancy colored text
    const { themeBodyClass } = useContext(ThemeContext)
    const titleContent = colorizeStringBySeparator(
        themeBodyClass,
        "📊 Blog Stats",
        "",
        0,
        true
    )

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

    return (
        <>
            <h1 className="cooper big">
                <Fade
                    cascade={true}
                    damping={0.025}
                    duration={1000}
                    direction="up"
                    style={{ display: "inline" }}
                >
                    {titleContent}
                </Fade>
            </h1>
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
                <span style={{ fontSize: "1.3rem", letterSpacing: "0.1rem" }}>
                    <Sparkles>{totalPosts}</Sparkles>
                </span>
            </p>

            {/* TODO: ADD TAGS AND SEARCH AND FILTER */}
            <h2>Tag Stats</h2>
            <p>Coming soon!</p>
            {/* <p>Number of Posts tagged #dev 24</p>
            
            <p>Number of Posts tagged #life 4</p>
            
            <p>Number of Posts tagged #misc 6</p>
            
            <p>Number of Posts tagged #blog 2</p> */}
        </>
    )
}
