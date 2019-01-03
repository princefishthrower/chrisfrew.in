import React from 'react'

// other third party
import Image from 'react-image-webp';

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'
import { rhythm } from '../utils/typography'

// custom components
import MailchimpSignup from './MailchimpSignup';

const oBioPicture = (
  <Image
    webp={require('../images/defaultprofilepicture.webp')}
    src={require('../images/defaultprofilepicture.png')}
    alt={`Chris Frewin`}
    style={{
      marginRight: rhythm(1 / 2),
      marginBottom: 0,
      width: rhythm(8),
      height: rhythm(8),
      borderRadius: '100%',
      zIndex:999
    }}
  />
);
const oBioText = (
  <p>
    Hi, I'm <strong>Chris Frewin</strong>, I run and post on
    {' '}
    <a href="https://nlp-champs.com" target="_blank" rel="noopener noreferrer">
      nlp-champs.com
    </a>
    {' '}
    and own the <a href="https://medium.com/@sirenapparel/siren-apparel-all-about-us-43c99839de5d" target="_blank" rel="noopener noreferrer">charity clothing</a> company
    {' '}
    <a href="https://sirenapparel.us" target="_blank" rel="noopener noreferrer">
      Siren Apparel
    </a>
    .
    {'\n'}
    I'm an ex-mechanical engineer gone full-remote, full-stack application software engineer, and a hobbyist machine learning/natural language processing developer. If I'm not building software, I'll be found hiking, skiing, losing money trading options, or creating music and art. I (mostly) live in Austria.{' '}
    <a href="https://twitter.com/galt_">
      You can follow me on Twitter, @Galt_,
    </a>
    {' '}
    (though I don't post often), or,
    {' '}
    <a href="mailto:frewin.christopher@gmail.com">
      Send me an email.
    </a>
    <br/>
    <br/>
    {' '}
    Got a project/job that needs doin'? <a href="https://chrisfrew.in/talk-shop">Get in contact with me</a> and let's get to it! I'm always looking to learn and build new things!
    <br/>
    <br/>
    I'm a proud member of <a target="_blank" rel="noopener noreferrer" href="https://dev.to/frewinchristopher">DEV Community</a>, <a target="_blank" rel="noopener noreferrer" href="https://producthunt.com/@galt_">Product Hunt's Makers Community</a>, and <a target="_blank" rel="noopener noreferrer" href="https://community.egghead.io/members/1420280">Egghead.io's Community</a>!<br/><br/>
    <span>Sites I've Built:</span><br/>
    <a href="https://sirenapparel.us" target="_blank" rel="noopener noreferrer">sirenapparel.us</a><br/>
    <a href="https://sirenapparel.eu" target="_blank" rel="noopener noreferrer">sirenapparel.eu</a><br/>
    <a href="https://nlp-champs.com" target="_blank" rel="noopener noreferrer">nlp-champs.com</a><br/>
    <a href="https://how-do-i.app" target="_blank" rel="noopener noreferrer">how-do-i.app</a><br/>
    <a href="https://seelengeflüster-tirol.com" target="_blank" rel="noopener noreferrer">seelengeflüster-tirol.com</a><br/>
    <a href="https://wallstreetbetswally.github.io" target="_blank" rel="noopener noreferrer">wallstreetbetswally.github.io</a><br/>
    <a href="https://chrisfrew.in/invaders" target="_blank" rel="noopener noreferrer">chrisfrew.in/invaders</a>
    <br/>
    <br/>
    (Probably more fun to see through my <a href="https://chrisfrew.in/portfolio" target="_blank" rel="noopener noreferrer">portfolio page</a>!)
    <br/>
  </p>
);    

const oRSSFeedInformation = (
  <div>
    <sub>If email isn't your thing, no worries! You can subscribe to my RSS feed using:<br/><br/><b>https://chrisfrew.in/rss.xml</b></sub>
  </div>
)

class Bio extends React.Component {
  constructor() {
    super();
    this.state = {
        oBio: null
    }
  }
  render() {
    return (
      <div>
        {this.state.oBio}
      </div>
    );
  }
  componentDidMount() {
    let oBio;
    if (window.innerHeight >= 768) {
      oBio = ( // desktop and tablet configuration: split text + picture
        <div>
        <div
          style={{
            display: 'flex',
            marginBottom: rhythm(2.5),
          }}
        >
          {oBioPicture}
          {oBioText}      
        </div>
        <MailchimpSignup/>
        {oRSSFeedInformation}
      </div>
      );
    } else {
      oBio = ( // mobile configuration
        <div>
          <div
            style={{
              display: 'flex',
              marginBottom: rhythm(2.5),
            }}
          >
            {oBioPicture}
          </div>
          <div
            style={{
              display: 'flex',
              marginBottom: rhythm(2.5),
            }}
          >
            {oBioText}
            
          </div>
          <MailchimpSignup/>
          {oRSSFeedInformation}
        </div>
      );
    }
    this.setState({oBio: oBio});
  }
}

export default Bio
