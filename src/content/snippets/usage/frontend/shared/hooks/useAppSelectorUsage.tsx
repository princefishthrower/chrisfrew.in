import * as React from "react"
import { useAppSelector } from "./hooks/useAppSelector"

export function ExampleComponent() {
    // complexTypedPartOfSlice here will be typed just as defined in the slice.
    // TypeScript also won't complain about state missing a typing,
    // since it's been typed in the definition for useAppSelector!
    const { complexTypedPartOfSlice } = useAppSelector(
        (state) => state.someSliceOfState
    )
    return <>Hello world!</>
}
