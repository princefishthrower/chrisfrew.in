import * as React from "react"
import { useState } from "react"
import { useInterval } from "react-use"
import { useTimeout } from "../../../hooks/useTimeout";

export interface IAsciiLineProps {
    interval: number;
    delay: number;
    lines: Array<string | React.ReactNode>;
    repeat: boolean;
}

export function AsciiLine(props: IAsciiLineProps) {
    const { interval, delay, lines, repeat } = props;
    const [shouldAnimate, setShouldAnimate] = useState<boolean>(delay === 0)
    const [lineIndex, setLineIndex] = useState<number>(0)

    const getIntervalValue = (): number | null => {
        // repeat is false, we set to null as soon as we hit the end
        if (!repeat) {
            return shouldAnimate && lineIndex !== lines.length - 1 ? interval : null
        }
        // if repeat is true, we are always using the interval as long as we should animate
        return shouldAnimate ? interval : null
    }

    useTimeout(
        () => setShouldAnimate(true),
        delay
    )

    useInterval(
        () => lineIndex === lines.length - 1 ? setLineIndex(0) : setLineIndex(lineIndex + 1),
        getIntervalValue()
    )

    return <pre>{lines[lineIndex]}</pre>
}
