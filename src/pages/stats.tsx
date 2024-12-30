import * as React from "react"
import Layout from "../components/layout/Layout"
import { Stats } from "../components/pages/stats/Stats"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const StatsPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <Stats />
        </Layout>
    )
}

export const Head = () => (
    <SEO
        title="Blog Stats"
        description="Up to date stats all about Chris' Full Stack Blog."
    />
)

export default StatsPage