import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import ConfettiContainer from "../components/utils/ConfettiContainer"
import type { PageProps } from "gatsby"
import { PageData } from "../types/PageData"

export default function NotFoundPage(props: PageProps<PageData>) {
    const { location } = props
    return (
        <>
            <Layout
                location={location}
            >
                <>
                <h1 style={{ textAlign: "center" }}>Not Found!</h1>
                <h2 style={{ textAlign: "center" }}>
                    Yay! You get some confetti!
                </h2>
                <h3 style={{ textAlign: "center" }}>
                    But it's actually not so nice, eh?
                </h3>
                <p style={{ textAlign: "center" }}>
                    <b>
                        <Link style={{ textAlign: "center" }} to="/">
                            Back Home
                        </Link>
                    </b>
                </p>
                </>
            </Layout>
            <ConfettiContainer />
        </>
    )
}

export const Head = () => (
    <SEO
        title="Not Found"
        description="The site you are requesting on Chris' Full Stack Blog was not found."
    />
)

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
                description
            }
        }
    }
`
