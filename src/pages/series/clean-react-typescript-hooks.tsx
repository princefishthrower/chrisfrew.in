import * as React from "react"
import Layout from "../../components/layout/Layout"
import { CleanReactTypeScriptHooks } from "../../components/pages/series/CleanReactTypeScriptHooks"
import SEO from "../../components/utils/SEO"

const CleanReactTypeScriptHooksPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO frontmatter={{title: "Series: Clean React TypeScript Hooks", description: "All posts from my series \"Clean React TypeScript Hooks\". I hope you enjoy!"}}/>
            <CleanReactTypeScriptHooks />
        </Layout>
    )
}

export default CleanReactTypeScriptHooksPage