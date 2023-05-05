import * as React from "react"
import { useContext, useEffect, useState } from "react"
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
        "💯 make strong types great again! 💯",
        "👨‍💻👩‍💻 because somebody has to! 👨‍💻👩‍💻",
        "💻 recursively recurring 💻",
        "🐵 code monkey 🐵",
        "🚀 my terminals are burnin'! 🚀",
        "⏫ stacking the full stack ⏫",
        "💥 bashing the bash [~]$> 💥",
        "🍻 enjoy & cheers! 🍻",
        "🤔 what's a software? 🤔",
        "🤓 sir, best framework? 🤓",
        "☠️ framework X is better than Y! ☠️",
        "👓 RTFD - I won't do it for you 👓"
    ]

    const incrementMessage = () => {
        if (!cookies[Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY]) {
            setCookies(
                Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY,
                Math.floor(Math.random() * messagesOfTheDay.length),
                { path: "/" }
            )
        } else {
            // get next index in circular fashion (appearing to be random but guaranteed always new)
            const circularIndex =
                parseInt(
                    cookies[Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY]
                ) +
                    1 >=
                messagesOfTheDay.length
                    ? 0
                    : parseInt(
                          cookies[Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY]
                      ) + 1
            setCookies(
                Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY,
                circularIndex,
                {
                    path: "/",
                }
            )
        }
        setMessageOfTheDay(
            `© 2020 - ${currentYear} Full Stack Craft - ${
                messagesOfTheDay[
                    cookies[Constants.MESSAGE_OF_THE_DAY_INDEX_COOKIE_KEY]
                ]
            }`
        )
    }

    useEffect(() => {
        incrementMessage()
        // We want this effect to truly only run once on mount (when page renders)
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
