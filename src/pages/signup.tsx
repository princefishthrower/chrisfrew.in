import * as React from "react"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"
import { Signup } from "../components/pages/signup/Signup"

const SignupPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <Signup />
        </Layout>
    )
}

export const Head = () => (
    <SEO
        title="Blog Signup"
        description="All blog Signup."
    />
)

export default SignupPage