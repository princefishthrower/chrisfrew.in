import React from "react"
import BodyClassName from "react-body-classname"
import { instanceOf } from "prop-types"
import { withCookies, Cookies } from "react-cookie"

const DARK_MODE = "dark-mode"
const DARK_TEXT = "Dark"
const DARK_EMOJI = "👻"

const LIGHT_MODE = "light-mode"
const LIGHT_TEXT = "Light"
const LIGHT_EMOJI = "☀️"

class Switcher extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  }

  constructor(props) {
    super(props)

    const { cookies } = this.props

    let activeMode

    // already set at some point by the user
    if (cookies.get("user-theme-preference")) {
      activeMode =
        cookies.get("user-theme-preference") === DARK_MODE
          ? DARK_MODE
          : LIGHT_MODE

      // default value = dark mode :)
    } else {
      activeMode = DARK_MODE
    }

    this.state = {
      activeMode: activeMode,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.setStyleLink = this.setStyleLink.bind(this)
    this.setStyleLink(activeMode)
  }

  setStyleLink(mode) {
    if (typeof document !== "undefined") {
      const href =
        mode === DARK_MODE
          ? "https://cdn.jsdelivr.net/npm/prism-themes@1.4.0/themes/prism-xonokai.css"
          : "https://cdn.jsdelivr.net/npm/prism-themes@1.4.0/themes/prism-material-light.css"
      const cssId = "prism-styles" // you could encode the css path itself to generate id..
      if (!document.getElementById(cssId)) {
        const head = document.getElementsByTagName("head")[0]
        const link = document.createElement("link")
        link.id = cssId
        link.rel = "preload"
        link.type = "text/css"
        link.href = href
        link.media = "all"
        head.appendChild(link)
      } else {
        const link = document.getElementById(cssId)
        link.href = href
      }
    }
  }

  handleInputChange(event) {
    const { cookies } = this.props
    if (event.target.checked) {
      this.setState({ LIGHT_TEXT, activeMode: LIGHT_MODE })
      cookies.set("user-theme-preference", LIGHT_MODE, { path: "/" })
      this.setStyleLink(LIGHT_MODE)
    } else {
      this.setState({ activeMode: DARK_MODE })
      cookies.set("user-theme-preference", DARK_MODE, { path: "/" })
      this.setStyleLink(DARK_MODE)
    }
  }

  render() {
    const { activeMode } = this.state
    const activeModeText = activeMode === DARK_MODE ? DARK_TEXT : LIGHT_TEXT
    const activeModeEmoji = activeMode === DARK_MODE ? DARK_EMOJI : LIGHT_EMOJI
    return (
      <div className="switch-container">
        <BodyClassName className={activeMode} />
        <label className="switch">
          <input
            type="checkbox"
            onChange={this.handleInputChange}
            checked={activeMode === DARK_MODE ? false : true}
          />
          <span className="slider round" />
          <span className="switch-text emoji-fix">{activeModeEmoji}</span>
          <span className="switch-text">{activeModeText} mode active</span>
        </label>
      </div>
    )
  }
}
export default withCookies(Switcher)
