import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import axios from 'axios'
import { rhythm, scale } from '../../utils/typography'

class SECFilings extends React.Component {    
    render() {
      return (
        <div>
           <Helmet title="SEC Filings" />
           <h1>Chrisfrew.in Productions Privacy Policy</h1>
           <p>
              Chrisfrew.in Productions respects your privacy. We do not collect personally identifiable information about you unless you voluntarily provide it, such as when you send feedback to Chrisfrew.in Productions or register for one of Chrisfrew.in Productions’s apps. If you voluntarily provide your email address or other contact information, we might also use it to inform you of changes to Chrisfrew.in Productions, to survey you about your use or opinion of Chrisfrew.in Productions, or to ask for your support. At your request, we will remove your contact information from our files.
           </p>
           <p>
              We DO NOT make your contact information or any other personally identifiable information available to anyone outside Chrisfrew.in Productions or its service providers (who use the information only for authorized Chrisfrew.in Productions purposes) unless we are legally required to do so.
           </p>
           <p>
              In addition to the above, we collect certain anonymous (non-personally identifiable) information to help us improve the Chrisfrew.in Productions web site and to evaluate the access and use of Chrisfrew.in Productions materials and the impact of Chrisfrew.in Productions on the worldwide educational community:
           </p>
           <p>
              We may use web analysis tools that are built into the Chrisfrew.in Productions web site to measure and collect anonymous session information.
           </p>
           <p>
              We also use “cookies” to improve your Chrisfrew.in Productions web experience and to collect anonymous information about how you use Chrisfrew.in Productions. However, cookies are not required for Chrisfrew.in Productions use. If your browser is configured not to accept cookies, you will still be able to access Chrisfrew.in Productions and its content.
           </p>
           <p>
              When we report information about Chrisfrew.in Productions access, use, and impact, we report aggregate, non-personally identifiable data. Occasionally, we report quoted feedback from users. We do not attribute feedback to specific individuals unless we obtain permission to use that person’s name along with the feedback.
           </p>
           <p>
             Thanks :)
           </p>
        </div>
      );
    }
}

export default SECFilings