import { IPost } from "../../components/utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget"

export interface IPostWithCleanCrudApisOrder {
    node: {
        excerpt: string
        fields: {
            slug: string
        },
        frontmatter: {
            title: string
            description: string
            tags: string
            date: string
            topPostOrder?: number
            cleanCrudApisOrder: number
        }
    }
}

export const isPostWithCleanCrudApisOrder = (post: IPost): post is IPostWithCleanCrudApisOrder => {
    return "cleanCrudApisOrder" in post.node.frontmatter;
}