import React from "react"
import { Courses } from "../components/pages/courses/Courses"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"
import type { PageProps } from "gatsby"

const CoursesPage = ({ location }: PageProps) => {
    return (
        <Layout location={location}>
            <SEO title="Full Stack Courses" description="Courses for software developers who want to launch their skills beyond the basics."/>
            <Courses />
        </Layout>
    )
}

export default CoursesPage
