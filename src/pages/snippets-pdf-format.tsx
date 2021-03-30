import React from "react"
import { Snippets } from "../components/pages/snippets/Snippets"
import SEO from "../components/utils/SEO"
import BodyClassName from "react-body-classname"
import Constants from "../constants/Constants"

const SnippetsPage = () => {
    return (
        <>
            <BodyClassName className={Constants.LIGHT_MODE} />
            <SEO title="Full Stack Snippets - PDF Mode" />
            <Snippets pdfMode={true} />
        </>
    )
}

export default SnippetsPage
