import * as React from "react"
import { CSSProperties } from "react"
import { Fade } from "react-awesome-reveal"
import { ThemeContext } from "../../context/theme/ThemeContext"
import { colorizeStringBySeparator } from "../../utils/colorizeStringBySeparator"

export interface IColoredTitleProps {
    title: string
    style?: CSSProperties
}

export function ColoredTitle(props: IColoredTitleProps) {
    const { title, style } = props
    const { themeBodyClass } = React.useContext(ThemeContext)
    const titleContent = colorizeStringBySeparator(
        themeBodyClass,
        title,
        "",
        0,
        true
    )
    return (
        <h1 className="big monospace" style={style}>
            <Fade
                triggerOnce={true}
                cascade={true}
                damping={0.025}
                duration={1000}
                direction="up"
                style={{ display: "inline" }}
            >
                {titleContent}
            </Fade>
        </h1>
    )
}
