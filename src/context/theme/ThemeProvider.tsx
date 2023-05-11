import React, { useState, PropsWithChildren } from "react"
import { useCookies } from "react-cookie"
import { themeConfig } from "../../config/ThemeConfig";
import Constants from "../../constants/Constants";
import { ThemeContext } from "./ThemeContext"
export default function ThemeProvider(props: PropsWithChildren<{}>) {
    const { children } = props;
    const [cookies] = useCookies([Constants.THEME_COOKIE_KEY])
    const [themeBodyClass, setThemeBodyClass] = useState(
        !cookies[Constants.THEME_COOKIE_KEY] ? themeConfig[0].themeBodyClass : cookies[Constants.THEME_COOKIE_KEY],
    )
    const value = { themeBodyClass, setThemeBodyClass }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}