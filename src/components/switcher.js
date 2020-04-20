import React from "react"
import BodyClassName from "react-body-classname"
import { instanceOf } from "prop-types"
import { withCookies, Cookies } from "react-cookie"

const DARK_TEXT = "Dark"
const DARK_EMOJI = "👻"
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
        cookies.get("user-theme-preference") === "dark-mode"
          ? "dark-mode"
          : "light-mode"

      // default values
    } else {
      activeMode = "dark-mode"
    }

    this.state = {
      activeMode: activeMode,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const { cookies } = this.props
    if (event.target.checked) {
      this.setState({ LIGHT_TEXT, activeMode: "light-mode" })
      cookies.set("user-theme-preference", "light-mode", { path: "/" })
    } else {
      this.setState({ activeMode: "dark-mode" })
      cookies.set("user-theme-preference", "dark-mode", { path: "/" })
    }
  }

  render() {
    const { activeMode } = this.state
    const activeModeText = activeMode === "dark-mode" ? DARK_TEXT : LIGHT_TEXT
    const activeModeEmoji =
      activeMode === "dark-mode" ? DARK_EMOJI : LIGHT_EMOJI
    return (
      <div className="switch-container">
        <BodyClassName className={activeMode} />
        <label className="switch">
          <input
            type="checkbox"
            onChange={this.handleInputChange}
            checked={activeMode === "dark-mode" ? false : true}
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
