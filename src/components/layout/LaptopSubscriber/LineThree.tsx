import * as React from "react"
import { useState } from "react"
import { useInterval } from "react-use"
import Constants from "../../../constants/Constants"
import { useTimeout } from "../../../hooks/useTimeout"


export function LineThree() {
    const [index, setIndex] = useState<number>(0)
    const [shouldRender, setShouldRender] = useState<boolean>(false)

    const one =        <pre>||            ||</pre>
    const two =        <pre>||  T         ||</pre>
    const three =      <pre>||  TH        ||</pre>
    const four =       <pre>||  THE       ||</pre>
    const five =       <pre>||  THE       ||</pre>
    const six =        <pre>||  THE B     ||</pre>
    const seven =      <pre>||  THE BL    ||</pre>
    const eight =      <pre>||  THE BLO   ||</pre>
    const nine =       <pre>||  THE BLOG  ||</pre>
    const ten =        <pre>||  THE BLOG? ||</pre>
    const lines = [one, two, three, four, five, six, seven, eight, nine, ten]

    useTimeout(() => setShouldRender(true), Constants.LAPTOP_SUBSCRIBER_INTERVAL*10);

    useInterval(
        () => setIndex(index + 1),
        shouldRender && index !== lines.length - 1 ? Constants.LAPTOP_SUBSCRIBER_INTERVAL : null
    )

    if (shouldRender) {
        return lines[index]
    }


    return lines[0]

}
