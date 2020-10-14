import React, { useState, useEffect } from "react"
import BodyClassName from "react-body-classname"
import { useCookies } from "react-cookie"

const DARK_MODE = "dark-mode"
const DARK_TEXT = "Dark"
const DARK_EMOJI = "👻"

const LIGHT_MODE = "light-mode"
const LIGHT_TEXT = "Light"
const LIGHT_EMOJI = "☀️"
const cssId = "prism-styles"

export default function Switcher(props) {
    const { activateRun } = props;
    const [activeMode, setActiveMode] = useState("dark-mode")
    const [cookies, setCookies] = useCookies(["user-theme-preference"])
    useEffect(() => {
        // already set at some point by the user
        if (cookies) {
            setActiveMode(cookies["user-theme-preference"] === DARK_MODE ? DARK_MODE : LIGHT_MODE)
            // default value = dark mode :)
        } else {
            setActiveMode(DARK_MODE)
        }
    }, [cookies])
    
    const setStyleLink = mode => {
        if (typeof document !== "undefined") {
            const href =
                mode === DARK_MODE
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
    }

    const handleInputChange = event => {
        // add these nice transition properties to the html and body tags (we can't put it in the CSS directly because it will flash from white to black)
        document.body.style.transition = "color 1s, background-color 1s"
        if (event.target.checked) {
            setActiveMode(LIGHT_MODE)
            setCookies("user-theme-preference", LIGHT_MODE, { path: "/" })
            setStyleLink(LIGHT_MODE)
        } else {
            setActiveMode(DARK_MODE)
            setCookies("user-theme-preference", DARK_MODE, { path: "/" })
            setStyleLink(DARK_MODE)
        }
        activateRun();
    }
    
    const activeModeText = activeMode === DARK_MODE ? DARK_TEXT : LIGHT_TEXT
    const activeModeEmoji = activeMode === DARK_MODE ? DARK_EMOJI : LIGHT_EMOJI
    return (
        <>
            <div className="switch-container">
                <BodyClassName className={activeMode} />
                <label className="switch">
                    <input
                        type="checkbox"
                        onChange={handleInputChange}
                        checked={activeMode === DARK_MODE ? false : true}
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
