import * as React from "react"
import { useContext, useEffect, useState, useCallback } from "react"
import { useCookies } from "react-cookie"
import Constants from "../../../constants/Constants"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"

export function MessageOfTheDay() {
    const [messageOfTheDay, setMessageOfTheDay] = useState("")
    const [cookies, setCookies] = useCookies([
        Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY,
    ])
    const { themeBodyClass } = useContext(ThemeContext)

    const currentYear = new Date().getFullYear()

    const messagesOfTheDay = [
        // "💯 make strong types great again! 💯",
        // "👨‍💻👩‍💻 because somebody has to! 👨‍💻👩‍💻",
        "💻 recursively recurring 💻",
        // "🐵 code monkey 🐵",
        // "🚀 my terminals are burnin'! 🚀",
        "⏫ stacking the full stack ⏫",
        "💥 bashing the bash [~]$> 💥",
        "🍻 enjoy & cheers! 🍻",
        // "🤔 what's a software? 🤔",
        // "🤓 sir, best framework? 🤓",
        // "☠️ framework X is better than Y! ☠️",
        // "👓 RTFD - I won't do it for you 👓",
        // `🤖 ${currentYear} and AI still hasn't taken my job! 🤖`,
        "✅ ahh... no type errors! it has to work! ✅"
    ]

    const getMessageIndex = useCallback(() => {
        const currentIndex = cookies[Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY]
        if (!currentIndex) {
            const newIndex = Math.floor(Math.random() * messagesOfTheDay.length)
            setCookies(
                Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY,
                newIndex,
                { path: "/" }
            )
            return newIndex
        }
        
        const nextIndex = parseInt(currentIndex) + 1 >= messagesOfTheDay.length
            ? 0
            : parseInt(currentIndex) + 1
            
        return nextIndex
    }, [cookies, setCookies, messagesOfTheDay.length])

    const incrementMessage = useCallback(() => {
        const messageIndex = getMessageIndex()
        setCookies(
            Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY,
            messageIndex,
            { path: "/" }
        )
        
        const message = `© 2020 - ${currentYear} Full Stack Craft - ${messagesOfTheDay[messageIndex]}`
        setMessageOfTheDay(message)
    }, [getMessageIndex, setCookies, currentYear, messagesOfTheDay])

    useEffect(() => {
        incrementMessage()
    }, [])

    return (
        <h3
            onClick={incrementMessage}
            style={{
                marginBottom: 0,
                marginTop: 0,
                position: `relative`,
                textAlign: `center`,
                zIndex: 10,
                cursor: "pointer",
            }}
            className="message-of-the-day"
        >
            <span className="monokaiRedFont">{"-"}</span>
            <span className="monokaiOrangeFont">{"~"}</span>
            <span className="monokaiBlueFont">{"{"}</span>
            <span className="monokaiGreenFont">{"/"}</span>
            <span className="monokaiYellowFont">{"* "}</span>
            {colorizeStringBySeparator(
                themeBodyClass,
                messageOfTheDay,
                "",
                0,
                true
            )}
            <span className="monokaiYellowFont">{" *"}</span>
            <span className="monokaiGreenFont">{"/"}</span>
            <span className="monokaiBlueFont">{"}"}</span>
            <span className="monokaiOrangeFont">{"~"}</span>
            <span className="monokaiRedFont">{"-"}</span>
        </h3>
    )
}
