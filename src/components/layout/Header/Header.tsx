import * as React from "react"
import { HomePageTitle } from "./HomePageTitle"

export function Header({ location }) {
    return location.pathname === "/" ? (
        <>
            <header>
                <HomePageTitle />
            </header>
        </>
    ) : (
        <></>
    )
}
