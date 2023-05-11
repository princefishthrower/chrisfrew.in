export type PageData = {
    site: {
        siteMetadata: {
            title: string
            subtitle: string
            description: string
        }
    }
    allMdx: {
        edges: Array<{
            node: {
                excerpt: string
                frontmatter: {
                    title: string
                    date: string
                    tags: string
                }
            }
        }>
    }
}
