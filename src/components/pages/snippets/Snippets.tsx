import { Link } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/ThemeContext"
import URLSearchParamKey from "../../../enums/URLSearchParamKey"
import URLSearchParamValue from "../../../enums/URLSearchParamValue"
import { useSearchParam } from "../../../hooks/useSearchParam"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"
import { SnippetToggler } from "./SnippetToggler"

// special raw-loader requires - pulls in file as string
const useDidMountTS = require("!!raw-loader!../../../content/snippets/frontend/typescript/hooks/useDidMount.ts")
const useDidMountJS = require("!!raw-loader!../../../content/snippets/frontend/javascript/hooks/useDidMount.js")

const sendSlackMessageFrontendTS = require("!!raw-loader!../../../content/snippets/frontend/typescript/utils/sendSlackMessage.ts")
const sendSlackMessageFrontendJS = require("!!raw-loader!../../../content/snippets/frontend/javascript/utils/sendSlackMessage.js")

const sendSlackMessageBackendTS = require("!!raw-loader!../../../content/snippets/backend/node/typescript/utils/sendSlackMessage.ts")
const sendSlackMessageBackendJS = require("!!raw-loader!../../../content/snippets/backend/node/javascript/utils/sendSlackMessage.js")

const patchFiltererService = require("!!raw-loader!../../../content/snippets/backend/csharp/dotnet/utils/PatchFiltererService.cs")

const buildColorPromptBash = require("!!raw-loader!../../../content/snippets/devops/bash/buildColorPrompt.sh")
const buildColorPromptZsh = require("!!raw-loader!../../../content/snippets/devops/zsh/buildColorPrompt.sh")

export interface ISnippetsProps {
    pdfMode: boolean
}

export function Snippets(props: ISnippetsProps) {
    const { pdfMode } = props
    const { themeBodyClass } = useContext(ThemeContext)
    const title = "👩‍💻👨‍💻 Full Stack Snippets."
    const titleText = pdfMode ? title : colorizeStringBySeparator(themeBodyClass, title, "")
    const languageFilter = pdfMode
        ? useSearchParam(URLSearchParamKey.LANGUAGE_FILTER)
        : URLSearchParamValue.ALL

    return (
        <>
            <h1 className="cooper big">{titleText}</h1>
            {!pdfMode && (
                <>
                    <h2>
                        A variety of code snippets, from backend to frontend,
                        written in a&nbsp;
                        {colorizeStringBySeparator(
                            themeBodyClass,
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
            {languageFilter === URLSearchParamValue.ALL && <h2>Client</h2>}
            {(languageFilter === URLSearchParamValue.ALL ||
                languageFilter === URLSearchParamValue.TYPESCRIPT ||
                languageFilter === URLSearchParamValue.JAVASCRIPT) && (
                <>
                    <SnippetToggler
                        snippetLabel="useDidMount()"
                        fileLabels={["useDidMount.ts", "useDidMount.js"]}
                        typeScriptCode={useDidMountTS.default.toString()}
                        javaScriptCode={useDidMountJS.default.toString()}
                        pdfMode={pdfMode}
                        languageFilter={languageFilter}
                    />
                    <SnippetToggler
                        snippetLabel="sendSlackMessage()"
                        fileLabels={[
                            "sendSlackMessage.ts",
                            "sendSlackMessage.js",
                        ]}
                        typeScriptCode={sendSlackMessageFrontendTS.default.toString()}
                        javaScriptCode={sendSlackMessageFrontendJS.default.toString()}
                        pdfMode={pdfMode}
                        languageFilter={languageFilter}
                    />
                </>
            )}
            {languageFilter === URLSearchParamValue.ALL && <h2>Backend</h2>}
            {languageFilter === URLSearchParamValue.ALL && <h3>JavaScript (Node.js)</h3>}
            {(languageFilter === URLSearchParamValue.ALL ||
                languageFilter === URLSearchParamValue.NODE) && (
                <SnippetToggler
                    snippetLabel="sendSlackMessage()"
                    fileLabels={["sendSlackMessage.ts", "sendSlackMessage.js"]}
                    typeScriptCode={sendSlackMessageBackendTS.default.toString()}
                    javaScriptCode={sendSlackMessageBackendJS.default.toString()}
                    pdfMode={pdfMode}
                />
            )}
            {languageFilter === URLSearchParamValue.ALL && <h3>C#</h3>}
            {(languageFilter === URLSearchParamValue.ALL ||
                languageFilter === URLSearchParamValue.CSHARP) && (
                <SnippetToggler
                    snippetLabel="PatchFiltererService"
                    fileLabels={["PatchFiltererService.cs"]}
                    otherCode={patchFiltererService.default.toString()}
                    otherLanguage="csharp"
                    pdfMode={pdfMode}
                />
            )}
            {languageFilter === URLSearchParamValue.ALL && <h2>Devops</h2>}
            {(languageFilter === URLSearchParamValue.ALL ||
                languageFilter === URLSearchParamValue.SHELL) && (
                <>
                    <h3>Bash</h3>
                    <SnippetToggler
                        snippetLabel="buildColorPrompt()"
                        fileLabels={["buildColorPrompt.sh"]}
                        otherCode={buildColorPromptBash.default.toString()}
                        otherLanguage="bash"
                        pdfMode={pdfMode}
                    />
                    <h3>zsh</h3>
                    <SnippetToggler
                        snippetLabel="buildColorPrompt()"
                        fileLabels={["buildColorPrompt.sh"]}
                        otherCode={buildColorPromptZsh.default.toString()}
                        otherLanguage="bash"
                        pdfMode={pdfMode}
                    />
                </>
            )}
        </>
    )
}
