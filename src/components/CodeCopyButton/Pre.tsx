import React, { useState, useContext } from "react"
import Highlight, { defaultProps, Language } from "prism-react-renderer"
import github from "prism-react-renderer/themes/github"
import dracula from "prism-react-renderer/themes/dracula"
import okaidia from "prism-react-renderer/themes/okaidia"
import Confetti from "react-dom-confetti"
import { ThemeContext } from "../../context/theme/ThemeContext"
import ThemeBodyClass from "../../enums/ThemeBodyClass"
import { getThemeColorHexCodes } from "../../utils/getThemeColorHexCodes"
import ICodeLineData from "../../interfaces/ICodeLineData"

// const copyToClipboard = (str: string) => {
//     const el = document.createElement("textarea")
//     el.value = str
//     el.setAttribute("readonly", "")
//     el.style.position = "absolute"
//     el.style.left = "-9999px"
//     document.body.appendChild(el)
//     el.select()
//     document.execCommand("copy")
//     document.body.removeChild(el)
// }

// Copies a string to the clipboard. Must be called from within an
// event handler such as click. May return false if it failed, but
// this is not always possible. Browser support for Chrome 43+,
// Firefox 42+, Safari 10+, Edge and Internet Explorer 10+.
// Internet Explorer: The clipboard feature may be disabled by
// an administrator. By default a prompt is shown the first
// time the clipboard is used (per session).
const copyToClipboard = (text: string) => {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        const textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

const ConfettiWrapper = (props: any) => (
    <div style={{ position: "absolute", top: 0, right: 0 }} {...props} />
)

const Button = (props: any) => (
    <button aria-label="Copy" className="code-copy-button" {...props} />
)

export interface IPreProps {
    codeString: string
    language: Language | "csharp"
    pdfMode?: boolean
}

export const Pre = (props: IPreProps) => {
    const { codeString, language, pdfMode } = props
    const [isCopied, setIsCopied] = useState(false)
    const { themeBodyClass } = useContext(ThemeContext)
    const colors = getThemeColorHexCodes(themeBodyClass)

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 50,
        elementCount: 100,
        dragFriction: 0.10,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        // perspective: "500px",
        colors,
    }

    const resolveTheme = () => {
        // always want github styles for pre when in pdf mode
        if (pdfMode) {
            return github
        }
        // else resolve various themes
        switch (themeBodyClass) {
            case ThemeBodyClass.DARK_THEME:
                return dracula
            case ThemeBodyClass.OUTRUN_THEME:
                return okaidia
            case ThemeBodyClass.LIGHT_THEME:
            default:
                return github
        }
    }

    const getLineClassName = (addedData: ICodeLineData) => {
        if(addedData.isAdded)  {
            return "code-line-added"
        }
        if (pdfMode) {
            return "code-line-pdf-mode"
        }
        return ""
    }

    const getAddedData = (lineTokens: Array<any>): ICodeLineData => {
        if (lineTokens.length > 0 && lineTokens[0].content === "+") {
            return { isAdded: true, shiftCount: 1 }
        }
        if (lineTokens.length > 1 && lineTokens[0].content === "" && lineTokens[1].content === "+") {
            return { isAdded: true, shiftCount: 2 }
        }
        return { isAdded: false, shiftCount: 0 }
    }

    const dynamicTheme = resolveTheme()

    return (
        <>
            {!pdfMode && (
                <div className="code-copy-button-wrapper">
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
                                    <path
                                        fill="none"
                                        d="M0 0h24v24H0V0z"
                                    ></path>
                                    <path d="M16 1H2v16h2V3h12V1zm-1 4l6 6v12H6V5h9zm-1 7h5.5L14 6.5V12z"></path>
                                </svg>
                            </div>
                        )}
                    </Button>
                </div>
            )}
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
                            overflowX: "auto",
                            maxWidth: pdfMode ? "750px" : ""
                        }}
                    >
                        {tokens.map((lineTokens, i) => {
                            const addedData = getAddedData(lineTokens);
                            const lineClassName = getLineClassName(addedData);
                            if (addedData.isAdded) {
                                for (let i = 0; i < addedData.shiftCount; i++) {
                                    lineTokens.shift()
                                }
                            } 
                            return (
                                <div
                                    {...getLineProps({ line: lineTokens, key: i })}
                                    style={{...style, maxWidth: pdfMode ? "750px" : "" }}
                                    className={lineClassName}
                                >
                                    {lineTokens.map((token, key) => (
                                        <span
                                            {...getTokenProps({ token, key })}
                                        />
                                    ))}
                                </div>
                            )
                        })}
                    </pre>
                )}
            </Highlight>
            <ConfettiWrapper style={{position: 'fixed', top: 0, left: 0, width: "100vw", height: "100vh"}}>
                <Confetti active={isCopied} config={confettiConfig} />
            </ConfettiWrapper>
        </>
    )
}
