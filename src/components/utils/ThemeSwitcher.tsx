import React, { useContext, useEffect } from "react"
import BodyClassName from "react-body-classname"
import { useCookies } from "react-cookie"
import { themeConfig } from "../../config/ThemeConfig"
import Constants from "../../constants/Constants"
import { ThemeContext } from "../../context/theme/ThemeContext"
import Size from "../../enums/Size"

export interface ISwitcherProps {
    activateRun: () => void
    size: Size
}

export default function ThemeSwitcher(props: ISwitcherProps) {
    const { size, activateRun } = props
    const [cookies, setCookies] = useCookies([Constants.THEME_COOKIE_KEY])
    const { setThemeBodyClass } = useContext(ThemeContext)

    // if cookies not set, set as default to dark theme
    useEffect(() => {
        if (!cookies[Constants.THEME_COOKIE_KEY]) {
            setCookies(Constants.THEME_COOKIE_KEY, themeConfig[0].themeBodyClass, {
                path: "/",
            })
        }
    }, [cookies, setCookies])

    
    // cookies still not set, render nothing
    if (!cookies[Constants.THEME_COOKIE_KEY]) {
        return <></>
    }

    const activeThemeBodyClass = cookies[Constants.THEME_COOKIE_KEY]

    const getActiveThemeIndex = () => {
        const tryIndex = themeConfig
        .map((x) => x.themeBodyClass)
        .indexOf(activeThemeBodyClass)
        
        return tryIndex === -1 ? 0 : tryIndex
    }

    const activeThemeIndex = getActiveThemeIndex();

    const switchTheme = () => {
        const nextIndex =
            activeThemeIndex === themeConfig.length - 1 ? 0 : activeThemeIndex + 1
        const nextTheme = themeConfig[nextIndex]
        setCookies(Constants.THEME_COOKIE_KEY, nextTheme.themeBodyClass, {
            path: "/",
        })
        setThemeBodyClass(nextTheme.themeBodyClass)
        activateRun()
    }

    const activeModeText = themeConfig[activeThemeIndex].label
    const activeModeEmoji = themeConfig[activeThemeIndex].emoji

    if (size === Size.LARGE || size === Size.MEDIUM) {
        return (
            <div>
                <BodyClassName className={activeThemeBodyClass} />
                <label className="switch">
                    <svg
                        onClick={switchTheme}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        width="20"
                    >
                        <circle
                            className="switcher-circle"
                            cx="10"
                            cy="10"
                            r="9"
                            strokeWidth="2"
                            fill="red"
                            stroke="white"
                        />
                    </svg>
                    <span className="switch-text emoji-fix">
                        {activeModeEmoji}
                    </span>
                    <span className="switch-text">
                        {activeModeText} Theme Active
                    </span>
                </label>
            </div>
        )
    }
    // small style - show emoji only :)
    const smallText = `${activeModeEmoji}`
    return (
        <>
            <BodyClassName className={activeThemeBodyClass} />
            <span className="emoji" onClick={switchTheme}>
                {smallText}
            </span>
        </>
    )
}
