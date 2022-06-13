import { IPost } from "../components/utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget"
import PostListingType from "../enums/PostListingType"
import { isPostWithCleanCrudApisOrder } from "./type-guards/isPostWithCleanCrudApisOrder"
import { isPostWithCleanReactTypeScriptHooksOrder } from "./type-guards/isPostWithCleanReactTypeScriptHooksOrder"
import { isPostWithTopPostOrder } from "./type-guards/isPostWithTopPostOrder"

export const applyPostListingTypeToPosts = (
    postListingType: PostListingType,
    allPosts: Array<IPost>
): Array<IPost> => {
    switch (postListingType) {
        case PostListingType.LATEST:
            const latestPost = allPosts
                .sort((a, b) => {
                    if (
                        new Date(a.node.frontmatter.date) >
                        new Date(b.node.frontmatter.date)
                    ) {
                        return -1
                    }
                    if (
                        new Date(a.node.frontmatter.date) <
                        new Date(b.node.frontmatter.date)
                    ) {
                        return 1
                    }
                    return 0
                })
                .slice(0, 1)
            return latestPost ? latestPost : []

        case PostListingType.RECENTS:
            const recentPosts = allPosts
                .sort((a, b) => {
                    if (
                        new Date(a.node.frontmatter.date) >
                        new Date(b.node.frontmatter.date)
                    ) {
                        return -1
                    }
                    if (
                        new Date(a.node.frontmatter.date) <
                        new Date(b.node.frontmatter.date)
                    ) {
                        return 1
                    }
                    return 0
                })
                .slice(1, 6)
            return recentPosts ? recentPosts : []
        case PostListingType.TOP:
            const postsWithTopPostOrder = allPosts.filter(
                isPostWithTopPostOrder
            )
            const postsWithDefinedTopPostOrder = postsWithTopPostOrder.filter(
                (post) => post.node.frontmatter.topPostOrder !== null
            )
            return postsWithDefinedTopPostOrder.sort((a, b) => {
                if (
                    a.node.frontmatter.topPostOrder >
                    b.node.frontmatter.topPostOrder
                ) {
                    return 1
                }
                if (
                    a.node.frontmatter.topPostOrder <
                    b.node.frontmatter.topPostOrder
                ) {
                    return -1
                }
                return 0
            })
        case PostListingType.CLEAN_REACT_TYPESCRIPT_HOOKS:
            const postsWithCleanReactTypeScriptHooks = allPosts.filter(
                isPostWithCleanReactTypeScriptHooksOrder
            )
            const postsWithDefinedCleanReactTypeScriptHooks = postsWithCleanReactTypeScriptHooks.filter(
                (post) =>
                    post.node.frontmatter.cleanReactTypeScriptHooksOrder !==
                    null
            )
            return postsWithDefinedCleanReactTypeScriptHooks.sort((a, b) => {
                if (
                    a.node.frontmatter.cleanReactTypeScriptHooksOrder >
                    b.node.frontmatter.cleanReactTypeScriptHooksOrder
                ) {
                    return 1
                }
                if (
                    a.node.frontmatter.cleanReactTypeScriptHooksOrder <
                    b.node.frontmatter.cleanReactTypeScriptHooksOrder
                ) {
                    return -1
                }
                return 0
            })
        case PostListingType.CLEAN_CRUD_APIS:
            const postsWithCleanCrudApis = allPosts.filter(
                isPostWithCleanCrudApisOrder
            )
            const postsWithDefinedCleanCrudApis = postsWithCleanCrudApis.filter(
                (post) => post.node.frontmatter.cleanCrudApisOrder !== null
            )
            return postsWithDefinedCleanCrudApis.sort((a, b) => {
                if (
                    a.node.frontmatter.cleanCrudApisOrder >
                    b.node.frontmatter.cleanCrudApisOrder
                ) {
                    return 1
                }
                if (
                    a.node.frontmatter.cleanCrudApisOrder <
                    b.node.frontmatter.cleanCrudApisOrder
                ) {
                    return -1
                }
                return 0
            })
        case PostListingType.CLEAN_FUNCTIONAL_TYPESCRIPT:
            throw new Error(
                "Not implemented: PostListingType.CLEAN_FUNCTIONAL_TYPESCRIPT"
            )
        case PostListingType.CLEAN_REACT_TYPESCRIPT:
            throw new Error(
                "Not implemented: PostListingType.CLEAN_REACT_TYPESCRIPT"
            )
        case PostListingType.ALL:
            return allPosts
        // default, throw invalid error
        default:
            throw new Error(
                "Invalid PostListingType passed to getQueryFromPostListingType"
            )
    }
}
