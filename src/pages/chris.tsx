import React from "react"
import Layout from "../components/layout/Layout"
import { Chris } from "../components/pages/chris/Chris"
import SEO from "../components/utils/SEO"

const ChrisPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO title="About Chris" />
            <Chris />
        </Layout>
    )
}

export default ChrisPage
