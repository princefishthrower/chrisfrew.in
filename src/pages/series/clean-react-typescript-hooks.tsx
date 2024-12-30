import * as React from "react"
import Layout from "../../components/layout/Layout"
import { CleanReactTypeScriptHooks } from "../../components/pages/series/CleanReactTypeScriptHooks"
import SEO from "../../components/utils/SEO"
import type { PageProps } from "gatsby"

const CleanReactTypeScriptHooksPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <CleanReactTypeScriptHooks />
        </Layout>
    )
}

export const Head = () => (
    <SEO
        title="Series: Clean React TypeScript Hooks"
        description={`All posts from my series "Clean React TypeScript Hooks". I hope you enjoy!`}
    />
)

export default CleanReactTypeScriptHooksPage