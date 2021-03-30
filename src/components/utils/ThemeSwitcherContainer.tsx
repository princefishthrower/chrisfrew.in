import * as React from "react"
import { useState } from "react"
import { CookiesProvider } from "react-cookie"
import Size from "../../enums/Size"
import ConfettiContainer from "./ConfettiContainer"
import ThemeSwitcher from "./ThemeSwitcher"

export interface IThemeSwitcherContainerProps {
    size: Size
}

export function ThemeSwitcherContainer(props: IThemeSwitcherContainerProps) {
    const { size } = props
    const [shouldRun, setShouldRun] = useState(false)
    return (
        <>
            {shouldRun && (
                <ConfettiContainer
                    onAnimationComplete={() => setShouldRun(false)}
                />
            )}
            <ThemeSwitcher activateRun={() => setShouldRun(true)} size={size} />
        </>
    )
}
