import * as React from "react"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const AiSlopPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <h1>AI Slop</h1>
            <article style={{ marginTop: "1.5rem" }}>
                <a
                    href="/the-new-yorker-profile.html"
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                    }}
                >
                    <h2>Chris in The New Yorker</h2>
                    <p>
                        Chris channeling his inner delusion / self affirmations
                        to try and get to 100K, not just 10K by August 2026.
                    </p>
                </a>
            </article>
        </Layout>
    )
}

export const Head = () => (
    <SEO
        title="AI Slop"
        description="AI Slop collection."
    />
)

export default AiSlopPage
