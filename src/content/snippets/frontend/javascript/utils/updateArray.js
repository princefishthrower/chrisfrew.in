export const updateArray = (options) => {
    const {
        array,
        testKey,
        testValue,
        updateKey,
        updateValue,
        testFailValue,
    } = options
    return array.map((item) => {
        if (item[testKey] === testValue) {
            item[updateKey] = updateValue
        } else if (testFailValue !== undefined) {
            item[updateKey] = testFailValue
        }
        return item
    })
}
