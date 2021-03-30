import React from "react"
import { Courses } from "../components/pages/courses/Courses"
import Layout from "../components/layout/Layout"
import SEO from "../components/utils/SEO"

const CoursesPage = ({ location }) => {
    return (
        <Layout location={location}>
            <SEO title="Full Stack Courses" />
            <Courses />
        </Layout>
    )
}

export default CoursesPage
