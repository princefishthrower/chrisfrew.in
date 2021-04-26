import React from "react"
import Layout from "../components/layout/Layout"
import { Book } from "../components/pages/book/Book"
import SEO from "../components/utils/SEO"

const BookPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO />
            <Book />
        </Layout>
    )
}

export default BookPage
