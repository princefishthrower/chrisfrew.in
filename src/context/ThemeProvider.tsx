import React, { useState } from "react"
import { useCookies } from "react-cookie"
import Constants from "../constants/Constants";
import { ThemeContext } from "./ThemeContext"
export default function ThemeProvider(props) {
    const { children } = props;
    const [cookies] = useCookies([Constants.THEME_COOKIE_KEY])
    const [theme, setTheme] = useState(
        !cookies[Constants.THEME_COOKIE_KEY] ? Constants.DARK_MODE : cookies[Constants.THEME_COOKIE_KEY],
    )
    const value = { theme, setTheme }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}