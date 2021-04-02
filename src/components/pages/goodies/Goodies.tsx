import { Link } from "gatsby"
import * as React from "react"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"

export function Goodies() {
    return (
        <>
            <h1 className="cooper big">
                {colorizeStringBySeparator(
                    "Full Stack Downloadables, Freebies, N' More.",
                    ""
                )}
            </h1>
            <h2>A variety of downloads, freebies, and more!</h2>
            <p>Full Stack Snippets as a PDF.</p>
            <div>
                <a
                    href="/exports/full-stack-snippets-all.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; All Full Stack Snippets!
                </a>
            </div>
            {/* TODO: use a query string on the snippets page to filter which parts are shown, then refactor the puppeteer script for that */}
            <p>Looking for a specific set of my snippets? Here they are:</p>
            <div>
                <a
                    href="/exports/full-stack-snippets-typescript.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; Full Stack Snippets - TypeScript Only!
                </a>
            </div>
            <div>
                <a
                    href="/exports/full-stack-snippets-javascript.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; Full Stack Snippets - JavaScript Only!
                </a>
            </div>
            <div>
                <a
                    href="/exports/full-stack-snippets-csharp.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; Full Stack Snippets - C# Only!
                </a>
            </div>
            <div>
                <a
                    href="/exports/full-stack-snippets-shell.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; Full Stack Snippets - Shell Scripts (so far bash and zsh) Only!
                </a>
            </div>
            These snippet PDFs are generated every time I post or update a snippet{" "}
            <Link to="/snippets">on the snippets page</Link>, so you can be sure
            it has the most up-to-date code in it! 👍
        </>
    )
}
