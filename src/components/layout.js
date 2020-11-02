import React, { useState } from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "../utils/typography"
import Switcher from "../components/switcher"
import ConfettiContainer from "./confetti-container"
import monetizedLoop from "../images/monetized_loop.svg"
import { CookiesProvider } from "react-cookie"

const phraseOfTheDay = [
    "💯 make strong types great again 💯",
    "👨‍💻👩‍💻 because we have to 👨‍💻👩‍💻",
    "💻 recursive recursion 💻",
    "🐵 code monkey 🐵",
    "🚀 my terminals are burnin'! 🚀",
    "🍻 enjoy & cheers! 🍻",
    "🤔 whats a software? 🤔",
    "🤓 sir, best framework? 🤓",
]
export default function Layout(props) {
    const [shouldRun, setShouldRun] = useState(false)
    const { location, title, description, children } = props
    const rootPath = `${__PATH_PREFIX__}/`
    let header
    if (location.pathname === rootPath) {
        header = (
            <>
                <h3
                    className="monokaiRedFont"
                    style={{
                        ...scale(0.25),
                        marginBottom: rhythm(0.25),
                        marginTop: 0,
                        position: `relative`,
                        zIndex: 10,
                        textAlign: `center`,
                    }}
                >
                    chrisfrew.in <span className="switcherFont">/</span>{" "}
                    chrisfrewin.com
                </h3>
                <h1
                    style={{
                        ...scale(1.5),
                        marginBottom: 0,
                        marginTop: 0,
                        position: `relative`,
                        zIndex: 10,
                        textAlign: `center`,
                    }}
                >
                    <Link
                        style={{
                            boxShadow: `none`,
                            textDecoration: `none`,
                            color: `inherit`,
                            position: `relative`,
                            zIndex: 10,
                        }}
                        to={`/`}
                    >
                        {title}
                    </Link>
                </h1>

                <h2
                    style={{
                        ...scale(0.5),
                        marginBottom: 0,
                        marginTop: 0,
                        position: `relative`,
                        textAlign: `center`,
                        zIndex: 10,
                    }}
                >
                    {description}
                </h2>
                <h3
                    style={{
                        ...scale(0.025),
                        marginBottom: 0,
                        marginTop: 0,
                        position: `relative`,
                        textAlign: `center`,
                        zIndex: 10,
                    }}
                    className="phrase-of-the-day"
                >
                    <span className="monokaiBlueFont">{"~{/"}</span>
                    <span className="green-text">{"* "}</span>
                    <span className="monokaiRedFont">{
                        phraseOfTheDay[
                            Math.floor(Math.random() * phraseOfTheDay.length)
                        ]
                    }
                    </span>
                    <span className="green-text">{" *"}</span>
                    <span className="monokaiBlueFont">{"/}~"}</span>
                </h3>
            </>
        )
    } else {
        header = (
            <>
                <h3
                    style={{
                        fontFamily: `Montserrat, sans-serif`,
                        marginTop: 0,
                    }}
                >
                    <Link
                        style={{
                            boxShadow: `none`,
                            textDecoration: `none`,
                            color: `inherit`,
                        }}
                        to={`/`}
                    >
                        {title}
                    </Link>
                </h3>
                <h4
                    style={{
                        ...scale(0.5),
                        marginBottom: rhythm(0.5),
                        marginTop: 0,
                        position: `relative`,
                        zIndex: 10,
                    }}
                >
                    {description}
                </h4>
            </>
        )
    }

    return (
        <>
            {shouldRun && (
                <ConfettiContainer
                    onAnimationComplete={() => setShouldRun(false)}
                />
            )}
            <div
                style={{
                    marginLeft: `auto`,
                    marginRight: `auto`,
                    maxWidth: rhythm(24),
                    padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
                    paddingBottom: 0,
                }}
            >
                <header>{header}</header>
                <CookiesProvider>
                    <Switcher activateRun={() => setShouldRun(true)} />
                </CookiesProvider>
                <main>{children}</main>
                <footer>
                    <div>
                        <span>Really like the blog? You can support it:</span>
                        <br />
                        <style
                            dangerouslySetInnerHTML={{
                                __html:
                                    ".bmc-button img{width: 27px !important;margin-bottom: 3px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{line-height: 36px !important;height:37px !important;text-decoration: none !important;display:inline-block !important;color:#000000 !important;background-color:#27DEA7 !important;border-radius: 3px !important;border: 1px solid transparent !important;padding: 1px 9px !important;font-size: 23px !important;letter-spacing: 0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family: cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#000000 !important;}",
                            }}
                        />
                        <a
                            className="bmc-button"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.buymeacoffee.com/chrisfrewin"
                        >
                            <img
                                src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
                                alt="Buy me a cappucino"
                            />
                            <span style={{ marginLeft: 5 }}>
                                Buy me a cappucino
                            </span>
                        </a>
                    </div>
                    <div>
                        <span>
                            This blog is Web-Monetized by{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://coil.com/about"
                                title="What's Coil?"
                            >
                                Coil
                            </a>
                        </span>
                        <br />

                        <img
                            src={monetizedLoop}
                            alt="Buy me a cappucino"
                            width="171"
                            height="22"
                            style={{
                                marginTop: "0.5rem",
                                marginBottom: "0",
                            }}
                        />
                    </div>
                    <div>
                        © 2016 - {new Date().getFullYear()}
                        &nbsp;
                        <a
                            href="https://fullstackcraft.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Full Stack Craft
                        </a>
                    </div>
                </footer>
            </div>
        </>
    )
}
