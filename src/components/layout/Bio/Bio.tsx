import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import Sparkles from "../../utils/Sparkles"
import { Signature } from "./Signature"

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
                <p style={{ textAlign: "center", fontWeight: "bolder" }}>
                    Hi! I'm Chris!
                </p>
                <p>
                    <strong>
                        Ah... 😌 I still remember opening up my very first Bash
                        terminal... it was a late summer day in September in
                        Cornell's Engineering Quad...
                    </strong>
                </p>
                <div className="text-center">
                    <h3>
                        <Sparkles wipeType="love">
                            It was love at first sight!
                        </Sparkles>
                    </h3>
                </div>
                <p>
                    From that first Bash terminal, I've since learned a variety
                    of frameworks, databases, design patterns, and languages,
                    including TypeScript, JavaScript, .NET, Python, React,
                    Redux, ABAP, SAPUI5 UI5, C#, PHP7, Postgresql, and Magento.
                    I love the challenge of building profitable SaaS products!
                </p>
                <p>
                    I'm also a full stack software educator: I cherish teaching
                    what I've learned over the years, because I think software
                    development is especially difficult these days, with all the
                    new tools and frameworks that seem to come out daily. I
                    focus both advanced and niche topics in my courses and each
                    course always is considered as part of a wider scope of the
                    full stack software ecosystem. If such courses sound
                    interesting to you, please checkout{" "}
                    <Link to="/courses">my Full Stack Courses page</Link>!
                </p>
                <p>
                    I don't want anyone to be intimated by the noise of the
                    software world - I too struggle and reach out from time to
                    time for help and mentoring. To this end, I try to make my
                    courses as clear as possible so you don't get lost or
                    confused.
                </p>
                <p>
                    You can read more about my SaaS products, site portfolio,
                    and more on <Link to="/chris">my bio page</Link>.
                </p>
                <p>
                    <strong>I sincerely hope you enjoy the blog!</strong>
                </p>
                <Signature />
                <p>- Chris</p>
            </div>
        </>
    )
}
