const getSanitizedTagsFromEdges = require("./getSanitizedTagsFromEdges");

const getUniqueTagsFromEdges = (edges) => {
    const sanitizedTags = getSanitizedTagsFromEdges(edges)
    return sanitizedTags.map(x => x.sanitizedTag).filter((value, index, self) => {
        return self.indexOf(value) === index
    })
}

module.exports = getUniqueTagsFromEdges