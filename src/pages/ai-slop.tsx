import * as React from "react"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const AiSlopPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <h1>AI Slop</h1>
            <div
                className="latest-post-container"
                style={{ marginTop: "1.5rem" }}
                onClick={() => {
                    window.location.href = "/the-new-yorker-profile.html"
                }}
            >
                <article>
                    <header>
                        <h3 style={{ marginTop: "1rem", fontWeight: 700 }}>
                            Chris in The New Yorker
                        </h3>
                    </header>
                    <section>
                        <p>
                            Chris channeling his inner delusion / self
                            affirmations to try and get to 100K, not just 10K
                            by August 2026.
                        </p>
                    </section>
                </article>
            </div>
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
