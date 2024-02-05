import React, { useState, useContext } from "react"
import { Highlight, themes } from "prism-react-renderer"
import Confetti from "react-dom-confetti"
import { ThemeContext } from "../../context/theme/ThemeContext"
import ThemeBodyClass from "../../enums/ThemeBodyClass"
import { getThemeColorHexCodes } from "../../utils/getThemeColorHexCodes"
import ICodeLineData from "../../interfaces/ICodeLineData"

const copyToClipboard = (text: string) => {
    window.navigator.clipboard.writeText(text)
}

const ConfettiWrapper = (props: any) => (
    <div style={{ position: "absolute", top: 0, right: 0 }} {...props} />
)

const Button = (props: any) => (
    <button aria-label="Copy" className="code-copy-button" {...props} />
)

export interface IPreProps {
    codeString: string
    language: string
    pdfMode?: boolean
}

export const Pre = (props: IPreProps) => {
    console.log("Pre props", props)
    const { codeString, language, pdfMode } = props
    const [isCopied, setIsCopied] = useState(false)
    const { themeBodyClass } = useContext(ThemeContext)
    const colors = getThemeColorHexCodes(themeBodyClass)

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 50,
        elementCount: 100,
        dragFriction: 0.1,
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
            return themes.github
        }
        // else resolve various themes
        switch (themeBodyClass) {
            case ThemeBodyClass.DARK_THEME:
                return themes.dracula
            case ThemeBodyClass.OUTRUN_THEME:
                return themes.okaidia
            case ThemeBodyClass.LIGHT_THEME:
            default:
                return themes.github
        }
    }

    const getLineClassName = (addedData: ICodeLineData) => {
        if (addedData.isAdded) {
            return "code-line-added"
        }
        if (pdfMode) {
            return "code-line-pdf-mode"
        }
        return ""
    }

    const getAddedData = (lineTokens: Array<any>): ICodeLineData => {
        if (lineTokens.length > 0 && lineTokens[0].content === "+" || lineTokens[0].content.includes("+")) {
            console.log("detected 'add' line; shift 1")
            return { isAdded: true, shiftCount: 1 }
        }
        if (
            lineTokens.length > 1 &&
            lineTokens[0].content === "" &&
            lineTokens[1].content === "+"
        ) {
            console.log("detected 'add' line; shift 2")
            return { isAdded: true, shiftCount: 2 }
        }
        return { isAdded: false, shiftCount: 0 }
    }

    const dynamicTheme = resolveTheme()

    return (
        <>
            <div style={{fontSize: "0.5rem", fontFamily: "Fira Code", marginBottom: "-0.4rem"}}><i>{language}</i></div>
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
                            <div className="gatsby-code-button blog-tag-small">
                                <span role="img" aria-label="confetti">
                                    🎉
                                </span>{" "}
                                Copied!
                            </div>
                        ) : (
                            <div className="gatsby-code-button blog-tag-small">
                                Copy
                            </div>
                        )}
                    </Button>
                </div>
            )}
            <Highlight
                theme={dynamicTheme}
                code={codeString}
                language={language}
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
                            maxWidth: pdfMode ? "750px" : "",
                        }}
                    >
                        {tokens.map((lineTokens, index) => {
                            const addedData = getAddedData(lineTokens)
                            const lineClassName = getLineClassName(addedData)
                            // if (addedData.isAdded) {
                            //     for (let i = 0; i < addedData.shiftCount; i++) {
                            //         console.log("shifting lineTokens")
                            //         lineTokens.shift()
                            //     }
                            // }
                            // for some reason almost every code snippet is shipping with a newline at the very bottom...
                            // build this check to eliminate that
                            if (index === tokens.length - 1 && lineTokens.length === 1 && lineTokens[0].content === "\n") {
                                return <></>
                            }
                            return (
                                <div
                                    {...getLineProps({
                                        line: lineTokens,
                                        key: index,
                                    })}
                                    style={{
                                        ...style,
                                        maxWidth: pdfMode ? "750px" : "",
                                    }}
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
            <ConfettiWrapper
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                }}
            >
                <Confetti active={isCopied} config={confettiConfig} />
            </ConfettiWrapper>
        </>
    )
}
