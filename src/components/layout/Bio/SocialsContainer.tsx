import * as React from "react"

export interface ISocialsContainerProps {}

export function SocialsContainer(props: ISocialsContainerProps) {
    return (
        <div className="socials-container">
            <a href="https://instagram.com/_chrisfrewin_" rel="me">
                Instagram
            </a>
            &nbsp; | &nbsp;
            <a href="https://chrisfrewin.medium.com" rel="me">
                Medium
            </a>
            &nbsp; | &nbsp;
            <a href="https://twitter.com/Galt_" rel="me">
                Twitter
            </a>
            &nbsp; | &nbsp;
            <a href="https://github.com/princefishthrower" rel="me">
                GitHub
            </a>
            &nbsp; | &nbsp;
            <a href="https://reddit.com/user/trollerroller" rel="me">
                Reddit
            </a>
            &nbsp; | &nbsp;
            <a
                className="u-email"
                href="mailto:frewin.christopher@gmail.com"
                rel="me"
            >
                Email
            </a>
        </div>
    )
}
