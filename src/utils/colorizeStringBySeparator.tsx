import * as React from "react"
import { Fragment, ReactNode } from "react"
import ThemeBodyClass from "../enums/ThemeBodyClass"
import { getThemeColorClasses } from "./getThemeColorClasses"

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
    const colors = getThemeColorClasses(themeBodyClass)
    let colorIndex = -1 + offset

    // note that an entity can be a single character, or an entire word, depending on the separator
    const fragmentArray = entities.map((entity, index) => {
        // regex to check . add characters to the range as needed
        const entitiesToColor = /[a-zA-Z0-9,'.-/\/~&!?{}\[\]$<>"]/gm;

        if (colorIndex === colors.length - 1) {
            colorIndex = -1
        }

        // don't color non-alphanumerics - just return a span
        if (!entity.match(entitiesToColor)) {
            return (
                <Fragment key={index}>
                    <span>{entity}</span>
                </Fragment>
            )
        }

        // otherwise color - pre increment color index before accessing
        // also render the separator if it is not empty string and not last entity
        return (
            <Fragment key={index}>
                <span className={colors[++colorIndex]}>{entity}</span>
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
