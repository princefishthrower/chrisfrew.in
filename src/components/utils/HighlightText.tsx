import * as React from "react"

interface IHighlightTextProps {
    text: string
    highlights: Array<string>
}

export const HighlightText = (props: IHighlightTextProps) => {
    const { text, highlights } = props

    // return plain text if highlight is empty
    if (highlights.length === 0) {
        return <span>{text}</span>
    }

    if (highlights.length === 1 && highlights[0] === "") {
        return <span>{text}</span>
    }

    // otherwise, find the highlights! (if any)
    const regex = new RegExp(`(${highlights.join("|")})`, "gi")
    const parts = text.split(regex)

    return (
        <span>
            {parts.filter(String).map((part, i) => {
                return regex.test(part) ? (
                    <mark key={i}>{part}</mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            })}
        </span>
    )
}
