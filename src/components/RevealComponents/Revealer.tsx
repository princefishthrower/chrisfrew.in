import React, { ReactNode } from "react"
import { Fade } from "react-awesome-reveal"

interface IRevealerProps {
    component: ReactNode
    count: number
}

export default function Revealer(
    props: IRevealerProps = { component: "", count: 1 }
) {
    const { component, count } = props
    const isString = typeof component === "string"
    const getContent = () => {
        const components = []
        for (var i = 0; i < count; i++) {
            if (isString) {
                components.push(<span>{component}</span>)
            } else {
                components.push(component)
            }
        }
        return components
    }

    const content = getContent()
    return (
        <Fade
            direction="right"
            triggerOnce={true}
            damping={0.0001}
            duration={1000}
            cascade={isString}
            style={{ display: "inline" }}
        >
            {content}
        </Fade>
    )
}
