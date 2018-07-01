import React from 'react'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'

import { rhythm, scale } from '../utils/typography'

import Emoji from 'react-emoji-render';

// if (window !== 'undefined') {
//   import P5Wrapper from 'react-p5-wrapper';
// }


class Template extends React.Component {
  constructor() {
    super();
    this.state = {
      iWindowWidth: 0,
      iWindowHeight: 0,
      iCount: 0
    }
    this.sketch = this.sketch.bind(this);
  }
  sketch (p5) {
    var that = this;
    p5.setup = function () {
      console.log(that.divElement.clientWidth);
      console.log(that.divElement.clientHeight);
      p5.createCanvas(that.divElement.clientWidth, that.divElement.clientHeight);
    };

    p5.myCustomRedrawAccordingToNewPropsHandler = function (props) {
      if (props.rotation){
        rotation = props.rotation * Math.PI / 180;
      }
    };

    p5.draw = function () {
      if (p5.mouseIsPressed) {
            p5.fill(0);
          } else {
            switch (that.state.iCount) {
              case 1:
                p5.fill('#F91970');
                break;
              case 2:
                p5.fill('#67D9EE');
                break;
              case 3:
                p5.fill('#A5E444')
                break;
            }
            that.state.iCount++;
            if (that.state.iCount === 4) {
              that.state.iCount = 1;
            }
          }
          p5.ellipse(p5.mouseX, p5.mouseY, 20, 20);
    };
  }
  // getSnapshotBeforeUpdate() {
  //   // only at this point will the gatsby div be fully filled, so we can get the dimensions of our blog
  //   let oGatsbyDiv = document.getElementById("___gatsby");
  //   this.state.iWindowWidth = oGatsbyDiv.innerWidth;
  //   this.state.iWindowHeight = oGatsbyDiv.innerHeight;
  //   console.table(this.state);
  // }
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
        <br/>
        <a href="https://chrisfrew.in/talk-shop" style={{color:'black',textDecorationColor:'black'}}><span style={{fontSize:'12px',color:'black'}}>{"<"}{"<"}Hire me / let's talk shop{">"}{">"}</span></a>
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
    // when read, this component goes right under that div there
    // <P5Wrapper sketch={this.sketch} className="positionAbsolute"/>
    return (
      <div ref={ (divElement) => this.divElement = divElement}>
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
            Hosted independently (i.e. on an old Dell laptop <Emoji text=":joy:" />) with Node.js & express.<br/>
          <style dangerouslySetInnerHTML={{__html: ".bmc-button img{width: 27px !important;margin-bottom: 3px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{line-height: 36px !important;height:37px !important;text-decoration: none !important;display:inline-block !important;color:#000000 !important;background-color:#FFDD00 !important;border-radius: 3px !important;border: 1px solid transparent !important;padding: 1px 9px !important;font-size: 23px !important;letter-spacing: 0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Cookie', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#000000 !important;}" }} /><link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet" /><a className="bmc-button" target="_blank" href="https://www.buymeacoffee.com/chrisfrewin"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a cappucino" /><span style={{marginLeft: 5}}>Buy me a cappucino</span></a><br/>
            USD: <code><a href="http://paypal.me/chrisfrewin">http://paypal.me/chrisfrewin</a><br/></code>
            BTC: <code>1D6aFgTLZrV4QAJ5ZhjDxV8Rj78LLjKvcm</code><br/>
            ETH: <code>0x1bc3850619803C48b79481A3Aee167141be20432</code><br/>
            XRB: <code>xrb_1s8s4bpucoseodz3oqmzenecimoe6rntpgsnpdfg6yequd1hibraghznxwga</code><br/>
          <style dangerouslySetInnerHTML={{__html: ".acfp-button img{width: 27px !important;margin-bottom: 3px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.acfp-button{line-height: 36px !important;height:37px !important;text-decoration: none !important;display:inline-block !important;color:#000000 !important;background-color:red !important;border-radius: 3px !important;border: 1px solid transparent !important;padding: 1px 9px !important;font-size: 23px !important;letter-spacing: 0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Pacifico', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.acfp-button:hover, .acfp-button:active, .acfp-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#000000 !important;}" }} /><link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet" /><a className="acfp-button" target="_blank" href="https://chrisfrew.in/introducing-chrisfrewin-productions"><img src="https://www.chrisfrew.in/digital-avatar.svg"/><span style={{marginLeft: 5}}>a chrisfrew.in production</span></a><br/>
          </h5>
        </footer>
      </Container>
    </div>
    );
  }
}

export default Template
