import * as React from "react"
import PostListingType from "../../../enums/PostListingType"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { FilterableAndSortablePostsWidget } from "../../utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget"

export function CleanCrudApis(

) {
    return (
        <>
            <ColoredTitle title="📜 Series: Clean CRUD APIs" />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                }}
            >
                <FilterableAndSortablePostsWidget
                    postListingType={
                        PostListingType.CLEAN_CRUD_APIS
                    }
                />
            </div>
        </>
    )
}
