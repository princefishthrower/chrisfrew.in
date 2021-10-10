import * as React from "react"
import { MessageOfTheDay } from "./MessageOfTheDay"
import { TwitterIcon } from "../TwitterIcon"
import { graphql, Link, useStaticQuery } from "gatsby"
import Sparkles from "../../utils/Sparkles"
import { Fade } from "react-awesome-reveal"
import { AvatarPicture } from "../../utils/AvatarPicture"
import { Search } from "../../utils/search/Search"

export function HomePageTitle() {
    const data = useStaticQuery(graphql`
        query HomePageTitleQuery {
            site {
                siteMetadata {
                    author {
                        name
                    }
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
                    Chris' Full Stack Blog
                </Link>
            </h1>
            <div style={{ textAlign: "center" }}>
                <AvatarPicture style={{
                        display: "inline-block",
                        borderRadius: `100%`,
                        width: "200px",
                        height: 'auto'
                    }}/>
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
                        flexDirection: "row",
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
                <a
                    href="/exports/chris-frewin-cv.pdf"
                    download
                    style={{
                        display: "flex",
                        flexDirection: "row",
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
                    }}
                >
                    📜 CV
                </a>
            </div>
            <div>
                <h2
                    style={{
                        margin: 0,
                        marginBottom: "1rem",
                        textAlign: "center",
                    }}
                >
                    <Fade
                        triggerOnce={true}
                        cascade={true}
                        damping={0.05}
                        duration={1000}
                        direction="up"
                        style={{ display: "inline", whiteSpace: "inherit" }}
                    >
                        {data.site.siteMetadata.subtitle}
                    </Fade>
                </h2>
            </div>
            <MessageOfTheDay />
            <Search />
        </>
    )
}
