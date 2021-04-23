import * as React from "react"
import { AsciiLine } from "../../utils/Ascii/AsciiLine"

export interface IDuckProps {
    delay: number;
}

export function Duck(props: IDuckProps) {
    const { delay } = props;
    return (
        <AsciiLine
            interval={400}
            delay={delay}
            lines={[
`   _
__(.)=
\\___)`,
`   _
__(.)<
\\___)`,
            ]}
            repeat={true}
        />
    )
}
