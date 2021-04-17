import ThemeBodyClass from "../enums/ThemeBodyClass"
import IThemeConfig from "../interfaces/IThemeConfig"

export const themeConfig: Array<IThemeConfig> = [
    {
        label: "Monokai Dark",
        emoji: "👻",
        themeBodyClass: ThemeBodyClass.DARK_THEME,
        defaultHexColor: "#191919",
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
        themeColorClasses: [
            "monokaiRedFont",
            "monokaiOrangeFont",
            "monokaiYellowFont",
            "monokaiGreenFont",
            "monokaiBlueFont",
            "monokaiPinkFont",
        ],
        themeColorHexCodes: [
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
        defaultHexColor: "#ffffff",
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
        themeColorClasses: [
            "monokaiRedFont",
            "monokaiOrangeFont",
            "monokaiYellowFont",
            "monokaiGreenFont",
            "monokaiBlueFont",
            "monokaiPurpleFont",
        ],
        themeColorHexCodes: [
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
        emoji: "🏎️",
        themeBodyClass: ThemeBodyClass.OUTRUN_THEME,
        defaultHexColor: "#201138",
        linearWipeClasses: {
            default: ["fillOutrunPink", "fillOutrunPurple", "fillOutrunPink"],
            alternate: [
                "fillOutrunOrange",
                "fillOutrunPink",
                "fillOutrunOrange",
            ],
            love: ["fillOutrunPink", "fillOutrunPurple", "fillOutrunPink"],
        },
        themeColorClasses: [
            "outrunOrangeFont",
            "outrunPinkFont",
            "outrunPurpleFont",
        ],
        themeColorHexCodes: ["#ff467d", "#ff9928", "#d023df"],
    },
    {
        label: "B/W",
        emoji: "⚫⚪",
        themeBodyClass: ThemeBodyClass.BLACK_WHITE_THEME,
        defaultHexColor: "#ffffff",
        linearWipeClasses: {
            default: ["fillBlack", "fillGray", "fillBlack"],
            alternate: ["fillGray", "fillBlack", "fillGray"],
            love: ["fillBlack", "fillGray", "fillBlack"],
        },
        themeColorClasses: ["blackFont", "grayFont", "lightGrayFont"],
        themeColorHexCodes: ["#000000", "#808080", "#BCBCBC"],
    },
]
