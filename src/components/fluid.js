import React from "react";

class Fluid extends React.Component {

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "./fluid-init.js";
    script.id = "fluid-src"; // give the script tag an ID
    script.async = true;
    document.body.appendChild(script);
  }

  componentWillUnmount() {
    document.querySelector("#fluid-src").remove();
  }

  render() {
    let scriptExists;
    try {
      scriptExists = document.getElementById('fluid-src');
    } catch (err) {
      scriptExists = false;
    }
    return (
    <div>
        {scriptExists && <div className="canvas-mask"></div>}
        <canvas className="fluid-canvas"></canvas>
    </div>
    );
  }
}

export default Fluid;