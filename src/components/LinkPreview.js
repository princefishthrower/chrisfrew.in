import React, { useEffect, useState } from "react"
import Sparkles from "./Sparkles"
import Config from "../config/Config.json"

export default function LinkPreview(props) {
    const { url, fallbackTitle, fallbackDescription, fallbackImage } = props
    const [preview, setPreview] = useState({
        isLoading: true,
        title: "",
        description: "",
        image: "",
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
        try {
            const response = await fetch(
                `${Config.CHRISFREW_IN_API_URL}LinkPreview?url=${url}`
            )
            const data = await response.json()
            setPreview({ ...data, isLoading: false })
        } catch (error) {
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

    const renderData =
        preview.title && preview.description && preview.image
            ? { ...preview }
            : {
                  title: fallbackTitle,
                  description: fallbackDescription,
                  image: fallbackImage,
              }

    // shorten description so it looks nice
    const maxLength = 150
    const description =
        renderData.description.length > maxLength
            ? `${renderData.description.substring(0, maxLength)}...`
            : renderData.description
    return (
        <a className="plain-link" href={url}>
            <div className="linkPreviewWrapper">
                <div className="col-left">
                    <div className="text-container">
                        <p className="title">
                            <b>{renderData.title}</b>
                        </p>
                        <p className="description">{description}</p>
                        <p className="url">{getHostName(url)}</p>
                    </div>
                </div>
                <div className="col-right">
                    <img src={renderData.image} alt={renderData.title} />
                </div>
            </div>
        </a>
    )
}
