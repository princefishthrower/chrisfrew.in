import Typography from "typography"
import gitHubTheme from "typography-theme-github"

// Custom font to boost font size before creating
gitHubTheme.baseFontSize = '20px';

// create typography
const typography = new Typography(gitHubTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
