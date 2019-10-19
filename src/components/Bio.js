import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'
import { rhythm } from '../utils/typography'

// custom components
import MailchimpSignup from './MailchimpSignup';
import BioPicture from './BioPicture';

// TODO: finish portfolio page!
const BioText = (
  <p>
    Hi, I'm <strong>Chris Frewin</strong>, I spend far too much time working on a Magento project and wasting time on ideas that burn me out and which I ultimately abandon!<sup><sup><sup>hmmmm, this guy is super salty...</sup></sup></sup>
    <br/>
    <br/>
    I'm an ex-mechanical engineer gone full-remote, full-stack application software engineer, and a hobbyist machine learning/natural language processing developer.{' '}
    <br/>
    <br/>
    If I'm not building software, I'll be found hiking, skiing, losing money trading options, spoiling homebrew, or creating music and art. I (mostly) live in Austria.
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
    <span>Sites I've Built:</span><br/>
    <a href="https://sirenapparel.us" target="_blank" rel="noopener noreferrer">sirenapparel.us</a><br/>
    <a href="https://chrisfrew.in/nlp-champs" target="_blank" rel="noopener noreferrer">chrisfrew.in/nlp-champs (formerly nlp-champs.com)</a><br/>
    <a href="https://seelengeflüster-tirol.com" target="_blank" rel="noopener noreferrer">seelengeflüster-tirol.com</a><br/>
    <a href="https://wallstreetbetswally.github.io" target="_blank" rel="noopener noreferrer">wallstreetbetswally.github.io</a><br/>
    <a href="https://chrisfrew.in/invaders" target="_blank" rel="noopener noreferrer">chrisfrew.in/invaders</a><br/>
    <a href="https://chrisfrew.in/portfolio" target="_blank" rel="noopener noreferrer">chrisfrew.in/portfolio</a>
    <br/>
    <br/>
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
          <BioPicture/>
          {BioText}      
        </div>
        <MailchimpSignup/>
        {oRSSFeedInformation}
      </div>
      );
    } else {
      // mobile configuration
      oBio = ( 
        <div>
          <div
            style={{
              display: 'flex',
              marginBottom: rhythm(2.5),
            }}
          >
            <BioPicture/>
          </div>
          <div
            style={{
              display: 'flex',
              marginBottom: rhythm(2.5),
            }}
          >
            {BioText}
            
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