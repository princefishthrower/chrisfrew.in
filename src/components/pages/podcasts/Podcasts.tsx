import React from "react"
import { Link } from "gatsby"
import { ColoredTitle } from "../../utils/ColoredTitle"

export function Podcasts() {
    return (
        <>
            <ColoredTitle title="🎙️ Podcasts" />
            <p>
                A likely overly-zealous page I've created in hopes that I'll be
                featured in many more podcasts throughout my career. Only time
                will tell!
            </p>
            <p>Here's all the podcasts I've been featured in:</p>
            <h2 style={{ textDecoration: "underline" }}>
                <a
                    href="https://topenddevs.com/podcasts/react-round-up/episodes/4096"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    React Round Up 196: Gherkin with Chris Frewin from InClub
                </a>
            </h2>
            <p>
                I was invited back again at React Round Up! In this episode, I
                talk with Jack Herrington, Paige Niedringhaus, and TJ Van Toll
                about my efforts to build a testing infrastructure for InClub,
                the social experience sharing and meetup startup I currently
                work at. Relevant posts include{" "}
                <Link to="/blog/one-year-as-chief-technology-officer-at-inclub-insights-from-startup-land/">
                    One Year as the Chief Technology Officer at InClub
                </Link>
                {" and "}
                <Link to="/blog/advanced-design-patterns-the-case-for-one-function-per-file/">
                    Advanced Code Organization Patterns: The Case For One
                    Function Per File
                </Link>
                .
            </p>
            <h2 style={{ textDecoration: "underline" }}>
                <a
                    href="https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5mZWVkd3JlbmNoLmNvbS9yZWFjdC1yb3VuZC11cC5yc3M/episode/YTM5ZmQ2NzUtMGI4OC00ZGZhLTg3YWItOTJmY2I4MTllYmFh"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    React Round Up 163: Modernizing Your React Apps with
                    TypeScript ft. Chris Frewin
                </a>
            </h2>
            <p>
                React Round Up was the first developer podcast I've was ever
                asked to participate in! In this episode, I talk with Jack
                Herrington and Paige Niedringhaus about my efforts to upgrade a
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
