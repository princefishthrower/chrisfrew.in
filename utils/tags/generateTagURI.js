const generateTagURI = (tag) => {
    const spaceRegex = /\s+/g
    const periodRegex = /\./g
    const hashTagRegex = /#/g
    const slashRegex = /\//g
    return `/tag/${tag.replace(periodRegex, '').replace(hashTagRegex, 'sharp').replace(slashRegex, '-').replace(spaceRegex, '-').toLowerCase().trim()}`
}
module.exports = generateTagURI;