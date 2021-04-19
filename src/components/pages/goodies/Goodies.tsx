import { Link } from "gatsby"
import * as React from "react"
import { ColoredTitle } from "../../utils/ColoredTitle"

export function Goodies() {
    return (
        <>
            <ColoredTitle title="🎉 Full Stack Downloadables, Freebies, N' More"/>
            <h2>A variety of downloads, freebies, and more.</h2>
            <p>Multi-lesson course previews of my Full Stack Courses:</p>
            <div>
                <a
                    href="https://www.youtube.com/playlist?list=PLOX_mQri1cCkC1FvLGjIH_9Sx0sZeTEVq"
                    className="button-as-link"
                    download
                >
                    📝 &nbsp; Build Your Personal Blog Website with Gatsby JS
                </a>
            </div>
            <div>
                <a
                    href="https://www.youtube.com/playlist?list=PLOX_mQri1cCla7Y_eVCSwZtNjzzxyrlSf"
                    className="button-as-link"
                    download
                >
                    📝 &nbsp; Mastering Bitbucket Pipelines for CI and CD
                </a>
            </div>
            <div>
                <a
                    href="https://www.youtube.com/playlist?list=PLOX_mQri1cCleaUEI_k2qDaWFpnA7wW0z"
                    className="button-as-link"
                    download
                >
                    📝 &nbsp; Advanced TypeScript: Generic Search, Sorting, and Filtering
                </a>
            </div>
            <div>
                <a
                    href="https://www.youtube.com/playlist?list=PLOX_mQri1cCkTl69-eicUahOPEai7iOp1"
                    className="button-as-link"
                    download
                >
                    📝 &nbsp; Bash Commands and Scripting - From Beginner to Expert
                </a>
            </div>
            <p>Full Stack Snippets as a PDF.</p>
            <div>
                <a
                    href="/exports/full-stack-snippets-all.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; Full Stack Snippets
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
                    📜 &nbsp; Full Stack Snippets - TypeScript Only
                </a>
            </div>
            <div>
                <a
                    href="/exports/full-stack-snippets-javascript.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; Full Stack Snippets - JavaScript Only
                </a>
            </div>
            <div>
                <a
                    href="/exports/full-stack-snippets-csharp.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; Full Stack Snippets - C# Only
                </a>
            </div>
            <div>
                <a
                    href="/exports/full-stack-snippets-shell.pdf"
                    className="button-as-link"
                    download
                >
                    📜 &nbsp; Full Stack Snippets - Shell Only (so far only bash
                    and zsh)
                </a>
            </div>
            These snippet PDFs are generated every time I post or update a
            snippet <Link to="/snippets">on the snippets page</Link>, so you can
            be sure it has the most up-to-date code in it. 👍
        </>
    )
}
