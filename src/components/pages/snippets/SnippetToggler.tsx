import * as React from "react"
import { useState } from "react"
import { Pre } from "../../CodeCopyButton/Pre"

export interface ISnippetTogglerProps {
    snippetLabel: string
    fileLabels: Array<string>
    typeScriptCode: string
    javaScriptCode: string
    pdfMode: boolean
}

export function SnippetToggler(props: ISnippetTogglerProps) {
    const { snippetLabel, fileLabels, typeScriptCode, javaScriptCode, pdfMode } = props
    const [showJavaScript, setShowJavaScript] = useState<boolean>(false)
    const activeModeText = showJavaScript ? "JavaScript" : "TypeScript"
    const className = pdfMode ? "" : activeModeText.toLowerCase()
    return (
        <>
            {!pdfMode && <div>
                <label className={`switch ${className}`}>
                    <input
                        type="checkbox"
                        onChange={() => setShowJavaScript(!showJavaScript)}
                        checked={showJavaScript}
                    />
                    <span className="slider round" />
                    <span className="switch-text">
                        {activeModeText} Mode Active
                    </span>
                </label>
            </div>}
            {showJavaScript ? (
                <>
                    <h3 className={className}>{snippetLabel}</h3>
                    <code className={className}>{fileLabels[1]}</code>
                    <Pre codeString={javaScriptCode} language="typescript" pdfMode={pdfMode}/>
                </>
            ) : (
                <>
                    <h3 className={className}>{snippetLabel}</h3>
                    <code className={className}>{fileLabels[0]}</code>
                    <Pre codeString={typeScriptCode} language="javascript" pdfMode={pdfMode}/>
                </>
            )}
        </>
    )
}
