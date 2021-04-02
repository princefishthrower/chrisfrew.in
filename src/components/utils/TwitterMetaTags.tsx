import * as React from "react"

export interface ITwitterMetaTagsProps {
    author: string
    description: string
}

export function TwitterMetaTags(props: ITwitterMetaTagsProps) {
    const { author, description } = props;
    return (
        <>
            <meta
                name="twitter:card"
                content="A professional software engineering blog."
            />
            <meta name="twitter:site" content="https://chrisfrew.in" />
            <meta name="twitter:title" content="Chris' Full Stack Blog" />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:creator" content={author} />
            {/* Note: on the digital ocean droplet! */}
            <meta name="twitter:image" content="https://coffee-app.sfo2.cdn.digitaloceanspaces.com/chrisfrew.in/twitter.png" />
        </>
    )
}
