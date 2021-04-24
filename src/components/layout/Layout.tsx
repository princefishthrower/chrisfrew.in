import React from "react"
import { Nav } from "./Nav/Nav"
import { Footer } from "./Footer/Footer"
import { Header } from "./Header/Header"
import { CookiesProvider } from "react-cookie"
import EmailForm from "../utils/EmailForm"
import { LaptopSubscriber } from "./LaptopSubscriber/LaptopSubscriber"
import { AnimationType, usePleaseStay } from "react-use-please-stay"

export default function Layout(props) {
    const { children, location } = props
    usePleaseStay({
        titles: [
            "Chris'",
            "Chris' Full",
            "Chris' Full Stack",
            "Chris' Full Stack Blog",
        ],
        interval: 1000,
        animationType: AnimationType.LOOP,
        faviconLinks: [
            "https://coffee-app.sfo2.cdn.digitaloceanspaces.com/chrisfrew.in/maskable_icon_left.png",
            "https://coffee-app.sfo2.cdn.digitaloceanspaces.com/chrisfrew.in/maskable_icon_down.png",
            "https://coffee-app.sfo2.cdn.digitaloceanspaces.com/chrisfrew.in/maskable_icon_right.png",
        ],
        alwaysRunAnimations: false
    })
    return (
        <CookiesProvider>
            <Nav />
            <div className="page-wrapper">
                <Header location={location} />
                <main>{children}</main>
            </div>
            <EmailForm />
            <Footer />
            <LaptopSubscriber />
        </CookiesProvider>
    )
}
