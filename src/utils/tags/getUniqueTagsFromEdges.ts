import { getSanitizedTagsFromEdges } from "./getSanitizedTagsFromEdges"

export const getUniqueTagsFromEdges = (edges) => {
    const sanitizedTags = getSanitizedTagsFromEdges(edges)
    return sanitizedTags.map(x => x.sanitizedTag).filter((value, index, self) => {
        return self.indexOf(value) === index
    })
}
