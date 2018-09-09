import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from '../images/defaultprofilepicture.png'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Chris Frewin`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(5),
            height: rhythm(5),
            borderRadius: '100%',
            zIndex:999
          }}
        />
        <p>
          Hi, I'm <strong>Chris Frewin</strong>, I run and post on
          {' '}
          <a href="https://nlp-champs.com" target="_blank">
            nlp-champs.com
          </a>
          {' '}
          and own
          {' '}
          <a href="https://sirenapparel.us" target="_blank">
            Siren Apparel
          </a>
          .
          {'\n'}
          I'm an ex-mechanical gone developer engineer living in Austria and working in Liechtenstein. For my day job, I'm a full stack SAP/web app developer, and a hobbyist full stack web/machine learning/natural language processing/Ethereum developer. If I'm not building software, I'll be found hiking, skiing, or creating art.{' '}
          <a href="https://twitter.com/galt_">
            You can follow me on Twitter, @Galt_,
          </a>
          {' '}
          (though I don't post often), or,
          {' '}
          <a href="mailto:frewin.christopher@gmail.com">
            Send me an email.
          </a>
          {' '}
          Got a project/job idea? Get in contact with me and let's get to it! I'm always looking to learn and build new things!
        </p>
      </div>
    )
  }
}

export default Bio
