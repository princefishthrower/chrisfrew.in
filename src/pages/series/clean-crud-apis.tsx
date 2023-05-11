import * as React from "react"
import Layout from "../../components/layout/Layout"
import { CleanCrudApis } from "../../components/pages/series/CleanCrudApis"
import SEO from "../../components/utils/SEO"
import type { PageProps } from "gatsby"

const CleanCrudApisPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <SEO title="Series: Clean CRUD APIs" description={`All posts from my series "Clean CRUD APIs". I hope you enjoy!`}/>
            <CleanCrudApis />
        </Layout>
    )
}

export default CleanCrudApisPage