import * as React from "react"

export interface ICloseButtonProps {
    text: string
    onClickCallback: () => void
}

export function CloseButton(props: ICloseButtonProps) {
    const { text, onClickCallback } = props
    return (
        <>
            <pre style={{ display: "inline" }}>||</pre>
            <button
                style={{ display: "inline" }}
                onClick={(event) => {
                    event.preventDefault()
                    onClickCallback()
                }}
            >
                <pre>{text}</pre>
            </button>
            <pre style={{ display: "inline" }}>||</pre>
        </>
    )
}
