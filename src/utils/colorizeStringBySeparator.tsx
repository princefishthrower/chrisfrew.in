import * as React from "react"
import { Fragment, ReactNode } from "react"
import ThemeBodyClass from "../enums/ThemeBodyClass"
import { getConfettiColorClasses } from "./getConfettiColorClasses"

export const colorizeStringBySeparator = (
    themeBodyClass: ThemeBodyClass,
    text: string,
    separator: string,
    offset: number = 0,
    asArray: boolean = false
): ReactNode => {
    if (!text) {
        return <></>
    }
    const entities = text.split(separator)
    const colors = getConfettiColorClasses(themeBodyClass)
    let colorIndex = -1 + offset

    const fragmentArray = entities.map((letter, index) => {
        if (colorIndex === colors.length - 1) {
            colorIndex = -1
        }
        return (
            <Fragment key={index}>
                <span className={colors[++colorIndex]}>{letter}</span>
                {separator !== "" && index !== entities.length - 1 && (
                    <>{separator}</>
                )}
            </Fragment>
        )
    })

    if (asArray) {
        return fragmentArray
    }

    // return as react node
    return <>{fragmentArray}</>

}
