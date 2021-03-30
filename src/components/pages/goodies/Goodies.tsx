import { Link } from "gatsby"
import * as React from "react"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"

export interface IGoodiesProps {}

export function Goodies(props: IGoodiesProps) {
    return (
        <>
            <h1 className="cooper">
                {colorizeStringBySeparator(
                    "Full Stack Downloadables, Freebies, N' More.",
                    ""
                )}
            </h1>
            <h2>A variety of downloads, freebies, and more!</h2>
            <div>
                <Link
                    to="/exports/full-stack-snippets.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; PDF - All Full Stack Snippets!
                </Link>
            </div>
            My snippet pdf is generated every time I post or update a snippet{" "}
            <Link to="/snippets">on the snippets page</Link>, so you can be sure
            it has the most up-to-date code in it! 👍
        </>
    )
}
