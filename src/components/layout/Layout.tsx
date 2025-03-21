import React, { PropsWithChildren } from "react"
import { Nav } from "./Nav/Nav"
import { Footer } from "./Footer/Footer"
import { Header } from "./Header/Header"
import { CookiesProvider } from "react-cookie"
import { LaptopSubscriber } from "./LaptopSubscriber/LaptopSubscriber"
import { AnimationType, usePleaseStay } from "react-use-please-stay"
import BodyClassName from "react-body-classname"
import ThemeBodyClass from "../../enums/ThemeBodyClass"
import { PageProps } from "gatsby"

export interface ILayoutProps {
    location: PageProps["location"]
}

export default function Layout(props: PropsWithChildren<ILayoutProps>) {
    const { location, children } = props
    usePleaseStay({
        titles: [
            "Chris'",
            "Chris' Full",
            "Chris' Full Stack",
            "Chris' Full Stack Blog",
        ],
        interval: 1000,
        animationType: AnimationType.LOOP,
        faviconURIs: [
            "https://chrisfrew.in/images/favicon-left.png",
            "https://chrisfrew.in/images/favicon-down.png",
            "https://chrisfrew.in/images/favicon-right.png",
        ],
        alwaysRunAnimations: false,
    })
    
    return (
        <>
            <BodyClassName className={ThemeBodyClass.DARK_THEME} />
            <CookiesProvider>
                <Nav />
                <div className="page-wrapper">
                    <Header location={location} />
                    <main>{children}</main>
                </div>
                <Footer />
                <LaptopSubscriber />
            </CookiesProvider>
        </>
    )
}
