import ITagData from "../../interfaces/ITagData";
import { generateTagURI } from "./generateTagURI"
import { getSanitizedTagsFromEdges } from "./getSanitizedTagsFromEdges";
import { getUniqueTagsFromEdges } from "./getUniqueTagsFromEdges"

export const getTagDataFromEdges = (edges: any): Array<ITagData> => {

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