import * as React from "react"
import PostListingType from "../../../enums/PostListingType"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { FilterableAndSortablePostsWidget } from "../../utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget"

export interface ICleanReactTypeScriptHooksProps {}

export function CleanReactTypeScriptHooks(
    props: ICleanReactTypeScriptHooksProps
) {
    return (
        <>
            <ColoredTitle title="📜 Series: Clean React TypeScript Hooks" />
            <FilterableAndSortablePostsWidget
                postListingType={PostListingType.CLEAN_REACT_TYPESCRIPT_HOOKS}
            />
        </>
    )
}
