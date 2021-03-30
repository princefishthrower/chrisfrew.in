import { Link } from "gatsby"
import * as React from "react"
import Size from "../../enums/Size"
import { colorizeStringBySeparator } from "../../utils/colorizeStringBySeparator"
import { ThemeSwitcherContainer } from "../utils/ThemeSwitcherContainer"
import { NavLogo } from "./NavLogo"

export function Nav() {
    return (
        <>
            <nav className="nav nav-large large-only">
                <NavLogo size={Size.LARGE} />
                <Link to="/courses">
                    {colorizeStringBySeparator("Full Stack Courses", " ")}
                </Link>
                <Link to="/snippets">
                    {colorizeStringBySeparator("Full Stack Snippets", " ", 3)}
                </Link>
                <Link to="/goodies">
                    {colorizeStringBySeparator("Full Stack Goodies", " ", 1)}
                </Link>
                <Link to="/stats">
                    {colorizeStringBySeparator("Blog Stats", " ", 4)}
                </Link>
                <Link to="/chris">
                    {colorizeStringBySeparator("Chris", " ", 6)}
                </Link>
                <ThemeSwitcherContainer size={Size.LARGE}/>
            </nav>
            <nav className="nav nav-medium medium-only">
                <NavLogo size={Size.MEDIUM} />
                <Link to="/courses">
                    {colorizeStringBySeparator("Courses", " ")}
                </Link>
                <Link to="/snippets">
                    {colorizeStringBySeparator("Snippets", " ", 1)}
                </Link>
                <Link to="/goodies">
                    {colorizeStringBySeparator("Goodies", " ", 2)}
                </Link>
                <Link to="/stats">
                    {colorizeStringBySeparator("Stats", " ", 3)}
                </Link>
                <Link to="/chris">
                    {colorizeStringBySeparator("Chris", " ", 4)}
                </Link>
                <ThemeSwitcherContainer size={Size.MEDIUM}/>
            </nav>
            <nav className="nav nav-small small-only">
                <NavLogo size={Size.SMALL} />
                <Link to="/courses">
                    {colorizeStringBySeparator("Courses", " ")}
                </Link>
                <Link to="/snippets">
                    {colorizeStringBySeparator("Snippets", " ", 1)}
                </Link>
                <Link to="/goodies">
                    {colorizeStringBySeparator("Goodies", " ", 2)}
                </Link>
                <Link to="/stats">
                    {colorizeStringBySeparator("Stats", " ", 3)}
                </Link>
                <ThemeSwitcherContainer size={Size.SMALL}/>
            </nav>
        </>
    )
}
