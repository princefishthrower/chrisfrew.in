import { Language } from "prism-react-renderer"
import * as React from "react"
import { useState } from "react"
import URLSearchParamValue from "../../../enums/URLSearchParamValue"
import { Pre } from "../../CodeCopyButton/Pre"

export interface ISnippetTogglerProps {
    snippetLabel: string
    fileLabels: Array<string>
    typeScriptCode?: string
    javaScriptCode?: string
    otherCode?: string
    otherLanguage?: Language
    pdfMode?: boolean,
    languageFilter?: URLSearchParamValue
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
        languageFilter,
    } = props
    const [showJavaScript, setShowJavaScript] = useState<boolean>(false)
    const activeModeText = showJavaScript ? "JavaScript" : "TypeScript"
    const className = pdfMode ? "" : activeModeText.toLowerCase()

    if (typeScriptCode && javaScriptCode) {
        
        const typeScriptBlock = (
            <>
                <code className={className}>{fileLabels[0]}</code>
                <Pre
                    codeString={typeScriptCode}
                    language="typescript"
                    pdfMode={pdfMode}
                />
            </>
        )

        const javaScriptBlock = (
            <>
                <code className={className}>{fileLabels[1]}</code>
                <Pre
                    codeString={javaScriptCode}
                    language="javascript"
                    pdfMode={pdfMode}
                />
            </>
        )

        if (pdfMode) {
            return (
                <>
                    {languageFilter === URLSearchParamValue.ALL && (
                        <>
                            {typeScriptBlock}
                            {javaScriptBlock}
                        </>
                    )}
                    {languageFilter === URLSearchParamValue.TYPESCRIPT && typeScriptBlock }
                    {languageFilter === URLSearchParamValue.JAVASCRIPT && javaScriptBlock }
                </>
            )
        }

        return (
            <>
                <h3 className={className}>{snippetLabel}</h3>
                <div>
                    <label className={`switch ${className}`}>
                        <input
                            type="checkbox"
                            onChange={() => setShowJavaScript(!showJavaScript)}
                            checked={showJavaScript}
                        />
                        <span className="slider round" />
                        <span className="switch-text snippet">
                            {activeModeText} Mode Active
                        </span>
                    </label>
                </div>

                {showJavaScript ? javaScriptBlock : typeScriptBlock }
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
