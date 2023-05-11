import * as React from "react"
import PostListingType from "../../../enums/PostListingType"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { FilterableAndSortablePostsWidget } from "../../utils/FilterableAndSortablePostsWidget/FilterableAndSortablePostsWidget"
import { Search } from "../../utils/search/Search"

export function Posts() {
    const totalPosts = 85
    return (
        <>
            <ColoredTitle title="📜 All Posts From All Time" />
            <p style={{ textAlign: "center" }}>
                Search all <b>{totalPosts}</b> posts!
            </p>
            <Search />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                }}
            >
            <FilterableAndSortablePostsWidget
                postListingType={PostListingType.ALL}
            />
            </div>
        </>
    )
}
