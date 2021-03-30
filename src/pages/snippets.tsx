import React from "react"
import { Snippets } from "../components/pages/snippets/Snippets"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"

const SnippetsPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO title="Full Stack Snippets" />
            <Snippets />
        </Layout>
    )
}

export default SnippetsPage
