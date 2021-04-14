import { themeConfig } from "../config/ThemeConfig"
import ThemeBodyClass from "../enums/ThemeBodyClass"

export const getThemeColorClasses = (themeBodyClass: ThemeBodyClass) => {
    const activeTheme = themeConfig.find(x => x.themeBodyClass === themeBodyClass)
    return activeTheme ? activeTheme.themeColorClasses : themeConfig[0].themeColorClasses
}