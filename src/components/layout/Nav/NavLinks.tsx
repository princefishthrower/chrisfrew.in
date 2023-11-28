import { Link } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import ThemeBodyClass from "../../../enums/ThemeBodyClass"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"

export function NavLinks() {
    const { themeBodyClass } = useContext(ThemeContext)

    const getOffsetArray = () => {
        switch (themeBodyClass) {
            // 5 color schemes
            case ThemeBodyClass.DARK_THEME:
            case ThemeBodyClass.LIGHT_THEME:
                return [0, 1, 2, 3, 4, 5]
            // 3 color schemes
            case ThemeBodyClass.OUTRUN_THEME:
            case ThemeBodyClass.BLACK_WHITE_THEME:
            default:
                return [0, 0, 0, 0, 1, 3]
        }
    }

    const offsetArray = getOffsetArray()
    return (
        <>
            <Link style={{fontWeight: "bold"}} to="/posts">
                {colorizeStringBySeparator(
                    themeBodyClass,
                    "Posts",
                    " ",
                    offsetArray[0]
                )}
            </Link>
            <Link style={{fontWeight: "bold"}} to="/courses">
                {colorizeStringBySeparator(
                    themeBodyClass,
                    "Courses",
                    " ",
                    offsetArray[1]
                )}
            </Link>
            <Link style={{fontWeight: "bold"}} to="/snippets">
                {colorizeStringBySeparator(
                    themeBodyClass,
                    "Snippets",
                    " ",
                    offsetArray[2]
                )}
            </Link>
            <Link style={{fontWeight: "bold"}} to="/goodies">
                {colorizeStringBySeparator(
                    themeBodyClass,
                    "Goodies",
                    " ",
                    offsetArray[3]
                )}
            </Link>
            <Link style={{fontWeight: "bold"}} to="/books">
                {colorizeStringBySeparator(
                    themeBodyClass,
                    "Books",
                    " ",
                    offsetArray[4]
                )}
            </Link>
            <Link style={{fontWeight: "bold"}} to="/stats">
                {colorizeStringBySeparator(
                    themeBodyClass,
                    "Stats",
                    " ",
                    offsetArray[5]
                )}
            </Link>
            <Link style={{fontWeight: "bold"}} to="/podcasts">
                {colorizeStringBySeparator(
                    themeBodyClass,
                    "Podcasts",
                    " ",
                    offsetArray[0]
                )}
            </Link>
            <Link style={{fontWeight: "bold"}} to="/chris">
                {colorizeStringBySeparator(
                    themeBodyClass,
                    "About",
                    " ",
                    offsetArray[1]
                )}
            </Link>
        </>
    )
}
