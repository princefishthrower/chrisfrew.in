import * as React from "react"
import { useState } from "react"
import { useInterval } from "react-use"
import Constants from "../../../constants/Constants"


export function LineOne() {
    const [index, setIndex] = useState<number>(0)
    const one = <pre>||            ||</pre>
    const two =        <pre>||    H       ||</pre>
    const three =        <pre>||    HE      ||</pre>
    const four =      <pre>||    HEY     ||</pre>
    const five =       <pre>||    HEY,    ||</pre>
    const lines = [one, two, three, four, five]

    useInterval(
        () => setIndex(index + 1),
        index === lines.length - 1 ? null : Constants.LAPTOP_SUBSCRIBER_INTERVAL
    )
    return lines[index]
}
