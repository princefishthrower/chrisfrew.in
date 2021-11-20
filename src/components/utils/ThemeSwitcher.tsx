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
            setCookies(
                Constants.THEME_COOKIE_KEY,
                themeConfig[0].themeBodyClass,
                {
                    path: "/",
                }
            )
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

    const activeThemeIndex = getActiveThemeIndex()

    const switchTheme = () => {
        const nextIndex =
            activeThemeIndex === themeConfig.length - 1
                ? 0
                : activeThemeIndex + 1
        const nextTheme = themeConfig[nextIndex]
        setCookies(Constants.THEME_COOKIE_KEY, nextTheme.themeBodyClass, {
            path: "/",
        })
        setThemeBodyClass(nextTheme.themeBodyClass)
        activateRun()
    }

    const activeModeEmoji = themeConfig[activeThemeIndex].emoji

    if (size === Size.LARGE || size === Size.MEDIUM) {
        return (
            <div>
                <BodyClassName className={activeThemeBodyClass} />
                <label className="switch">
                    <div onClick={switchTheme}>
                        <svg
                            viewBox="0 0 25 25"
                            xmlns="http://www.w3.org/2000/svg"
                            height="25"
                            width="25"
                        >
                            <circle
                                className="switcher-circle"
                                cx="12.5"
                                cy="12.5"
                                r="11"
                                strokeWidth="2"
                                fill="red"
                                stroke="white"
                            />
                            <text
                                text-anchor="middle"
                                x="50%"
                                y="50%"
                                dy=".35em"
                                fontSize={13}
                            >
                                {activeModeEmoji}
                            </text>
                        </svg>
                    </div>
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
