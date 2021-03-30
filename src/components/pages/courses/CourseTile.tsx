import * as React from "react"

export interface ICourseTileProps {
    productID: string
}

export function CourseTile(props: ICourseTileProps) {
    const { productID } = props
    return (
        <div
            className="gumroad-product-embed"
            data-gumroad-product-id={productID}
        >
            <a href={`https://gumroad.com/l/${productID}`}>Loading...</a>
        </div>
    )
}
