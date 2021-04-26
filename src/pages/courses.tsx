import React from "react"
import { Courses } from "../components/pages/courses/Courses"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"

const CoursesPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO frontmatter={{title: "Full Stack Courses", description: "Courses for software developers who want to launch their skills beyond the basics."}}/>
            <Courses />
        </Layout>
    )
}

export default CoursesPage
