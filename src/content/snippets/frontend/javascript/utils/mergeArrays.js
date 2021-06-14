export const mergeArrays = (params) => {
    const { mergeArray, existingArray, matchKey } = params
    return existingArray.map((existingItem) => {
        const match = mergeArray.find(
            (mergeItem) => mergeItem[matchKey] === existingItem[matchKey]
        )
        if (match) {
            return Object.assign(existingItem, match)
        }
        return existingItem
    })
}
