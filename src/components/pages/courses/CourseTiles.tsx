import * as React from "react"
import Constants from "../../../constants/Constants"
import { CourseTile } from "./CourseTile"

export function CourseTiles() {
    return (
        <>
            {Constants.GUMROAD_COURSE_PRODUCT_IDS.map((productID) => {
                return <CourseTile productID={productID} key={productID} />
            })}
        </>
    )
}
