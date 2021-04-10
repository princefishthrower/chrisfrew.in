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
                <p style={{ textAlign: "center" }}>
                    <strong>Hi! I'm Chris!</strong>
                </p>
                <p>
                    <strong>
                        Ah... 😌 I still remember opening up my very first Bash
                        terminal on Ubuntu... it was late summer, in Cornell's
                        Engineering Quad... in short...
                    </strong>
                </p>
                <div className="text-center">
                    <Sparkles wipeType="love">It was love</Sparkles>
                </div>
                <div className="text-center">
                    <Sparkles wipeType="love">at first sight!</Sparkles>
                </div>
                <p>
                    Ever since that first Ubuntu experience, I've been in love
                    with writing software and{" "}
                    <strong>
                        I've learned an extensive variety of frameworks,
                        databases, design patterns, and languages
                    </strong>
                    , including TypeScript, JavaScript, .NET, Python, React,
                    Redux, ABAP, SAPUI5 UI5, C#, PHP7, Postgresql, Magento, and
                    more. I love the challenge of building profitable SaaS
                    products!
                </p>
                <p>
                    <strong>I'm also a full stack software educator.</strong> I
                    cherish teaching what I've learned over the years, because I
                    think software development is especially difficult these
                    days, with all the new tools and frameworks that seem to
                    come out daily. I focus both advanced and niche topics in my
                    courses and each course always considers its place in the
                    backdrop of the wider full stack software ecosystem. If such
                    courses sound interesting to you, please checkout my{" "}
                    <Link to="/courses">Full Stack Courses</Link>.
                </p>
                <p>
                    I don't want anyone to be intimated by the noise of the
                    software world - I too struggle and reach out from time to
                    time for help and mentoring. To this end, I try to make my
                    courses as clear as possible so you don't get lost or
                    confused. I also avoid the theoretical - I offer real world
                    examples far beyond the overused 'todo list' app example.
                </p>
                <p>
                    You can checkout more about my company, SaaS products, and
                    site portfolio on <Link to="/chris">my bio page</Link>.
                </p>
                <p>
                    <strong>
                        I consistently put a lot of effort into this site and
                        it's content - I sincerely hope you enjoy the blog!
                    </strong>
                </p>
                <Signature />
                <p>- Chris</p>
            </div>
        </>
    )
}
