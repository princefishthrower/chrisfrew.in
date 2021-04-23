import * as React from "react"
import { Duck } from "./Duck"

export interface IDuckContainerProps {}

export function DuckContainer(props: IDuckContainerProps) {
    return (
        <>
            <p className="text-center"><strong>Enjoy these three ducks:</strong></p>
            <div className="duck-flex-container">
                <Duck delay={0} />
                <Duck delay={200} />
                <Duck delay={400} />
            </div>
        </>
    )
}
