import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import ConfettiContainer from "../components/utils/ConfettiContainer"

export default function NotFoundPage(props) {
    const { data, location } = props
    const title = data.site.siteMetadata.title
    const description = data.site.siteMetadata.description

    return (
        <>
            <Layout
                location={location}
                title={title}
                description={description}
            >
                <SEO />
                <h1 style={{ textAlign: "center" }}>Not Found!</h1>
                <h2 style={{ textAlign: "center" }}>
                    Yay! You get some confetti!
                </h2>
                <h3 style={{ textAlign: "center" }}>
                    But it's actually not so nice, eh?
                </h3>
                <p style={{ textAlign: "center" }}>
                    <b>
                        <Link style={{ textAlign: "center" }} to="/">
                            Back Home
                        </Link>
                    </b>
                </p>
            </Layout>
            <ConfettiContainer />
        </>
    )
}

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
