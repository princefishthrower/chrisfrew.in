import * as React from "react"
import { Duck } from "./Duck"

export function DuckContainer() {
    return (
        <>
            <h2 style={{ textAlign: 'center', marginTop: "10rem"}}>You made it all the way down here?! Well then, please enjoy these three ducks:</h2>
            <div className="duck-flex-container">
                <Duck delay={0} />
                <Duck delay={200} />
                <Duck delay={400} />
            </div>
        </>
    )
}
