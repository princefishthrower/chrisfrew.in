import React, { useEffect, useState } from "react"
import Sparkles from "./Sparkles"

export default function LinkPreview(props) {
    const { url, fallbackTitle } = props
    const [preview, setPreview] = useState({
        isLoading: true,
        title: "",
        description: "",
        image: "",
        url,
    })

    const getHostName = url => {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
        if (
            match != null &&
            match.length > 2 &&
            typeof match[2] === "string" &&
            match[2].length > 0
        ) {
            return match[2]
        } else {
            return null
        }
    }

    const fetchSiteData = async () => {
        console.log(process.env)
        try {
            const response = await fetch(
                `http://api.linkpreview.net/?key=${process.env.GATSBY_LINK_PREVIEW_API_KEY}&q=${url}`
            )
            const data = await response.json()
            setPreview({ ...data, isLoading: false })
        } catch (error) {
            console.log(error)
            setPreview({
                ...preview,
                isLoading: false,
            })
        }
    }

    useEffect(() => {
        if (preview.isLoading) {
            fetchSiteData()
        }
    })

    if (preview.isLoading) {
        return (
            <div style={{ textAlign: "center" }}>
                <Sparkles>Loading...</Sparkles>
            </div>
        )
    }

    if (preview.title && preview.description && preview.url && preview.image) {
        // shorten description so it looks nice
        const maxLength = 150;
        const description = preview.description.length > maxLength ? `${preview.description.substring(0, maxLength)}...` : preview.description
        return (
            <a className="plain-link" href={url}>
                <div className="linkPreviewWrapper">
                    <div className="col-left">
                        <div className="text-container">
                            <p className="title">
                                <b>{preview.title}</b>
                            </p>
                            <p className="description">{description}</p>
                            <p className="url">{getHostName(preview.url)}</p>
                        </div>
                    </div>
                    <div className="col-right">
                        <img src={preview.image} alt={preview.title} />
                    </div>
                </div>
            </a>
        )
    }

    return (
        <>
            <a className="plain-link" href={url}>
                {fallbackTitle}
            </a>
            <br />
        </>
    )
}
