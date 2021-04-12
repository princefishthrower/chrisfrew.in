import * as React from "react"

export interface ICourseTileProps {
    productID: string
}

export function CourseTile(props: ICourseTileProps) {
    const { productID } = props

    if (typeof window !== "undefined") {
        return (
            <iframe
                allowFullScreen={true}
                className="gumroad-embed-iframe"
                scrolling="no"
                width="100%"
                height="1410px"
                id={`gumroad-embed-iframe-${productID}`}
                src={`https://gumroad.com/l/${productID}?null&&as_embed=true&referrer=&origin=${window.location.origin}`}
            />
        )
    }
    return <></>
}
