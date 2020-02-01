/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/defaultprofilepicture.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
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
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
        position: `relative`, // for canvas issue
        zIndex: 10, // for canvas issue
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <p>
    Hi, I'm <strong>Chris Frewin</strong>, I'm going to be COURSE MASTER for 2020 (I hope)!<sup><sup><sup>please help me</sup></sup></sup>
    <br/>
    <br/>
    I'm an ex-mechanical engineer gone full-remote, full-stack application software engineer, and a hobbyist machine learning/natural language processing developer.{' '}
    <br/>
    <br/>
    If I'm not building software, I'll be found hiking, skiing, taking pictures, spoiling homebrew, or creating music and art. I (mostly) live in Austria.
    <br/>
    <br/>
    <a href="https://instagram.com/_chrisfrewin_">
      You can follow me on Instagram.
    </a>
    <br/>
    <br/>
     or,
    <br/>
    <br/>
    <a href="mailto:frewin.christopher@gmail.com">
      Send me an email.
    </a>
    <br/>
    <br/>
    <br/>
    I'm a proud member of the <a target="_blank" rel="noopener noreferrer" href="https://dev.to/frewinchristopher">DEV Community</a>, and <a target="_blank" rel="noopener noreferrer" href="https://producthunt.com/@galt_">Product Hunt's Makers Community</a>!<br/><br/>
    <span>Sites and products I've built solo or co-developed:</span><br/><br/>
    <a href="https://sirenapparel.us" target="_blank" rel="noopener noreferrer">sirenapparel.us</a> (Solo)<br/>
    <a href="https://chrisfrew.in/nlp-champs" target="_blank" rel="noopener noreferrer">chrisfrew.in/nlp-champs (formerly nlp-champs.com)</a> (Solo)<br/>
    <a href="https://seelengeflüster-tirol.com" target="_blank" rel="noopener noreferrer">seelengeflüster-tirol.com</a> (Solo)<br/>
    <a href="https://wallstreetbetswally.github.io" target="_blank" rel="noopener noreferrer">wallstreetbetswally.github.io</a> (Solo)<br/>
    <a href="https://chrisfrew.in/invaders" target="_blank" rel="noopener noreferrer">chrisfrew.in/invaders</a> (Solo)<br/>
    <a href="https://chrisfrew.in/portfolio" target="_blank" rel="noopener noreferrer">chrisfrew.in/portfolio</a> (Solo)<br/>
    <a href="https://risch-shoes.com" target="_blank" rel="noopener noreferrer">risch-shoes.com</a> (Co-Developed)
    <br/>
    <br/>
    <br/>
  </p>
    </div>
  )
}

export default Bio
