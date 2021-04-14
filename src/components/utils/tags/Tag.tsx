import { Link } from "gatsby"
import * as React from "react"
import { useState } from "react"
import { generateTagURI } from "../../../utils/tags/generateTagURI"

export interface ITagRendererProps {
    tag: string
    linkToTagPage: boolean
    backgroundColor: string
    hoverBackgroundColor: string
    defaultColor: string
}

export function Tag(props: ITagRendererProps) {
    const { tag, linkToTagPage, backgroundColor, hoverBackgroundColor, defaultColor } = props
    const [isHover, setIsHover] = useState<boolean>(false)
    if (!tag) {
        return <></>
    }
    const link = generateTagURI(tag)
    const style = isHover
        ? { color: hoverBackgroundColor, backgroundColor: defaultColor, borderColor: hoverBackgroundColor, borderWidth: '3px', padding: '0.45rem', margin: '.05rem' }
        : { color: defaultColor, backgroundColor, borderColor: backgroundColor, borderWidth: '3px' }
    if (linkToTagPage) {
        return (
            <Link
                to={link}
                className="tag"
                style={style}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {tag}
            </Link>
        )
    }
    return <div className="tag">{tag}</div>
}
