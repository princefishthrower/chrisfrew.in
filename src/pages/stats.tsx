import * as React from "react"
import Layout from "../components/layout/Layout"
import { Stats } from "../components/pages/stats/Stats"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const StatsPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <SEO title="Blog Stats" description="Up to date stats all about Chris' Full Stack Blog."/>
            <Stats />
        </Layout>
    )
}

export default StatsPage