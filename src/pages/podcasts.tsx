import React from "react"
import Layout from "../components/layout/Layout"
import { Podcasts } from "../components/pages/podcasts/Podcasts"
import SEO from "../components/utils/SEO"

const PodcastPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO frontmatter={{title: "Podcasts", description: "Podcasts that chris has been featured in."}}/>
            <Podcasts />
        </Layout>
    )
}

export default PodcastPage
