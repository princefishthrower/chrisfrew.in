import * as React from "react"
import Layout from "../components/layout/Layout"
import { Posts } from "../components/pages/posts/Posts"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const PostsPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <Posts />
        </Layout>
    )
}

export const Head = () => (
    <SEO
        title="Blog Posts"
        description="All blog posts."
    />
)

export default PostsPage