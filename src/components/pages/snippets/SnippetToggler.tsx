import * as React from "react"
import { useState } from "react"
import { Pre } from "../../CodeCopyButton/Pre"

export interface ISnippetTogglerProps {
    snippetLabel: string
    fileLabels: Array<string>
    typeScriptCode?: string
    javaScriptCode?: string
    otherCode?: string
    otherLanguage?: string
    pdfMode: boolean
}

export function SnippetToggler(props: ISnippetTogglerProps) {
    const {
        snippetLabel,
        fileLabels,
        typeScriptCode,
        javaScriptCode,
        otherCode,
        otherLanguage,
        pdfMode,
    } = props
    const [showJavaScript, setShowJavaScript] = useState<boolean>(false)
    const activeModeText = showJavaScript ? "JavaScript" : "TypeScript"
    const className = pdfMode ? "" : activeModeText.toLowerCase()

    if (typeScriptCode && javaScriptCode) {
        return (
            <>
                <h3 className={className}>{snippetLabel}</h3>
                {!pdfMode && (
                    <div>
                        <label className={`switch ${className}`}>
                            <input
                                type="checkbox"
                                onChange={() =>
                                    setShowJavaScript(!showJavaScript)
                                }
                                checked={showJavaScript}
                            />
                            <span className="slider round" />
                            <span className="switch-text snippet">
                                {activeModeText} Mode Active
                            </span>
                        </label>
                    </div>
                )}
                {showJavaScript ? (
                    <>
                        <code className={className}>{fileLabels[1]}</code>
                        <Pre
                            codeString={javaScriptCode}
                            language="typescript"
                            pdfMode={pdfMode}
                        />
                    </>
                ) : (
                    <>
                        <code className={className}>{fileLabels[0]}</code>
                        <Pre
                            codeString={typeScriptCode}
                            language="javascript"
                            pdfMode={pdfMode}
                        />
                    </>
                )}
            </>
        )
    }
    if (otherCode && otherLanguage) {
        return (
            <>
                <h3 className={className}>{snippetLabel}</h3>
                <code className={className}>{fileLabels[0]}</code>
                <Pre
                    codeString={otherCode}
                    language={otherLanguage}
                    pdfMode={pdfMode}
                />
            </>
        )
    }

    return <>Error generating this code snippet! 😞</>
}
