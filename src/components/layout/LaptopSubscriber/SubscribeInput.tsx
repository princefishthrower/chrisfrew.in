import * as React from "react"

export interface ISubscribeInputProps {
    text: string
}

export function SubscribeInput(props: ISubscribeInputProps) {
    const { text } = props
    return (
        <>
            <pre style={{ display: "inline" }}>||</pre>
            <input type="submit" value={text}></input>
            <pre style={{ display: "inline" }}>||</pre>
        </>
    )
}
