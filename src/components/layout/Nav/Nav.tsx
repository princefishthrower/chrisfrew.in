
import * as React from "react"
import Size from "../../../enums/Size"
import { NavLogo } from "./NavLogo"
import { slide as Menu } from "react-burger-menu"
import { NavLinks } from "./NavLinks"

export function Nav() {
    return (
        <>
            <nav className="nav nav-large large-only">
                <NavLogo size={Size.LARGE} />
                <NavLinks />
            </nav>
            <nav className="nav nav-medium medium-only">
                <NavLogo size={Size.MEDIUM} />
                <NavLinks />
            </nav>
            <div className="small-only">
                <Menu>
                    <NavLogo size={Size.MEDIUM} />
                    <NavLinks />
                </Menu>
            </div>
        </>
    )
}
