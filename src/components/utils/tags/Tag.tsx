import { Link } from "gatsby"
import * as React from "react"
import { useState } from "react"
import BlogTagClass from "../../../enums/BlogTagClass"
import { generateTagURI } from "../../../utils/tags/generateTagURI"

export interface ITagProps {
    tag: string
    linkToTagPage: boolean
    backgroundColor: string
    hoverBackgroundColor: string
    defaultColor: string
    tagClassName: string
}

export function Tag(props: ITagProps) {
    const { tag, linkToTagPage, backgroundColor, hoverBackgroundColor, defaultColor, tagClassName } = props
    const [isHover, setIsHover] = useState<boolean>(false)
    if (!tag) {
        return <></>
    }
    const link = generateTagURI(tag)

    const getStyle = () => {
        if (tagClassName === BlogTagClass.BLOG_TAG_SMALL) {
            return isHover
            ? { color: hoverBackgroundColor, backgroundColor: defaultColor, borderColor: hoverBackgroundColor }
            : { color: defaultColor, backgroundColor, borderColor: backgroundColor }
        }
        return isHover
        ? { color: hoverBackgroundColor, backgroundColor: defaultColor, borderColor: hoverBackgroundColor, borderWidth: '3px', padding: '0.45rem', margin: '.05rem' }
        : { color: defaultColor, backgroundColor, borderColor: backgroundColor, borderWidth: '3px' }
    }

    const style = getStyle()
    if (linkToTagPage) {
        return (
            <Link
                to={link}
                className={tagClassName}
                style={style}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {tag}
            </Link>
        )
    }
    return <div className={tagClassName}>{tag}</div>
}
