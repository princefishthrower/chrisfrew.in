import React from "react"
import Layout from "../components/layout/Layout"
import { Books } from "../components/pages/books/Books"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const BookPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <Books />
        </Layout>
    )
}

export const Head = () => (
    <SEO
        title="Full Stack Books"
        description="Practical step-by-step software books."
    />
)

export default BookPage
