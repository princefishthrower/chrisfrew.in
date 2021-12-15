import { IPost } from "../../components/utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget";

export interface IPostWithCleanReactTypeScriptHooksOrder {
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
            cleanReactTypeScriptHooksOrder: number
        }
    }
}

export const isPostWithCleanReactTypeScriptHooksOrder = (post: IPost): post is IPostWithCleanReactTypeScriptHooksOrder => {
    return "cleanReactTypeScriptHooksOrder" in post.node.frontmatter;
}