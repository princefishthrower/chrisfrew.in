import React, { useState, useContext } from "react"
import Highlight, { defaultProps } from "prism-react-renderer"
import github from "prism-react-renderer/themes/github"
import nightOwl from "prism-react-renderer/themes/dracula"
import Confetti from "react-dom-confetti"
import { ThemeContext } from "../../context/ThemeContext"
import Constants from "../../constants/Constants"

// TODO: Add support for prism-coy and xonokai from prismJS - use the themefromvscode maybe

const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: Constants.COLORS,
}

const copyToClipboard = (str) => {
    const el = document.createElement("textarea")
    el.value = str
    el.setAttribute("readonly", "")
    el.style.position = "absolute"
    el.style.left = "-9999px"
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
}

const Wrapper = (props) => <div style={{ position: "relative" }} {...props} />

const ConfettiWrapper = (props) => (
    <div style={{ position: "absolute", top: 0, right: 0 }} {...props} />
)

const Button = (props) => (
    <button aria-label="Copy" className="code-copy-button" {...props} />
)

export interface IPreProps {
    codeString: string
    language: string
    pdfMode?: boolean
}

export const Pre = (props: IPreProps) => {
    const { codeString, language, pdfMode } = props
    const [isCopied, setIsCopied] = useState(false)
    const { theme } = useContext(ThemeContext)

    const resolveTheme = () => {
        if (pdfMode) {
            return github
        }
        return theme === Constants.DARK_MODE ? nightOwl : github
    }

    const dynamicTheme = resolveTheme();

    return (
        <Wrapper>
            {!pdfMode && <div className="code-copy-button-wrapper">
                <Button
                    onClick={() => {
                        copyToClipboard(codeString)
                        setIsCopied(true)
                        setTimeout(() => setIsCopied(false), 3000)
                    }}
                >
                    {isCopied ? (
                        <div className="gatsby-code-button">
                            <span role="img" aria-label="confetti">
                                🎉
                            </span>{" "}
                            Copied!
                        </div>
                    ) : (
                        <div className="gatsby-code-button">
                            <svg
                                className="gatsby-code-button-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                                <path d="M16 1H2v16h2V3h12V1zm-1 4l6 6v12H6V5h9zm-1 7h5.5L14 6.5V12z"></path>
                            </svg>
                        </div>
                    )}
                </Button>
            </div>}
            <Highlight
                {...defaultProps}
                code={codeString}
                language={language}
                theme={dynamicTheme}
            >
                {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                }) => (
                    <pre
                        className={className}
                        style={{
                            ...style,
                            padding: "2rem",
                            position: "relative",
                            overflowX: "scroll",
                        }}
                    >
                        {tokens.map((line, i) => (
                            <div
                                {...getLineProps({ line, key: i })}
                                style={style}
                            >
                                {line.map((token, key) => (
                                    <span {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
            <ConfettiWrapper>
                <Confetti active={isCopied} config={config} />
            </ConfettiWrapper>
        </Wrapper>
    )
}
