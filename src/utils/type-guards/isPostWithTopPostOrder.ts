import { IPost } from "../../components/utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget";

export interface IPostWithTopPostOrder {
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
            topPostOrder: number
            cleanReactTypeScriptHooksOrder?: number
        }
    }
}

export const isPostWithTopPostOrder = (post: IPost): post is IPostWithTopPostOrder => {
    return "topPostOrder" in post.node.frontmatter;
}