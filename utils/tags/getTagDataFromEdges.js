const generateTagURI = require("./generateTagURI")
const getSanitizedTagsFromEdges = require("./getSanitizedTagsFromEdges")
const getUniqueTagsFromEdges = require("./getUniqueTagsFromEdges")

const getTagDataFromEdges = (edges) => {

    const uniqueTags = getUniqueTagsFromEdges(edges);
    const allSanitizedTags = getSanitizedTagsFromEdges(edges);

    return uniqueTags.map((uniqueTag) => {
        const urlSafeTag = generateTagURI(uniqueTag)
        const matchingSanitizedTags = allSanitizedTags.filter((x) => x.sanitizedTag === uniqueTag)
        return {
            label: uniqueTag,
            link: urlSafeTag,
            count: matchingSanitizedTags.length,
            tagRegex: `/${matchingSanitizedTags.map(x => x.rawTag).join("|")}/`
        }
    })
}

module.exports = getTagDataFromEdges;