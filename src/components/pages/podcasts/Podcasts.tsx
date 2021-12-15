import { Link } from "gatsby"
import * as React from "react"
import { ColoredTitle } from "../../utils/ColoredTitle"

export interface IPodcastsProps {}

export function Podcasts(props: IPodcastsProps) {
    return (
        <>
            <ColoredTitle title="🎙️ Podcasts" />
            <p>
                A likely overly-zealous page I've created in hopes that I'll be
                featured in many more podcasts throughout my career. Only time will tell!
            </p>
            <p>Here's all the podcasts I've been featured in:</p>
            <p>
                <a
                    href="https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5mZWVkd3JlbmNoLmNvbS9yZWFjdC1yb3VuZC11cC5yc3M/episode/YTM5ZmQ2NzUtMGI4OC00ZGZhLTg3YWItOTJmY2I4MTllYmFh"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    React Round Up 163: Modernizing Your React Apps with
                    TypeScript ft. Chris Frewin
                </a>
            </p>
            <p>
                React Round Up was the first developer podcast I've was ever
                asked to participate in! In this episode, I talk with Jack
                Herrington and Paige Niederinghaus about my efforts to upgrade a
                huge enterprise JavaScript codebase to a TypeScript one, as
                outlined in my post{" "}
                <Link to="/blog/converting-a-large-project-from-javascript-to-typescript/">
                    Converting a Large Create React App Project from JavaScript
                    to TypeScript
                </Link>
            </p>
        </>
    )
}
