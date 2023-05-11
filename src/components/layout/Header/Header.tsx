import * as React from "react"
import { HomePageTitle } from "./HomePageTitle"
import { PageProps } from "gatsby"

export interface IHeaderProps {
    location: PageProps["location"]
}

export function Header(props: IHeaderProps) {
    const { location } = props
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
