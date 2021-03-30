import React, { useContext, useEffect } from "react"
import BodyClassName from "react-body-classname"
import { useCookies } from "react-cookie"
import Constants from "../../constants/Constants"
import { ThemeContext } from "../../context/ThemeContext"
import Size from "../../enums/Size"

export interface ISwitcherProps {
    activateRun: () => void
    size: Size
}

export default function ThemeSwitcher(props: ISwitcherProps) {
    const { size, activateRun } = props
    const [cookies, setCookies] = useCookies([Constants.THEME_COOKIE_KEY])
    const { setTheme } = useContext(ThemeContext)

    const DARK_TEXT = "Dark"
    const DARK_EMOJI = "👻"

    const LIGHT_TEXT = "Light"
    const LIGHT_EMOJI = "☀️"
        
    // if cookies not set, set as default to Constants.DARK_MODE
    useEffect(() => {
        if (!cookies[Constants.THEME_COOKIE_KEY]) {
            setCookies(Constants.THEME_COOKIE_KEY, Constants.DARK_MODE, {
                path: "/",
            })
        }
    }, [cookies, setCookies])

    // cookies still not set, render nothing
    if (!cookies[Constants.THEME_COOKIE_KEY]) {
        return <></>
    }

    const activeTheme = cookies[Constants.THEME_COOKIE_KEY]

    const switchTheme = () => {
        if (activeTheme === Constants.DARK_MODE) {
            setCookies(Constants.THEME_COOKIE_KEY, Constants.LIGHT_MODE, {
                path: "/",
            })
            setTheme(Constants.LIGHT_MODE)
        } else {
            setCookies(Constants.THEME_COOKIE_KEY, Constants.DARK_MODE, {
                path: "/",
            })
            setTheme(Constants.DARK_MODE)
        }
        activateRun()
    }

    const activeModeText =
        activeTheme === Constants.DARK_MODE ? DARK_TEXT : LIGHT_TEXT
    const activeModeEmoji =
        activeTheme === Constants.DARK_MODE ? DARK_EMOJI : LIGHT_EMOJI

    if (size === Size.LARGE || size === Size.MEDIUM) {
        return (
            <div className="switch-container">
                <BodyClassName className={activeTheme} />
                <label className="switch">
                    <input
                        type="checkbox"
                        onChange={switchTheme}
                        checked={
                            activeTheme === Constants.DARK_MODE ? false : true
                        }
                    />
                    <span className="slider round" />
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
    const smallText = `${activeModeEmoji}`;
    return (
        <>
            <BodyClassName className={activeTheme} />
            <span className="emoji" onClick={switchTheme}>
                {smallText}
            </span>
        </>
    )
}
