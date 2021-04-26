import * as React from "react"
import Layout from "../components/layout/Layout"
import { Stats } from "../components/pages/stats/Stats"
import SEO from "../components/utils/SEO"

const StatsPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO/>
            <Stats />
        </Layout>
    )
}

export default StatsPage