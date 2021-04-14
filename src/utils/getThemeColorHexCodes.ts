import { themeConfig } from "../config/ThemeConfig"
import ThemeBodyClass from "../enums/ThemeBodyClass"

export const getThemeColorHexCodes = (themeBodyClass: ThemeBodyClass) => {
    const activeTheme = themeConfig.find(x => x.themeBodyClass === themeBodyClass)
    return activeTheme ? activeTheme.themeColorHexCodes : themeConfig[0].themeColorHexCodes
}