import React from "react"
import { Snippets } from "../components/pages/snippets/Snippets"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"

const SnippetsPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO frontmatter={{title: "Full Stack Snippets", description: "A variety of code snippets, from backend to frontend, written in a clean-as-I-can-make-it style, ready for you to copy and paste wherever you may need them."}}/>
            <Snippets pdfMode={false} />
        </Layout>
    )
}

export default SnippetsPage
