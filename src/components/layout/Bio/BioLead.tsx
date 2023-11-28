import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import * as React from "react"

export function BioLead() {
    const data = useStaticQuery(graphql`
        query YouTubeQuery {
            youtube: file(relativePath: { eq: "youtube.png" }) {
                childImageSharp {
                    gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
                }
            }
        }
    `)
    return (
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
                <span className="monokaiRedUnderline">Hi</span>! I'm Chris
                Frewin, a full stack software{" "}
                <span className="monokaiRedUnderline">engineer</span>,{" "}
                <span className="monokaiRedUnderline">entrepreneuer</span> and{" "}
                <span className="monokaiRedUnderline">educator</span>!
            </h1>
            <div className="title-avatar-container">
                <GatsbyImage
                    image={data.youtube.childImageSharp.gatsbyImageData}
                    alt={"Chris on Full Stack Craft's YouTube channel."}
                    style={{ borderRadius: `2rem` }}
                />
            </div>
        </div>
    )
}
