import * as React from "react"
import monetizedLoop from "../../images/monetized_loop.svg"
import EmailForm from "../utils/EmailForm"

export function Footer() {
    return (
        <footer>
            <div className="inner-footer-wrapper">
            <EmailForm/>
            <div>
                <span>Really like the blog? You can support it:</span>
                <div>
                <a
                    className="bmc-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.buymeacoffee.com/chrisfrewin"
                >
                    <img
                        src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
                        alt="Buy me a cappucino"
                        width="27px"
                        height="23.75px"
                    />
                    <span style={{ marginLeft: 5 }}>Buy me a cappucino</span>
                </a>
                </div>
            </div>
            <div>
                <span>
                    This blog is Web-Monetized by{" "}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://coil.com/about"
                        title="What's Coil?"
                    >
                        Coil
                    </a>
                </span>
                <div>
                <img
                    src={monetizedLoop}
                    alt="Monetization by Coil"
                    width="171"
                    height="22"
                />
                </div>
            </div>
            <div>
                © 2016 - {new Date().getFullYear()}
                &nbsp;
                <a
                    href="https://fullstackcraft.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Full Stack Craft
                </a>
            </div>
            </div>
        </footer>
    )
}
