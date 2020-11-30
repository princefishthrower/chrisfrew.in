import React from "react"
import Fade from "react-reveal/Fade"

export default function Revealer(props) {
    const { component, count } = props

    const components = []
    for (var i = 0; i < count; i++) {
        components.push(component)
    }
    return (
        <Fade left cascade>
            <div>{components}</div>
        </Fade>
    )
}
