import React from "react"
import { Snippets } from "../components/pages/snippets/Snippets"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const SnippetsPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <Snippets pdfMode={false} />
        </Layout>
    )
}

export const Head = () => (
    <SEO
        title="Full Stack Snippets"
        description="A variety of code snippets, from backend to frontend, written in a clean-as-I-can-make-it style, ready for you to copy and paste wherever you may need them."
    />
)

export default SnippetsPage
