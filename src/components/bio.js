import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { rhythm } from "../utils/typography"
import Sparkles from "./Sparkles"

export default function Bio() {
    const data = useStaticQuery(graphql`
        query BioQuery {
            avatar: file(
                absolutePath: { regex: "/defaultprofilepicture.jpg/" }
            ) {
                childImageSharp {
                    fixed(width: 200, height: 200) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
            site {
                siteMetadata {
                    author
                }
            }
        }
    `)

    const { author } = data.site.siteMetadata
    return (
        <>
            <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    minWidth: 260,
                    maxWidth: 260,
                    minHeight: 260,
                    maxHeight: 260,
                    borderRadius: `100%`,
                    marginTop: "2rem",
                    marginBottom: "1rem",
                }}
                imgStyle={{
                    borderRadius: `50%`,
                }}
            />
            <div
                style={{
                    display: `flex`,
                    marginBottom: rhythm(2.5),
                    position: `relative`, // for canvas issue
                    zIndex: 10, // for canvas issue
                }}
            >
                <div>
                    <p className="bio-lead">
                        Hi! I'm Chris Frewin, I'm going to be COURSE MASTER for
                        2021!
                    </p>
                    <br />
                    <p>
                        Ha! I can prove that I'm a <span style={{fontWeight: 'bold'}}>COURSE MASTER</span> now! Check out all my courses and content on:<br/>
                        <a href="https://www.skillshare.com/user/christopherfrewin">Skillshare</a><br/>
                        <a href="https://www.udemy.com/user/chris-frewin">Udemy</a><br/>
                        <a href="https://www.youtube.com/channel/UCLaNEXFBI1wpGtxvGVjfHKw">YouTube</a><br/>
                        You can also check out the website for <Sparkles><span className="linear-wipe">Full Stack Craft</span></Sparkles>, the company I put all my full stack educational content under at:<br/>
                        <a href="https://fullstackcraft.com">fullstackcraft.com</a><br/>
                    </p>
                    <p>
                        If I'm not building or teaching full stack software, I'll be found hiking,
                        skiing, taking pictures, losing money on options,
                        spoiling homebrew, or creating music and art. I (mostly)
                        live in Austria.
                        <br />
                        <br />
                        <div
                            style={{
                                textAlign: "center",
                                border: "1px solid #f92672",
                            }}
                        >
                            <a
                                href="https://instagram.com/_chrisfrewin_"
                                rel="me"
                            >
                                Instagram
                            </a>
                            &nbsp; | &nbsp;
                            <a href="https://chrisfrewin.medium.com" rel="me">
                                Medium
                            </a>
                            &nbsp; | &nbsp;
                            <a href="https://twitter.com/Galt_" rel="me">
                                Twitter
                            </a>
                            &nbsp; | &nbsp;
                            <a
                                href="https://github.com/princefishthrower"
                                rel="me"
                            >
                                GitHub
                            </a>
                            &nbsp; | &nbsp;
                            <a
                                href="https://reddit.com/user/trollerroller"
                                rel="me"
                            >
                                Reddit
                            </a>
                            &nbsp; | &nbsp;
                            <a
                                class="u-email"
                                href="mailto:frewin.christopher@gmail.com"
                                rel="me"
                            >
                                Email
                            </a>
                        </div>
                        <br />
                        I'm a proud member of the{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://dev.to/frewinchristopher"
                        >
                            DEV Community
                        </a>
                        , and{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://producthunt.com/@galt_"
                        >
                            Product Hunt's Makers Community
                        </a>
                        !<br />
                        <br />
                        <span>
                            Sites and products I've built solo or co-developed:
                        </span>
                        <br />
                        <br />
                        <a
                            href="https://rœst.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            rœst.com
                        </a>{" "}
                        /{" "}
                        <a
                            href="https://rœst.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            rœst.coffee
                        </a>{" "}
                        (Solo)
                        <br />
                        <a
                            href="https://sirenapparel.us"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            sirenapparel.us
                        </a>{" "}
                        (Solo)
                        <br />
                        <a
                            href="https://chrisfrew.in/nlp-champs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            chrisfrew.in/nlp-champs (formerly nlp-champs.com)
                        </a>{" "}
                        (Solo)
                        <br />
                        <a
                            href="https://seelengeflüster-tirol.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            seelengeflüster-tirol.com
                        </a>{" "}
                        (Solo)
                        <br />
                        <a
                            href="https://wallstreetbetswally.github.io"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            wallstreetbetswally.github.io
                        </a>{" "}
                        (Solo)
                        <br />
                        <a
                            href="https://chrisfrew.in/invaders"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            chrisfrew.in/invaders
                        </a>{" "}
                        (Solo)
                        <br />
                        <a
                            href="https://chrisfrew.in/portfolio"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            chrisfrew.in/portfolio
                        </a>{" "}
                        (Solo)
                        <br />
                        <a
                            href="https://fullstackcraft.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            fullstackcraft.com
                        </a>{" "}
                        (Solo)
                        <br />
                        <a
                            href="https://risch-shoes.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            risch-shoes.com
                        </a>{" "}
                        (Co-Developed)
                    </p>
                </div>
            </div>
        </>
    )
}
