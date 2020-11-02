import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { rhythm } from "../utils/typography"

export default function Bio() {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/defaultprofilepicture.jpg/" }) {
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
            Hi! 
            <br/>
            I'm Chris Frewin, I'm going to be COURSE MASTER
            for 2020 (I hope)!
            <sup>
              <sup>
                <sup>please help me</sup>
              </sup>
            </sup>
          </p>
          <br />
          <p>
            If I'm not building software, I'll be found hiking, skiing, taking
            pictures, losing money on options, spoiling homebrew, or creating music and art. I (mostly)
            live in Austria.
            <br />
            <br />
            <a href="https://instagram.com/_chrisfrewin_">
              You can follow me on Instagram.
            </a>
            <br />
            <br />
            or,
            <br />
            <br />
            <a href="mailto:frewin.christopher@gmail.com">Send me an email.</a>
            <br />
            <br />
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
            <span>Sites and products I've built solo or co-developed:</span>
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
