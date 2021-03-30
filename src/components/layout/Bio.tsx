import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

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
                src={"../../images/avatar.jpg"}
                alt={data.site.siteMetadata.author}
                width={260}
                height={260}
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
                <p style={{ textAlign: "center", fontWeight: "900" }}>
                    Hi! I'm Chris!
                </p>
                <p>
                    I've been a professional full stack software engineer for 7+
                    years, and I've been programming for many more.{" "}
                </p>
                <p>
                    Over my professional career I've learned a variety of frameworks,
                    databases, languages, and design patterns, including
                    TypeScript, .NET, JavaScript, Python, React, Redux, ABAP,
                    SAPUI5 UI5, C#, PHP7, Postgresql, and Magento. I love
                    teaching and building SaaS products!
                </p>
                <p>
                    Read more about my SaaS products, site portfolio, and more
                    on <Link to="/chris">the about page</Link>.
                </p>
            </div>
        </>
    )
}
