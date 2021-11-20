import * as React from "react"
import Layout from "../components/layout/Layout"
import { Posts } from "../components/pages/posts/Posts"
import SEO from "../components/utils/SEO"

const PostsPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO frontmatter={{title: "Blog Posts", description: "All blog posts."}}/>
            <Posts />
        </Layout>
    )
}

export default PostsPage