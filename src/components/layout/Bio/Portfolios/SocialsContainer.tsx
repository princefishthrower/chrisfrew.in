import * as React from "react"

export function SocialsContainer() {
    return (
        <>
            <p className="text-center font-weight-bold">Socials</p>
            <div className="flex-container">
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://dev.to/frewinchristopher"
                >
                    DEV
                </a>
                 • 
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.producthunt.com/@galt_"
                >
                    Product Hunt
                </a>
                 • 
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.indiehackers.com/fullStackChris"
                >
                    Indie Hackers
                </a>
                 • 
                <a href="https://instagram.com/_chrisfrewin_" rel="me">
                    Instagram
                </a>
                 • 
                <a href="https://chrisfrewin.medium.com" rel="me">
                    Medium
                </a>
                 • 
                <a href="https://twitter.com/wheelscreener" rel="me">
                    Twitter
                </a>
                 • 
                <a href="https://github.com/princefishthrower" rel="me">
                    GitHub
                </a>
                 • 
                <a href="https://reddit.com/user/trollerroller" rel="me">
                    Reddit
                </a>
                 • 
                <a
                    className="u-email"
                    href="mailto:frewin.christopher@gmail.com"
                    rel="me"
                >
                    Email
                </a>
            </div>
        </>
    )
}
