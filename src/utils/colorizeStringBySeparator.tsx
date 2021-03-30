import * as React from "react"
import { Fragment, ReactNode } from "react"
import Constants from "../constants/Constants"

export const colorizeStringBySeparator = (
    text: string,
    separator: string,
    offset: number = 0
): ReactNode => {
    if (!text) {
        return <></>;
    }
    const entities = text.split(separator)
    let colorIndex = -1 + offset
    return (
        <>
            {entities.map((letter, index) => {
                if (colorIndex === Constants.COLOR_CLASS_NAMES.length - 1) {
                    colorIndex = -1
                }
                return (
                    <Fragment key={index}>
                        <span
                            className={
                                Constants.COLOR_CLASS_NAMES[++colorIndex]
                            }
                        >
                            {letter}
                        </span>
                        {separator !== "" && index !== entities.length - 1 && (
                            <>{separator}</>
                        )}
                    </Fragment>
                )
            })}
        </>
    )
}
