import * as React from "react"
import { useDidMount } from "./hooks/useDidMount"

export function ExampleComponent() {
    const didMount = useDidMount()

    if (didMount) {
        console.log(
            "I am mounted! Things like the DOM and window are available! Or, you could run some animation you were waiting to run!"
        )
    }

    return <></>
}
