import { Link } from "gatsby"
import * as React from "react"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"
import { SnippetToggler } from "./SnippetToggler"

// special raw-loader requires - pulls in file as string
const useDidMountTS = require("!!raw-loader!../../../content/snippets/frontend/typescript/hooks/useDidMount.ts")
const useDidMountJS = require("!!raw-loader!../../../content/snippets/frontend/javascript/hooks/useDidMount.js")

const sendSlackMessageFrontendTS = require("!!raw-loader!../../../content/snippets/frontend/typescript/utils/sendSlackMessage.ts")
const sendSlackMessageFrontendJS = require("!!raw-loader!../../../content/snippets/frontend/javascript/utils/sendSlackMessage.js")

const sendSlackMessageBackendTS = require("!!raw-loader!../../../content/snippets/backend/node/typescript/utils/sendSlackMessage.ts")
const sendSlackMessageBackendJS = require("!!raw-loader!../../../content/snippets/backend/node/javascript/utils/sendSlackMessage.js")

export interface ISnippetsProps {
    pdfMode: boolean
}

export function Snippets(props: ISnippetsProps) {
    const { pdfMode } = props
    const title = "Full Stack Snippets."
    const titleText = pdfMode
        ? title
        : colorizeStringBySeparator(title, "")
    return (
        <>
            <h1 className="cooper big">{titleText}</h1>
            {pdfMode && <p>😁 PDF Mode! 😁</p>}
            {!pdfMode && (
                <>
                    <h2>
                        A variety of code snippets, from backend to frontend,
                        written in a&nbsp;
                        {colorizeStringBySeparator(
                            "clean-as-I-can-make-it",
                            "-"
                        )}{" "}
                        style, ready for you to copy and paste wherever you may
                        need them.
                    </h2>
                    <p>
                        Check out the{" "}
                        <Link to="/goodies">Full Stack Goodies page</Link> for a
                        full PDF of these snippets, organized by language and
                        level of the stack you would use them.
                    </p>
                    <p>
                        For TypeScript snippets, be sure to check out the
                        magical JavaScript switch if you would like the snippet
                        in vanilla JavaScript.
                    </p>
                </>
            )}
            <h2>Client</h2>
            <SnippetToggler
                snippetLabel="useDidMount()"
                fileLabels={["useDidMount.ts", "useDidMount.js"]}
                typeScriptCode={useDidMountTS.default.toString()}
                javaScriptCode={useDidMountJS.default.toString()}
                pdfMode={pdfMode}
            />
            <SnippetToggler
                snippetLabel="sendSlackMessage()"
                fileLabels={["sendSlackMessage.ts", "sendSlackMessage.js"]}
                typeScriptCode={sendSlackMessageFrontendTS.default.toString()}
                javaScriptCode={sendSlackMessageFrontendJS.default.toString()}
                pdfMode={pdfMode}
            />
            <h2>Backend</h2>
            <h3>JavaScript (Node.js)</h3>
            <SnippetToggler
                snippetLabel="sendSlackMessage()"
                fileLabels={["sendSlackMessage.ts", "sendSlackMessage.js"]}
                typeScriptCode={sendSlackMessageBackendTS.default.toString()}
                javaScriptCode={sendSlackMessageBackendJS.default.toString()}
                pdfMode={pdfMode}
            />
            <h3>C# (.NET)</h3>
        </>
    )
}
