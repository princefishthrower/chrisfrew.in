import * as React from "react"
import { MessageOfTheDay } from "./MessageOfTheDay"
import { TwitterIcon } from "./TwitterIcon"
import { graphql, Link, useStaticQuery } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import Sparkles from "../utils/Sparkles"


export function HomePageTitle() {
    const data = useStaticQuery(graphql`
        query HomePageTitleQuery {
            site {
                siteMetadata {
                    author
                    subtitle
                }
            }
        }
    `)

    return (
        <>
            <h1
                className="big"
                style={{
                    marginBottom: 0,
                    marginTop: 0,
                    position: `relative`,
                    zIndex: 10,
                    textAlign: `center`,
                    paddingBottom: 0,
                }}
            >
                <Link
                    style={{
                        boxShadow: `none`,
                        textDecoration: `none`,
                        color: `inherit`,
                        position: `relative`,
                        zIndex: 10,
                    }}
                    to={`/`}
                >
                    Chris' <Sparkles alternateColorScheme={false}>Full Stack</Sparkles> Blog
                </Link>
            </h1>
            <div style={{ textAlign: "center" }}>
                <StaticImage
                    src={"../../images/avatar.jpg"}
                    alt={data.site.siteMetadata.author}
                    width={75}
                    height={75}
                    layout="fixed"
                    placeholder="blurred"
                    style={{
                        display: "inline-block",
                        borderRadius: `100%`,
                    }}
                />
                <a
                    className="h-card"
                    href="https://chrisfrew.in/"
                    rel="me"
                    style={{
                        display: "block",
                        boxShadow: `none`,
                        textDecoration: `none`,
                        color: `inherit`,
                        position: `relative`,
                        zIndex: 10,
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        lineHeight: "0.5rem",
                        marginBottom: "0.5rem",
                    }}
                >
                    by Chris Frewin
                </a>
                <a
                    href="https://twitter.com/fullStackChris_"
                    rel="me"
                    style={{
                        display: "flex",
                        flexDirection: "flex-row",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `none`,
                        textDecoration: `none`,
                        color: `inherit`,
                        position: `relative`,
                        zIndex: 10,
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        lineHeight: "0.5rem",
                        marginBottom: "0.5rem",
                        color: "#3BA9EE",
                    }}
                >
                    <TwitterIcon />
                    @fullStackChris_
                </a>
            </div>
            <h2
                style={{
                    marginBottom: 0,
                    marginTop: 0,
                    position: `relative`,
                    textAlign: `center`,
                    zIndex: 10,
                }}
            >
                {data.site.siteMetadata.subtitle}
            </h2>
            <MessageOfTheDay />
        </>
    )
}
