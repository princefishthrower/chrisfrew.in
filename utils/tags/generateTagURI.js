const generateTagURI = (tag) => {
    return `/tag/${tag.replace('.', '').replace('#', '').replace(' ', '-').toLowerCase().trim()}`
}
module.exports = generateTagURI;