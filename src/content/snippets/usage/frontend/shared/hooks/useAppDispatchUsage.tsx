import * as React from "react"
import { useAppDispatch } from "./hooks/useAppDispatch"

export function ExampleComponent() {
    // here 'dispatch' will have the correct typing depending on
    // which middleware(s) you are using!
    const dispatch = useAppDispatch()

    const handleButtonClick = () => {
        dispatch(someReduxAction())
    }

    return <button onClick={handleButtonClick}>Click me!</button>
}
