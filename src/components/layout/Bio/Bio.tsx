import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { BioSharedText } from "./BioSharedText"
import { SignatureText } from "./SignatureText"
import { BioLead } from "./BioLead"
import { GatsbyImage } from "gatsby-plugin-image"

export default function Bio() {
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
        <>
            <div
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                }}
            >
                <GatsbyImage
                    className="title-youtube-picture"
                    image={data.youtube.childImageSharp.gatsbyImageData}
                    alt={"Chris on Full Stack Craft's YouTube channel."}
                />
            </div>
            <div
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    marginBottom: `2.5rem`,
                    position: `relative`, // for canvas issue
                    zIndex: 10, // for canvas issue
                }}
            >
                <BioLead />
                <BioSharedText />
                <p>
                    You can checkout more about my company, SaaS products, and
                    site portfolio on <Link to="/chris">my bio page</Link>.
                </p>
                <SignatureText />
            </div>
        </>
    )
}
