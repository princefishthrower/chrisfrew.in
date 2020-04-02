import React from "react"

export default class Switcher extends React.Component {
  constructor() {
    super();
    this.state = {
      activeModeText: "Dark"
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }
  handleInputChange(event) {
    if (event.target.checked) {
      document.body.classList.remove("dark-mode")
      document.body.classList.add("light-mode")
      this.setState({ activeModeText: "Light" });
    } else {
      document.body.classList.remove("light-mode")
      document.body.classList.add("dark-mode")
      this.setState({ activeModeText: "Dark" });
    }
  }

  render() {
    const { activeModeText } = this.state;
    return (
      <div className="switch-container">
        <label className="switch">
          <input type="checkbox" onChange={this.handleInputChange} />
          <span className="slider round" />
        </label>
        <span className="switch-text"><b>{activeModeText} mode active</b></span>
      </div>
    )
  }
}
