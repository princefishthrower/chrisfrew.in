import React from "react"
import { Snippets } from "../components/pages/snippets/Snippets"
import SEO from "../components/utils/SEO"
import BodyClassName from "react-body-classname"
import ThemeBodyClass from "../enums/ThemeBodyClass"

// Body class name imported directly here since we always want the light theme for PDF!
const SnippetsPage = () => {
    return (
        <>
            <BodyClassName className={ThemeBodyClass.LIGHT_THEME} />
            <Snippets pdfMode={true} />
        </>
    )
}

export const Head = () => (
    <SEO
        title="Full Stack Snippets - PDF Mode"
        description="Chris' Full Stack Snippets as a PDF."
    />
)

export default SnippetsPage
