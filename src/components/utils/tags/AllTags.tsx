import { useStaticQuery, graphql } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import { getActiveTheme } from "../../../utils/getActiveTheme"
import { getUniqueTagsFromEdges } from "../../../utils/tags/getUniqueTagsFromEdges"
import { Tag } from "./Tag"

export function AllTags() {
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
    const uniqueTags = getUniqueTagsFromEdges(data.allMdx.edges);

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
        <div className="tag-container">
            {uniqueTags.map((uniqueTag, index) => {
                const nextIndex = index + 1
                return (
                    <Tag
                        tag={uniqueTag}
                        linkToTagPage={true}
                        backgroundColor={
                            activeTheme.themeColorHexCodes[
                                ((index % hexColorsLength) + hexColorsLength) %
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
                    />
                )
            })}
        </div>
    )
}
