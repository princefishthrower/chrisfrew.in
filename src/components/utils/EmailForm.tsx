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
                <h3>Become a better developer.</h3>
                <p className="small"><b>Learn the methods of my full stack madness around all parts of the stack with my +10 years of diverse software experience!</b></p>
                <input
                    type="submit"
                    value="Subscribe!"
                    name="subscribe"
                    className="submit-button"
                />
            </form>
            <div
                className="small"
                style={{
                    textAlign: "center",
                    maxWidth: "960px",
                    margin: "0 auto",
                }}
            >
                <b>
                    My newsletter is{" "}
                    <span className="monokaiGreenFont">super simple: </span>
                </b>
                you'll get an email from me{" "}
                <span className="monokaiGreenFont">
                    <b>once every Wednesday at 7 AM EST (+5 UTC)</b>
                </span>{" "}
                only if there were new posts in the past week!{" "}
                <span className="monokaiRedFont">
                    I don't run annoying popups or marketing banners.
                </span>{" "}
                <span className="monokaiBlueFont">
                    This little form right here is the only way to subscribe.
                </span>{" "}
                If you decide to subscribe,{" "}
                <span className="monokaiGreenFont">
                    I sincerely hope you enjoy! ❤️
                </span>
            </div>
        </div>
    )
}
