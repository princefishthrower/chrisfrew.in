export const generateTagURI = (tag: string): string => {
    return `/tag/${tag.replace('.', '').replace('#', '').replace(' ', '-').toLowerCase().trim()}`
}