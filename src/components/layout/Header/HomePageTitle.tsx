import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { AvatarPicture } from "../../utils/AvatarPicture"

export function HomePageTitle() {
    const data = useStaticQuery(graphql`
        query HomePageTitleQuery {
            site {
                siteMetadata {
                    subtitle
                    subsubtitle
                }
            }
        }
    `)

    return (
        <>
            <div className="title-container">
                <h1
                    className="big"
                    style={{
                        marginBottom: 0,
                        marginTop: 0,
                        position: `relative`,
                        zIndex: 10,
                        paddingBottom: 0,
                    }}
                >
                    A <span className="monokaiRedUnderline">professional</span> full stack software engineering blog.
                </h1>
                <div className="title-avatar-container">
                    <AvatarPicture />
                </div>
            </div>
            <div>
                <h2
                    style={{
                        margin: "2rem",
                        marginBottom: "1rem",
                        textAlign: "center",
                    }}
                >
                    {data.site.siteMetadata.subsubtitle}
                </h2>
            </div>
            <div>
                <h3
                    style={{
                        margin: "2rem",
                        marginBottom: "1rem",
                        textAlign: "center",
                    }}
                >
                    I'm on a mission to educate{" "}
                    <span className="monokaiRedUnderline">1,000,000</span>
                    <span className="monokaiRedFont">*</span> full stack
                    software engineers around the world. Build your skills with
                    hundreds of hours of video content, hundreds of pages of
                    tutorials, and more.
                </h3>
            </div>
            <div style={{ margin: "1rem", textAlign: "center" }}>
                <span className="monokaiRedFont">*</span>111,109{" "}
                <a
                    className="monokaiRedFont"
                    href="https://chrisfrewin.medium.com/"
                >
                    Medium
                </a>{" "}
                + 37,969{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.youtube.com/channel/UCLaNEXFBI1wpGtxvGVjfHKw"
                >
                    YouTube
                </a>{" "}
                + 3,383{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.udemy.com/user/chris-frewin/"
                >
                    Udemy
                </a>{" "}
                + 644{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.skillshare.com/en/user/christopherfrewin"
                >
                    Skillshare
                </a>{" "}
                + 45{" "}
                <a
                    className="monokaiRedFont"
                    href="https://codedamn.com/user/chrisfrewin"
                >
                    codedamn
                </a>{" "}
                + 7{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.tutorialspoint.com/profile/christopher_frewin"
                >
                    tutorialspoint
                </a>{" "}
                + 6{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.newline.co/courses/react-use-please-stay-with-react-and-typescript"
                >
                    Newline
                </a>{" "}
                = 153,163/1,000,000 = 15%
                <span className="monokaiRedFont">**</span>
            </div>
            <div style={{ margin: "1rem", textAlign: "center" }}>
                <span className="monokaiRedFont">**</span>Numbers last updated
                May 2023
            </div>
        </>
    )
}
