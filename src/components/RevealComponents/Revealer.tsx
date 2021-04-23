import React from "react"
import {Fade} from "react-awesome-reveal"

export default function Revealer(props) {
    const { component, count } = props

    const components = []
    for (var i = 0; i < count; i++) {
        components.push(component)
    }
    return (
        <Fade direction="right" triggerOnce={true}>
            <div>{components}</div>
        </Fade>
    )
}
