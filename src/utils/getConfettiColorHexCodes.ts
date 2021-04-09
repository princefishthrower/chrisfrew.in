import { themeConfig } from "../config/ThemeConfig"
import ThemeBodyClass from "../enums/ThemeBodyClass"

export const getConfettiColorHexCodes = (themeBodyClass: ThemeBodyClass) => {
    const activeTheme = themeConfig.find(x => x.themeBodyClass === themeBodyClass)
    return activeTheme ? activeTheme.confettiColorHexCodes : themeConfig[0].confettiColorHexCodes
}