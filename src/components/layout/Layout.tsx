import React from "react"
import { Nav } from "./Nav"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { CookiesProvider } from "react-cookie"

export default function Layout(props) {
    const { children, location } = props
    return (
        <CookiesProvider>
            <Nav />
            <div className="page-wrapper">
                <Header location={location} />
                <main>{children}</main>
            </div>
            <Footer />
        </CookiesProvider>
    )
}
