import React from "react"
import { Nav } from "./Nav/Nav"
import { Footer } from "./Footer/Footer"
import { Header } from "./Header/Header"
import { CookiesProvider } from "react-cookie"
import EmailForm from "../utils/EmailForm"

export default function Layout(props) {
    const { children, location } = props
    return (
        <CookiesProvider>
            <Nav />
            <div className="page-wrapper">
                <Header location={location} />
                <main>{children}</main>
            </div>
            <EmailForm/>
            <Footer />
        </CookiesProvider>
    )
}
