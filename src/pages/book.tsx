import React from "react"
import Layout from "../components/layout/Layout"
import { Book } from "../components/pages/book/Book"
import SEO from "../components/utils/SEO"

const BookPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO frontmatter={{title: "Full Stack SaaS Product Cookbook", description: "From Soup to Nuts - Creating a Profitable SaaS Product as a Solo Developer in Days"}} />
            <Book />
        </Layout>
    )
}

export default BookPage
