import React from "react"
import Layout from "../components/layout/Layout"
import { Chris } from "../components/pages/chris/Chris"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const ChrisPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <SEO title="About Chris" description="Chris' About Page"/>
            <Chris />
        </Layout>
    )
}

export default ChrisPage
