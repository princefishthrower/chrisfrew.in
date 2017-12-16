import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './defaultprofilepicture.png'
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
            borderRadius: '100%'
          }}
        />
        <p>
          Hi, I'm <strong>Chris Frewin</strong>, an ex-mechanical engineer living in Austria and working in Leichtenstein. For my day job, I'm a full stack SAP/webapp developer, and a hobbyist full stack web/machine-learning/Ethereum developer. If I'm not writing code, I'll be found hiking, skiing, or creating art.{' '}
          <a href="https://twitter.com/galt_">
            You can follow me on Twitter, @Galt_,
          </a>
          {' '}
          (though I don't post often), or,
          {' '}
          <a href="mailto:frewin.christopher@gmail.com">
            Send me an email.
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
