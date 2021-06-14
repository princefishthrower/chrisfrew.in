import { Link } from "gatsby"
import { Language } from "prism-react-renderer"
import * as React from "react"
import { useState } from "react"
import URLSearchParamValue from "../../../enums/URLSearchParamValue"
import { Pre } from "../../CodeCopyButton/Pre"

export interface ISnippetInfo {
    fileLabel: string
    code: string
    usageCode?: string
    language: Language | "csharp"
}

export interface ISeenInInfo {
    title: string
    slug: string
}

export interface ISnippetTogglerProps {
    snippetLabel: string
    snippetDescription?: string
    seenInPosts?: Array<ISeenInInfo>
    snippetInfos: Array<ISnippetInfo>
    pdfMode?: boolean
    languageFilter?: URLSearchParamValue
}

export function SnippetToggler(props: ISnippetTogglerProps) {
    const {
        snippetLabel,
        snippetDescription,
        seenInPosts,
        snippetInfos,
        pdfMode,
        languageFilter,
    } = props
    const [showJavaScript, setShowJavaScript] = useState<boolean>(false)
    const activeModeText = showJavaScript ? "JavaScript" : "TypeScript"
    const className = pdfMode ? "" : activeModeText.toLowerCase()

    const headerContent = (
        <>
            <hr />
            <h3 id={snippetLabel} className={className}>{snippetLabel}</h3>
            {snippetDescription && <p>{snippetDescription}</p>}
            {seenInPosts && (
                <p>
                    From post:{" "}
                    {seenInPosts.map((x) => (
                        <Link to={x.slug}>{x.title}</Link>
                    ))}
                </p>
            )}
        </>
    )

    if (snippetInfos.length === 2) {
        const typeScriptBlock = (
            <>
                <code className={className}>{snippetInfos[0].fileLabel}</code>
                <Pre
                    codeString={snippetInfos[0].code}
                    language={snippetInfos[0].language}
                    pdfMode={pdfMode}
                />
                <h3>Usage</h3>
                {snippetInfos[0].usageCode && (
                    <Pre
                        codeString={snippetInfos[0].usageCode}
                        language={snippetInfos[0].language}
                        pdfMode={pdfMode}
                    />
                )}
            </>
        )

        const javaScriptBlock = (
            <>
                <code className={className}>{snippetInfos[1].fileLabel}</code>
                <Pre
                    codeString={snippetInfos[1].code}
                    language={snippetInfos[1].language}
                    pdfMode={pdfMode}
                />
                <h3>Usage</h3>
                {snippetInfos[1].usageCode && (
                    <Pre
                        codeString={snippetInfos[1].usageCode}
                        language={snippetInfos[1].language}
                        pdfMode={pdfMode}
                    />
                )}
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
                    {languageFilter === URLSearchParamValue.TYPESCRIPT &&
                        typeScriptBlock}
                    {languageFilter === URLSearchParamValue.JAVASCRIPT &&
                        javaScriptBlock}
                </>
            )
        }

        return (
            <>
                {headerContent}
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
                {showJavaScript ? javaScriptBlock : typeScriptBlock}
            </>
        )
    }

    return (
        <>
            {headerContent}
            <code>{snippetInfos[0].fileLabel}</code>
            <Pre
                codeString={snippetInfos[0].code}
                language={snippetInfos[0].language}
                pdfMode={pdfMode}
            />
            <h3>Usage</h3>
            {snippetInfos[0].usageCode && (
                <Pre
                    codeString={snippetInfos[0].usageCode}
                    language={snippetInfos[0].language}
                    pdfMode={pdfMode}
                />
            )}
        </>
    )
}
