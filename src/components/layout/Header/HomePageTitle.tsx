import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { AvatarPicture } from "../../utils/AvatarPicture"

export function HomePageTitle() {
    const data = useStaticQuery(graphql`
        query HomePageTitleQuery {
            site {
                siteMetadata {
                    author {
                        name
                    }
                    subtitle
                    subsubtitle
                }
            }
        }
    `)

    return (
        <>
            <div
                className="title-container"
            >
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
                    {data.site.siteMetadata.subtitle}
                </h1>
                <div className="title-avatar-container">
                    <AvatarPicture/>
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
        </>
    )
}
