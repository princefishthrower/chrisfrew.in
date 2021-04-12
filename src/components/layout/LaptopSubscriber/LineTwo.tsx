import * as React from "react"
import { useState } from "react"
import { useInterval } from "react-use"
import Constants from "../../../constants/Constants"
import { useTimeout } from "../../../hooks/useTimeout"

export function LineTwo() {
    const [shouldRender, setShouldRender] = useState<boolean>(false)
    const [index, setIndex] = useState<number>(0)
    const one =   <pre>||            ||</pre>
    const two =   <pre>||    L       ||</pre>
    const three = <pre>||    LI      ||</pre>
    const four =  <pre>||    LIK     ||</pre>
    const five =  <pre>||    LIKE    ||</pre>
    const lines = [one, two, three, four, five]

    useTimeout(
        () => setShouldRender(true),
        Constants.LAPTOP_SUBSCRIBER_INTERVAL * 5
    )

    useInterval(
        () => setIndex(index + 1),
        shouldRender && index !== lines.length - 1 ? Constants.LAPTOP_SUBSCRIBER_INTERVAL : null
    )

    if (shouldRender) {
        return lines[index]
    }

    return lines[0]
}
