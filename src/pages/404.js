import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ConfettiContainer from "../components/confetti-container"

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const title = data.site.siteMetadata.title
    const description = data.site.siteMetadata.description

    return (
      <>
      <Layout location={this.props.location} title={title} description={description}>
        <SEO title="404: Not Found" />
        <h1 style={{textAlign: 'center'}}>Not Found!</h1>
        <h2 style={{textAlign: 'center'}}>Yay! You get some confetti!</h2>
        <h3 style={{textAlign: 'center'}}>But it's actually not so nice, eh?</h3>
        <p style={{textAlign: 'center'}}><b><Link style={{textAlign: 'center'}} to="/">Back Home</Link></b></p>
      </Layout>
      <ConfettiContainer/>
      </>
    )
  }
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`
