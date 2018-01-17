import React from 'react'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'

import { rhythm, scale } from '../utils/typography'

import Emoji from 'react-emoji-render';

class Template extends React.Component {
  render() {
    let sYear = new Date().getFullYear();
    let title = (
      <div>
        Chris's<br/>
        <span style={{color:'#F92672'}}>Full Stack</span>,<br/>
        <span style={{color:'#66D9EF'}}>Web Development</span>,<br/>
        <span style={{color:'#A6E22E'}}>ABAP</span>,<br/>
        <span style={{color:'#F92672'}}>SAPUI5</span>,<br/>
        <span style={{color:'#66D9EF'}}>Blockchain</span>,<br/>
        <span style={{color:'#A6E22E'}}>Machine Learning</span>,<br/>
        &<br/>
        <span style={{color:'#F92672'}}>Natural Language Processing</span><br/>
        <span style={{color:'#66D9EF'}}>Blog</span>.
      </div>
    );
    const { location, children } = this.props
    let header

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`
    }

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
          {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: rhythm(-1),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <Container
        style={{
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {header}
        {children()}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        <footer>
          <h5>
            Copyright © {sYear} Chris Frewin.<br/>
            Based at one point on <a href="https://github.com/gatsbyjs/gatsby-starter-blog">this blog template.</a><br/>
            Static site powered by <a href="https://reactjs.org/">React</a> & <a href="https://www.gatsbyjs.org/">Gatsby.js</a><br/>
            Code highlighting by <a href="http://prismjs.com">Prism.js</a><br/>
            Colors inspired by the Monokai color scheme (I <Emoji text=":two_hearts:"/>{'\u00A0'}{'\u00A0'}Sublime Text <Emoji text=":smile:" /> )<br/>
            Hosted independently with Node.js & express.<br/>
            Donate:<br/>
            USD: <code><a href="http://paypal.me/chrisfrewin">http://paypal.me/chrisfrewin</a><br/></code>
            BTC: <code>1D6aFgTLZrV4QAJ5ZhjDxV8Rj78LLjKvcm</code><br/>
            ETH: <code>0x1bc3850619803C48b79481A3Aee167141be20432</code><br/>
            XRB: <code>xrb_1s8s4bpucoseodz3oqmzenecimoe6rntpgsnpdfg6yequd1hibraghznxwga</code><br/>
          </h5>
        </footer>
      </Container>
    )
  }
}

export default Template
