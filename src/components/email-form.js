import React from "react"

export default function EmailForm() {
    return (
        <div id="mc_embed_signup">
            <form
                action="https://chrisfrew.us19.list-manage.com/subscribe/post?u=5f7289fbe97df30f673068826&amp;id=b1729bbdce"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                class="validate"
                target="_blank"
                novalidate
            >
                <div id="mc_embed_signup_scroll">
                    <label className="label" htmlFor="mce-EMAIL">
                        Subscribe!
                    </label>
                    <input
                        type="email"
                        name="EMAIL"
                        class="email"
                        id="mce-EMAIL"
                        placeholder="awesome_dev@yourmail.com"
                        required
                    />
                    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                    <div
                        style={{ position: "absolute", left: "-5000px" }}
                        aria-hidden="true"
                    >
                        <input
                            type="text"
                            name="b_5f7289fbe97df30f673068826_b1729bbdce"
                            tabindex="-1"
                            value=""
                        />
                    </div>
                    <div class="clear">
                        <input
                            type="submit"
                            value="Submit"
                            name="subscribe"
                            id="mc-embedded-subscribe"
                            class="button"
                        />
                    </div>
                </div>
            </form>
            <span className="small">
                <span className="green-text"><b>I keep it super simple:</b></span> you'll get an email from me <span className="green-text"><b>once every Wednesday
                at 7 AM</b></span> if there were any new blog posts in the past week! I don't run annoying popups or marketing banners. This little form right here is the only way to subscribe.
                Thanks for subscribing!
            </span>
        </div>
    )
}
