import React from "react"
import Layout from "../components/layout/Layout"
import { Podcasts } from "../components/pages/podcasts/Podcasts"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const PodcastPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <Podcasts />
        </Layout>
    )
}

export const Head = () => (
    <SEO
        title="Podcasts"
        description="Podcasts that Chris has been featured in."
    />
)

export default PodcastPage
