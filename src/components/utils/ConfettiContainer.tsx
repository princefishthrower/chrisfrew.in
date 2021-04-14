import React, { useEffect } from "react"
import { useWindowSize, useTween } from "react-use"
import Confetti from "react-confetti"
import { useContext } from "react"
import { ThemeContext } from "../../context/theme/ThemeContext"
import { getThemeColorHexCodes } from "../../utils/getThemeColorHexCodes"

// TODO: setup a class here to get various special characters on a day
const codeCharacters = [
    "*",
    "@",
    "{",
    "[",
    "&",
    "$",
    "#",
    "+",
    ":",
    ">",
    "~",
    "=",
]

function draw(ctx) {
    if (!this.character) {
        this.character =
            codeCharacters[Math.floor(Math.random() * codeCharacters.length)]
    }
    ctx.font = "normal 900 20pt Monaco"
    ctx.fillText(this.character, 0, 0)
    ctx.restore()
}

const duration = 2000;

export default function ConfettiContainer(props) {
    const { onAnimationComplete } = props;
    const { width, height } = useWindowSize()
    const frictionTween = useTween('outQuad', duration, 0)
    const opacityTween = useTween('linear', duration, duration / 2)
    const windTween = useTween('outQuart', duration*2, duration / 3)
    const { themeBodyClass } = useContext(ThemeContext)
    const colors = getThemeColorHexCodes(themeBodyClass);

    // friction tweens from .99 to .79 (solved system of equations, hehe)
    const friction = -0.2 * frictionTween + .99;

    // opacity tweens from 1 to 0
    const opacity = -opacityTween + 1;

    const wind = windTween * 2;

    useEffect(() => {
        if (opacity === 0) {
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }
    }, [opacity, onAnimationComplete])

    return (
        <>
            <Confetti
                width={width}
                height={height}
                drawShape={draw}
                numberOfPieces={80}
                confettiSource={{ x: 0, y: height, w: 0, h: 0 }}
                initialVelocityX={{ min: -10, max: 90 }}
                friction={friction}
                opacity={opacity}
                initialVelocityY={90}
                colors={colors}
                wind={wind}
                recycle={false}
                tweenDuration={1}
            />
            <Confetti
                width={width}
                height={height}
                drawShape={draw}
                numberOfPieces={80}
                confettiSource={{
                    x: width,
                    y: height,
                    w: 0,
                    h: 0,
                }}
                initialVelocityX={{ min: -90, max: 10 }}
                friction={friction}
                opacity={opacity}
                initialVelocityY={90}
                colors={colors}
                recycle={false}
                wind={wind}
                tweenDuration={1}
            />
        </>
    )
}
