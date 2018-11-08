import React from 'react'
import PropTypes from 'prop-types'

class MailchimpSignup extends React.Component {
  render () {
    return (
      <div id="mc_embed_signup">
        <form action="https://chrisfrew.us19.list-manage.com/subscribe/post?u=5f7289fbe97df30f673068826&amp;id=b1729bbdce" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
            <div id="mc_embed_signup_scroll">
              <label htmlFor="mce-EMAIL" style={{'fontFamily': 'Merriweather', 'fontWeight':'900'}}>Subscribe for weekly Wednesday updates on new posts (if any)!</label>
        	    <input type="email" style={{'fontFamily': 'Merriweather', 'fontWeight':'900'}} name="EMAIL" className="email" id="mce-EMAIL" placeholder="you_are@awesome.com" required/>
              <div style={{'position': 'absolute', 'left': '-5000px'}} aria-hidden="true"><input type="text" name="b_5f7289fbe97df30f673068826_b1729bbdce" tabIndex="-1"/></div>
              <div className="clear"><input type="submit" style={{'backgroundColor':'#F92672', 'fontFamily': 'Merriweather', 'fontWeight':'900'}} value="Subscribe!" name="subscribe" id="mc-embedded-subscribe" className="button"/></div>
            </div>
        </form>
      </div>
    )
  }
}

export default MailchimpSignup;