import React, { useState } from "react"
import { useCookies } from "react-cookie"
import { themeCookieKey, DARK_MODE } from "../constants/constants"
import { ThemeContext } from "./ThemeContext"
export default function ThemeProvider(props) {
    const { children } = props;
    const [cookies] = useCookies([themeCookieKey])
    const [theme, setTheme] = useState(
        !cookies[themeCookieKey] ? DARK_MODE : cookies[themeCookieKey],
    )
    const value = { theme, setTheme }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}