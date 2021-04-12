import { Link } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/ThemeContext"
import Size from "../../../enums/Size"
import ThemeBodyClass from "../../../enums/ThemeBodyClass"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"
import { ThemeSwitcherContainer } from "../../utils/ThemeSwitcherContainer"
import { NavLogo } from "./NavLogo"

export function Nav() {
    const { themeBodyClass } = useContext(ThemeContext);

    const getOffsetArray = () => {
        switch (themeBodyClass) {
            // 5 color schemes
            case ThemeBodyClass.DARK_THEME:
            case ThemeBodyClass.LIGHT_THEME:
                return [0, 3, 0, 3, 0, 2]
            // 3 color schemes
            case ThemeBodyClass.OUTRUN_THEME:
            case ThemeBodyClass.BLACK_WHITE_THEME:
            default:
                return [0, 0, 0, 0, 1, 3]
        }
    }

    const offsetArray = getOffsetArray();

    return (
        <>
            <nav className="nav nav-large large-only">
                <NavLogo size={Size.LARGE} />
                <Link to="/courses">
                    {colorizeStringBySeparator(themeBodyClass, "Full Stack Courses", " ", offsetArray[0])}
                </Link>
                <Link to="/snippets">
                    {colorizeStringBySeparator(themeBodyClass, "Full Stack Snippets", " ", offsetArray[1])}
                </Link>
                <Link to="/goodies">
                    {colorizeStringBySeparator(themeBodyClass, "Full Stack Goodies", " ", offsetArray[2])}
                </Link>
                <Link to="/book">
                    {colorizeStringBySeparator(themeBodyClass, "Full Stack SaaS Book", " ", offsetArray[3])}
                </Link>
                <Link to="/stats">
                    {colorizeStringBySeparator(themeBodyClass, "Blog Stats", " ", offsetArray[4])}
                </Link>
                <Link to="/chris">
                    {colorizeStringBySeparator(themeBodyClass, "About Me", " ", offsetArray[5])}
                </Link>
                <ThemeSwitcherContainer size={Size.LARGE}/>
            </nav>
            <nav className="nav nav-medium medium-only">
                <NavLogo size={Size.MEDIUM} />
                <Link to="/courses">
                    {colorizeStringBySeparator(themeBodyClass, "Courses", " ")}
                </Link>
                <Link to="/snippets">
                    {colorizeStringBySeparator(themeBodyClass, "Snippets", " ", 1)}
                </Link>
                <Link to="/book">
                    {colorizeStringBySeparator(themeBodyClass, "Book", " ", 2)}
                </Link>
                <Link to="/goodies">
                    {colorizeStringBySeparator(themeBodyClass, "Goodies", " ", 3)}
                </Link>
                <Link to="/stats">
                    {colorizeStringBySeparator(themeBodyClass, "Stats", " ", 4)}
                </Link>
                <Link to="/chris">
                    {colorizeStringBySeparator(themeBodyClass, "Chris", " ", 5)}
                </Link>
                <ThemeSwitcherContainer size={Size.MEDIUM}/>
            </nav>
            <nav className="nav nav-small small-only">
                <NavLogo size={Size.SMALL} />
                <Link to="/courses">
                    {colorizeStringBySeparator(themeBodyClass, "Courses", " ")}
                </Link>
                <Link to="/snippets">
                    {colorizeStringBySeparator(themeBodyClass, "Snippets", " ", 1)}
                </Link>
                <Link to="/book">
                    {colorizeStringBySeparator(themeBodyClass, "Book", " ", 2)}
                </Link>
                <Link to="/goodies">
                    {colorizeStringBySeparator(themeBodyClass, "Goodies", " ", 3)}
                </Link>
                <ThemeSwitcherContainer size={Size.SMALL}/>
            </nav>
        </>
    )
}
