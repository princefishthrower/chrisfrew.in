import React from "react"
import BodyClassName from "react-body-classname"
import { instanceOf } from "prop-types"
import { withCookies, Cookies } from "react-cookie"

class Switcher extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  }

  constructor(props) {
    super(props)

    const { cookies } = this.props

    let activeModeText
    if (cookies.get("user-theme-preference")) {
      // already set at some point by the user
      activeModeText =
        cookies.get("user-theme-preference") === "dark-mode" ? "Dark" : "Light"
    } else {
      // default
      activeModeText = "Dark"
    }

    this.state = {
      activeModeText: activeModeText,
      activeMode: cookies.get("user-theme-preference") || "dark-mode",
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const { cookies } = this.props
    if (event.target.checked) {
      this.setState({ activeModeText: "Light", activeMode: "light-mode" })
      cookies.set("user-theme-preference", "light-mode", { path: "/" })
    } else {
      this.setState({ activeModeText: "Dark", activeMode: "dark-mode" })
      cookies.set("user-theme-preference", "dark-mode", { path: "/" })
    }
  }

  render() {
    const { activeModeText, activeMode } = this.state
    return (
      <div className="switch-container">
        <BodyClassName className={activeMode} />
        <label className="switch">
          <input type="checkbox" onChange={this.handleInputChange} checked={activeMode === "dark-mode" ? false : true} />
          <span className="slider round" />
        </label>
        <span className="switch-text">
          <b>{activeModeText} mode active</b>
        </span>
      </div>
    )
  }
}
export default withCookies(Switcher)
