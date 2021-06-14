export const mergeArrays = <T, U extends T>(params: {
    mergeArray: Array<T>
    existingArray: Array<U>
    matchKey: keyof T
}): Array<U> => {
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
