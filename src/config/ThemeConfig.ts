import ThemeBodyClass from "../enums/ThemeBodyClass"
import IThemeConfig from "../interfaces/IThemeConfig"

export const themeConfig: Array<IThemeConfig> = [
    {
        label: "Monokai Dark",
        emoji: "👻",
        themeBodyClass: ThemeBodyClass.DARK_THEME,
        linearWipeClasses: {
            default: [
                "fillMonokaiBlue",
                "fillMonokaiYellow",
                "fillMonokaiBlue",
            ],
            alternate: [
                "fillMonokaiOrange",
                "fillMonokaiRed",
                "fillMonokaiOrange",
            ],
            love: ["fillMonokaiPink", "fillMonokaiBlue", "fillMonokaiPink"],
        },
        confettiColorClasses: [
            "monokaiRedFont",
            "monokaiOrangeFont",
            "monokaiYellowFont",
            "monokaiGreenFont",
            "monokaiBlueFont",
            "monokaiPinkFont",
        ],
        confettiColorHexCodes: [
            "#f92672",
            "#27dea7",
            "#62d3e9",
            "#f7d163",
            "#fd9720",
            "#fd5ff0",
        ],
    },
    {
        label: "Monokai Light",
        emoji: "☀️",
        themeBodyClass: ThemeBodyClass.LIGHT_THEME,
        linearWipeClasses: {
            default: [
                "fillMonokaiBlue",
                "fillMonokaiYellow",
                "fillMonokaiBlue",
            ],
            alternate: [
                "fillMonokaiOrange",
                "fillMonokaiRed",
                "fillMonokaiOrange",
            ],
            love: ["fillMonokaiPink", "fillMonokaiBlue", "fillMonokaiPink"],
        },
        confettiColorClasses: [
            "monokaiRedFont",
            "monokaiOrangeFont",
            "monokaiYellowFont",
            "monokaiGreenFont",
            "monokaiBlueFont",
            "monokaiPurpleFont",
        ],
        confettiColorHexCodes: [
            "#e70457",
            "#168362",
            "#157e93",
            "#8e6c06",
            "#b15f02",
            "#d402c3",
        ],
    },
    {
        label: "Outrun",
        emoji: "🍧",
        themeBodyClass: ThemeBodyClass.OUTRUN_THEME,
        linearWipeClasses: {
            default: ["fillOutrunPink", "fillOutrunPurple", "fillOutrunPink"],
            alternate: [
                "fillOutrunOrange",
                "fillOutrunPink",
                "fillOutrunOrange",
            ],
            love: ["fillOutrunPink", "fillOutrunPurple", "fillOutrunPink"],
        },
        confettiColorClasses: [
            "outrunOrangeFont",
            "outrunPinkFont",
            "outrunPurpleFont",
        ],
        confettiColorHexCodes: ["#ff467d", "#ff9928", "#d023df"],
    },
    {
        label: "B/W",
        emoji: "⚫⚪",
        themeBodyClass: ThemeBodyClass.BLACK_WHITE_THEME,
        linearWipeClasses: {
            default: ["fillBlack", "fillGray", "fillBlack"],
            alternate: ["fillGray", "fillBlack", "fillGray"],
            love: ["fillBlack", "fillGray", "fillBlack"],
        },
        confettiColorClasses: ["blackFont", "grayFont", "lightGrayFont"],
        confettiColorHexCodes: ["#000000", "#808080", "#BCBCBC"],
    },
]
