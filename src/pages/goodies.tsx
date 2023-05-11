import React from "react"
import { Goodies } from "../components/pages/goodies/Goodies"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const GoodiesPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <SEO title="Full Stack Goodies" description="A variety of downloads, freebies, and more."/>
            <Goodies />
        </Layout>
    )
}

export default GoodiesPage
