import React from "react"

export default function EmailForm() {
    return (
        <div className="pre-footer">
            <form
                action="https://chrisfrew.us19.list-manage.com/subscribe/post?u=5f7289fbe97df30f673068826&amp;id=b1729bbdce"
                method="post"
                target="_blank"
                noValidate
                className="email-form"
            >
                {/* <label className="email-label">Subscribe!</label> */}
                {/* <input
                    type="email"
                    placeholder="awesome_dev@yourmail.com"
                    required
                    className="email-input"
                /> */}
                {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                <div
                    style={{ position: "absolute", left: "-5000px" }}
                    aria-hidden="true"
                >
                    <input
                        type="text"
                        name="b_5f7289fbe97df30f673068826_b1729bbdce"
                        tabIndex={-1}
                        defaultValue=""
                    />
                </div>
                <input
                    type="submit"
                    value="Subscribe to Blog Updates!"
                    name="subscribe"
                    className="submit-button"
                />
            </form>
            <div className="small" style={{ textAlign: "center", maxWidth: "960px", margin: "0 auto" }}>
                <span className="monokaiGreenFont">
                    <b>I keep it super simple:</b>
                </span>{" "}
                you'll get an email from this blog{" "}
                <span className="monokaiGreenFont">
                    <b>once every Wednesday at 7 AM EST (+5 UTC)</b>
                </span>{" "}
                if there were any new blog posts in the past week!{" "}
                <span className="monokaiRedFont">
                    I don't run annoying popups or marketing banners.
                </span>{" "}
                <span className="monokaiBlueFont">
                    This little form right here is the only way to subscribe.
                </span>{" "}
                If you decide to subscribe,{" "}
                <span className="monokaiGreenFont">
                I sincerly hope you enjoy! ❤️</span>
            </div>
        </div>
    )
}
