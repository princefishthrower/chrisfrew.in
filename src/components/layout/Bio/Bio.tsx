import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import Sparkles from "../../utils/Sparkles"
import { Signature } from "./Signature"
import { BioSharedText } from "./BioSharedText"
import { SignatureText } from "./SignatureText"

export default function Bio() {
    const data = useStaticQuery(graphql`
        query BioQuery {
            site {
                siteMetadata {
                    author
                }
            }
        }
    `)

    return (
        <>
            <StaticImage
                src={"../../../images/avatar.jpg"}
                alt={data.site.siteMetadata.author}
                width={200}
                height={200}
                layout="fixed"
                placeholder="blurred"
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: `100%`,
                    marginTop: "2rem",
                    marginBottom: "1rem",
                }}
            />
            <div
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    marginBottom: `2.5rem`,
                    position: `relative`, // for canvas issue
                    zIndex: 10, // for canvas issue
                }}
            >
                <p style={{ textAlign: "center" }}>
                    <strong>Hi! I'm Chris!</strong>
                </p>
                <BioSharedText/>
                <p>
                    You can checkout more about my company, SaaS products, and
                    site portfolio on <Link to="/chris">my bio page</Link>.
                </p>
                <SignatureText/>
            </div>
        </>
    )
}
