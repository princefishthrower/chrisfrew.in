import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { rhythm, scale } from '../../utils/typography'

const MovieNight = () => {    
    return (
      <div>
        <Helmet title="June Movie Night!!!" />
        <h1>June Movie Night!!!</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          Join us in June for an evening movie on the balcony of the Bitcoin penthouse* (with plenty of popcorn and... <u><i>adult refreshments</i></u>). Just fill out the following form to express your cinematic wishes and expect a fixed time from Chris before the end of May!
        </p>

        <div className="typeform-widget" 
          data-url="https://chris116.typeform.com/to/Z3nvQS" 
          style={{width: '100%', height: 500}} />  
          <div style={{fontFamily: 'Sans-Serif', fontSize: 12, color: '#999', opacity: '0.5', paddingTop: 5}}> powered by <a href="https://admin.typeform.com/signup?utm_campaign=Z3nvQS&utm_source=typeform.com-158080-Basic&utm_medium=typeform&utm_content=typeform-embedded-poweredbytypeform&utm_term=EN" style={{color: '#999'}} target="_blank">Typeform</a> 
        </div>
        <div>
          *Patent Pending
        </div>
      </div>
    )
}

export default MovieNight