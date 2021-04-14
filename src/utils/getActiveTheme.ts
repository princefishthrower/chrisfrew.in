import { themeConfig } from "../config/ThemeConfig"
import ThemeBodyClass from "../enums/ThemeBodyClass"
import IThemeConfig from "../interfaces/IThemeConfig"

export const getActiveTheme = (themeBodyClass: ThemeBodyClass): IThemeConfig => {
    const activeTheme = themeConfig.find(x => x.themeBodyClass === themeBodyClass)
    return activeTheme ? activeTheme : themeConfig[0]
}