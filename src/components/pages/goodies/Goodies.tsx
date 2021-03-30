import { Link } from "gatsby"
import * as React from "react"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"

export interface IGoodiesProps {}

export function Goodies(props: IGoodiesProps) {
    return (
        <>
            <h1 className="cooper big">
                {colorizeStringBySeparator(
                    "Full Stack Downloadables, Freebies, N' More.",
                    ""
                )}
            </h1>
            <h2>A variety of downloads, freebies, and more!</h2>
            <div>
                <a
                    href="/exports/full-stack-snippets.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; PDF - All Full Stack Snippets!
                </a>
            </div>
            My snippet pdf is generated every time I post or update a snippet{" "}
            <Link to="/snippets">on the snippets page</Link>, so you can be sure
            it has the most up-to-date code in it! 👍
        </>
    )
}
