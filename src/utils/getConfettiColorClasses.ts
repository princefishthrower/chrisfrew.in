import { themeConfig } from "../config/ThemeConfig"
import ThemeBodyClass from "../enums/ThemeBodyClass"

export const getConfettiColorClasses = (themeBodyClass: ThemeBodyClass) => {
    const activeTheme = themeConfig.find(x => x.themeBodyClass === themeBodyClass)
    return activeTheme ? activeTheme.confettiColorClasses : themeConfig[0].confettiColorClasses
}