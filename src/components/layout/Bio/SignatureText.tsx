import * as React from "react"
import { Signature } from "./Signature"

export function SignatureText() {
    return (
        <>
            <h2>
                I <span className="monokaiRedUnderline">sincerely</span> hope
                you enjoy the blog!
            </h2>
            <Signature />
            <p>- Chris</p>
        </>
    )
}
