import * as React from "react"
import PostListingType from "../../../enums/PostListingType"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { FilterableAndSortablePostsWidget } from "../../utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget"

export function CleanReactTypeScriptHooks(

) {
    return (
        <>
            <ColoredTitle title="📜 Series: Clean React TypeScript Hooks" />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                }}
            >
                <FilterableAndSortablePostsWidget
                    postListingType={
                        PostListingType.CLEAN_REACT_TYPESCRIPT_HOOKS
                    }
                />
            </div>
        </>
    )
}
