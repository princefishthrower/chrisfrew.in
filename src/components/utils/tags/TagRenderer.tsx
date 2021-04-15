import { useStaticQuery, graphql } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import { getActiveTheme } from "../../../utils/getActiveTheme"
import { getRandomInt } from "../../../utils/getRandomInt"
import { getUniqueTagsFromEdges } from "../../../utils/tags/getUniqueTagsFromEdges"
import { Tag } from "./Tag"

export interface ITagRendererProps {
    linkToTagPage: boolean
    tags?: string[]
}

// renders tags. if the 'tags' prop is provided, renders only those Tags
// otherwise renders all
export function TagRenderer(props: ITagRendererProps) {
    const { tags, linkToTagPage } = props
    const data = useStaticQuery(graphql`
        query AllTagsQuery {
            allMdx(
                sort: { fields: [frontmatter___date], order: DESC }
                limit: 1000
            ) {
                edges {
                    node {
                        frontmatter {
                            tags
                        }
                    }
                }
            }
        }
    `)
    const { themeBodyClass } = useContext(ThemeContext)
    const activeTheme = getActiveTheme(themeBodyClass)
    const hexColorsLength = activeTheme.themeColorHexCodes.length

    const uniqueTags = tags ? tags : getUniqueTagsFromEdges(data.allMdx.edges)
    const tagContainerClass = tags ? "tag-container-small" : "tag-container"
    const tagClassName = tags ? "tag-small" : "tag"
    const randomOffset = tags ? getRandomInt(hexColorsLength - 1) : 0

    // sort alphabetically before rendering
    uniqueTags.sort((a, b) => {
        const useA = a.replace(".", "")
        const useB = b.replace(".", "")
        if (useB > useA) {
            return -1
        }
        if (useA > useB) {
            return 1
        }
        return 0
    })

    return (
        <div className={tagContainerClass}>
            {uniqueTags.map((uniqueTag, index) => {
                const currentIndex = index + randomOffset
                const nextIndex = index + randomOffset + 1
                return (
                    <Tag
                        tag={uniqueTag}
                        linkToTagPage={linkToTagPage}
                        backgroundColor={
                            activeTheme.themeColorHexCodes[
                                ((currentIndex % hexColorsLength) +
                                    hexColorsLength) %
                                    hexColorsLength
                            ]
                        }
                        hoverBackgroundColor={
                            activeTheme.themeColorHexCodes[
                                ((nextIndex % hexColorsLength) +
                                    hexColorsLength) %
                                    hexColorsLength
                            ]
                        }
                        defaultColor={activeTheme.defaultHexColor}
                        tagClassName={tagClassName}
                    />
                )
            })}
        </div>
    )
}
