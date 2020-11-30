import React, { useContext, useEffect } from "react"
import BodyClassName from "react-body-classname"
import { useCookies } from "react-cookie"
import { DARK_MODE, LIGHT_MODE, themeCookieKey } from "../constants/constants";
import { ThemeContext } from "../context/ThemeContext";

const DARK_TEXT = "Dark"
const DARK_EMOJI = "👻"

const LIGHT_TEXT = "Light"
const LIGHT_EMOJI = "☀️"

export default function Switcher(props) {
    const { activateRun } = props
    const [cookies, setCookies] = useCookies([themeCookieKey])
    const { setTheme } = useContext(ThemeContext)

    // if cookies not set, set as default to DARK_MODE
    useEffect(() => {
        if (!cookies[themeCookieKey]) {
            setCookies(themeCookieKey, DARK_MODE, { path: "/" })
        }
    }, [cookies, setCookies])

    // cookies still not set, render nothing
    if (!cookies[themeCookieKey]) {
        return <></>
    }

    const activeTheme = cookies[themeCookieKey]

    const handleInputChange = event => {
        // add these nice transition properties to the html and body tags (we can't put it in the CSS directly because it will flash from white to black)
        document.body.style.transition = "color 1s, background-color 1s"
        if (event.target.checked) {
            setCookies(themeCookieKey, LIGHT_MODE, { path: "/" })
            setTheme(LIGHT_MODE)
        } else {
            setCookies(themeCookieKey, DARK_MODE, { path: "/" })
            setTheme(DARK_MODE)
        }
        activateRun()
    }

    const activeModeText = activeTheme === DARK_MODE ? DARK_TEXT : LIGHT_TEXT
    const activeModeEmoji = activeTheme === DARK_MODE ? DARK_EMOJI : LIGHT_EMOJI
    
    return (
        <>
            <div className="switch-container">
                <BodyClassName className={activeTheme} />
                <label className="switch">
                    <input
                        type="checkbox"
                        onChange={handleInputChange}
                        checked={activeTheme === DARK_MODE ? false : true}
                    />
                    <span className="slider round" />
                    <span className="switch-text emoji-fix">
                        {activeModeEmoji}
                    </span>
                    <span className="switch-text">
                        {activeModeText} mode active
                    </span>
                </label>
            </div>
        </>
    )
}
