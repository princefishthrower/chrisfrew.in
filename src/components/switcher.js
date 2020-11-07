import React, { useEffect } from "react"
import BodyClassName from "react-body-classname"
import { useCookies } from "react-cookie"

const DARK_MODE = "dark-mode"
const DARK_TEXT = "Dark"
const DARK_EMOJI = "👻"

const LIGHT_MODE = "light-mode"
const LIGHT_TEXT = "Light"
const LIGHT_EMOJI = "☀️"
const cssId = "prism-styles"
const themeCookieKey = "user-theme-preference"

export default function Switcher(props) {
    const { activateRun } = props
    const [cookies, setCookies] = useCookies([themeCookieKey])

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

    // set body css according to theme
    if (typeof document !== "undefined") {
        const href =
            activeTheme === DARK_MODE
                ? "https://cdn.jsdelivr.net/npm/prism-themes@1.4.0/themes/prism-xonokai.css"
                : "https://cdn.jsdelivr.net/npm/prismjs@1.20.0/themes/prism-coy.css"
        if (!document.getElementById(cssId)) {
            const head = document.getElementsByTagName("head")[0]
            const link = document.createElement("link")
            link.id = cssId
            link.async = true
            link.rel = "stylesheet"
            link.type = "text/css"
            link.href = href
            link.media = "all"
            head.appendChild(link)
        } else {
            const link = document.getElementById(cssId)
            link.href = href
        }
    }

    const handleInputChange = event => {
        // add these nice transition properties to the html and body tags (we can't put it in the CSS directly because it will flash from white to black)
        document.body.style.transition = "color 1s, background-color 1s"
        if (event.target.checked) {
            setCookies(themeCookieKey, LIGHT_MODE, { path: "/" })
        } else {
            setCookies(themeCookieKey, DARK_MODE, { path: "/" })
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
