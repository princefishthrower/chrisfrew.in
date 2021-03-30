import React from "react"
import { Goodies } from "../components/pages/goodies/Goodies"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"

const GoodiesPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO title="Full Stack Downloadables, Freebies, N' More!" />
            <Goodies />
        </Layout>
    )
}

export default GoodiesPage
