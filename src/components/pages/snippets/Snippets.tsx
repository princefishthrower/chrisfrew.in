import { Link } from "gatsby"
import * as React from "react"
import { useContext } from "react"
import { ThemeContext } from "../../../context/theme/ThemeContext"
import URLSearchParamKey from "../../../enums/URLSearchParamKey"
import URLSearchParamValue from "../../../enums/URLSearchParamValue"
import { useSearchParam } from "../../../hooks/useSearchParam"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { SnippetToggler } from "./SnippetToggler"

// special raw-loader requires - pulls in file as string
const useDidMountTS = require("!!raw-loader!../../../content/snippets/frontend/typescript/hooks/useDidMount.ts")
const useDidMountJS = require("!!raw-loader!../../../content/snippets/frontend/javascript/hooks/useDidMount.js")
const useDidMountUsage = require("!!raw-loader!../../../content/snippets/usage/frontend/shared/hooks/useDidMountUsage.tsx")

const sendSlackMessageFrontendTS = require("!!raw-loader!../../../content/snippets/frontend/typescript/utils/sendSlackMessage.ts")
const sendSlackMessageFrontendJS = require("!!raw-loader!../../../content/snippets/frontend/javascript/utils/sendSlackMessage.js")
const sendSlackMessageBackendTS = require("!!raw-loader!../../../content/snippets/backend/node/typescript/utils/sendSlackMessage.ts")
const sendSlackMessageBackendJS = require("!!raw-loader!../../../content/snippets/backend/node/javascript/utils/sendSlackMessage.js")
const sendSlackMessageUsage = require("!!raw-loader!../../../content/snippets/usage/shared/sendSlackMessageUsage.ts")

const sendSlackMessageBash = require("!!raw-loader!../../../content/snippets/devops/bash/sendSlackMessage.sh")
const sendSlackMessageUsageBash = require("!!raw-loader!../../../content/snippets/usage/devops/bash/sendSlackMessageUsage.sh")

const patchFiltererService = require("!!raw-loader!../../../content/snippets/backend/csharp/dotnet/utils/PatchFiltererService.cs")
const patchFiltererServiceUsage = require("!!raw-loader!../../../content/snippets/usage/backend/csharp/dotnet/utils/PatchFiltererServiceUsage.cs")

const buildColorPromptBash = require("!!raw-loader!../../../content/snippets/devops/bash/buildColorPrompt.sh")
const buildColorPromptUsageBash = require("!!raw-loader!../../../content/snippets/usage/devops/bash/buildColorPromptUsage.sh")
const buildColorPromptZsh = require("!!raw-loader!../../../content/snippets/devops/zsh/buildColorPrompt.sh")
const buildColorPromptUsageZsh = require("!!raw-loader!../../../content/snippets/usage/devops/zsh/buildColorPromptUsage.sh")

export interface ISnippetsProps {
    pdfMode: boolean
}

export function Snippets(props: ISnippetsProps) {
    const { pdfMode } = props
    const { themeBodyClass } = useContext(ThemeContext)
    const title = pdfMode ? "Full Stack Snippets." : "👩‍💻👨‍💻 Full Stack Snippets."
    const languageFilter = pdfMode
        ? useSearchParam(URLSearchParamKey.LANGUAGE_FILTER)
        : URLSearchParamValue.ALL
    const titleComponent = pdfMode ? (
        <>
        <h1 className="big monospace">{title}</h1>
        <p>From <a href="https://chrisfrew.in">Chris' Full Stack Blog</a>.</p>
        </>
    ) : (
        <ColoredTitle title={title} />
    )
    return (
        <>
            {titleComponent}
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
            {languageFilter === URLSearchParamValue.ALL && <h2><u>Client</u></h2>}
            {(languageFilter === URLSearchParamValue.ALL ||
                languageFilter === URLSearchParamValue.TYPESCRIPT ||
                languageFilter === URLSearchParamValue.JAVASCRIPT) && (
                <>
                    <SnippetToggler
                        snippetLabel="useDidMount()"
                        snippetDescription="Tiny hook to know when a React component has mounted."
                        seenInPosts={[
                            {
                                title: "Let's Build a Snazzy Animated Sticky Footer For GDPR Compliance!",
                                slug: "/blog/lets-build-a-sticky-footer-for-gdpr-compliance"
                            }
                        ]}
                        snippetInfos={[
                            {
                                fileLabel: "useDidMount.ts",
                                code: useDidMountTS.default.toString(),
                                usageCode: useDidMountUsage.default.toString(),
                                language: "typescript",
                            },
                            {
                                fileLabel: "useDidMount.js",
                                code: useDidMountJS.default.toString(),
                                usageCode: useDidMountUsage.default.toString(),
                                language: "javascript",
                            },
                        ]}
                        pdfMode={pdfMode}
                        languageFilter={languageFilter}
                    />
                    <SnippetToggler
                        snippetLabel="sendSlackMessage()"
                        snippetDescription="Leverages the fetch API to post a slack message to your Slack webhook with a one-liner."
                        seenInPosts={[{
                            title: "Fully Automating Chrisfrew.in Productions - Part 4 of ??? - Building a Slack Bot",
                            slug: "/blog/fully-automating-chrisfrew-in-productions-part-4-of-building-a-slack-bot"
                        }]}
                        snippetInfos={[
                            {
                                fileLabel: "sendSlackMessage.ts",
                                code: sendSlackMessageFrontendTS.default.toString(),
                                usageCode: sendSlackMessageUsage.default.toString(),
                                language: "typescript",
                            },
                            {
                                fileLabel: "sendSlackMessage.js",
                                code: sendSlackMessageFrontendJS.default.toString(),
                                usageCode: sendSlackMessageUsage.default.toString(),
                                language: "javascript",
                            },
                        ]}
                        pdfMode={pdfMode}
                        languageFilter={languageFilter}
                    />
                </>
            )}
            {languageFilter === URLSearchParamValue.ALL && <h2><u>Backend</u></h2>}
            {languageFilter === URLSearchParamValue.ALL && (
                <h3>JavaScript (Node.js)</h3>
            )}
            {(languageFilter === URLSearchParamValue.ALL ||
                languageFilter === URLSearchParamValue.NODE) && (
                <SnippetToggler
                    snippetLabel="sendSlackMessage()"
                    snippetDescription="A Node.js compatible (using node-fetch) function that lets you send a Slack message with a one-liner."
                    seenInPosts={[{
                        title: "Fully Automating Chrisfrew.in Productions - Part 4 of ??? - Building a Slack Bot",
                        slug: "/blog/fully-automating-chrisfrew-in-productions-part-4-of-building-a-slack-bot"
                    }]}
                    snippetInfos={[
                        {
                            fileLabel: "sendSlackMessage.ts",
                            code: sendSlackMessageBackendTS.default.toString(),
                            usageCode: sendSlackMessageUsage.default.toString(),
                            language: "typescript",
                        },
                        {
                            fileLabel: "sendSlackMessage.js",
                            code: sendSlackMessageBackendJS.default.toString(),
                            usageCode: sendSlackMessageUsage.default.toString(),
                            language: "javascript",
                        },
                    ]}
                    pdfMode={pdfMode}
                />
            )}
            {languageFilter === URLSearchParamValue.ALL && <h3><u>C#</u></h3>}
            {(languageFilter === URLSearchParamValue.ALL ||
                languageFilter === URLSearchParamValue.CSHARP) && (
                <SnippetToggler
                    snippetLabel="PatchFiltererService"
                    snippetDescription="Filter out unwanted properties from your models on the server side in .NET."
                    seenInPosts={[{
                        title: "C# .NET Core and TypeScript: Using Generics and LINQ to Secure and Filter Operations on Your JSONPatchDocuments",
                        slug: "/blog/filtering-json-patch-in-c-sharp"
                    }]}
                    snippetInfos={[
                        {
                            fileLabel: "PatchFiltererService.cs",
                            code: patchFiltererService.default.toString(),
                            usageCode: patchFiltererServiceUsage.default.toString(),
                            language: "csharp",
                        },
                    ]}
                    pdfMode={pdfMode}
                />
            )}
            {languageFilter === URLSearchParamValue.ALL && <h2><u>Devops</u></h2>}
            {(languageFilter === URLSearchParamValue.ALL ||
                languageFilter === URLSearchParamValue.SHELL) && (
                <>
                    <h3>Bash</h3>
                    <SnippetToggler
                        snippetLabel="buildColorPrompt()"
                        snippetDescription="Letter-level color changes for your bash prompt!"
                        seenInPosts={[{
                            title: "Awesome Colors for Shell Prompts!",
                            slug: "/blog/awesome-colors-for-shell-prompts"
                        }]}
                        snippetInfos={[
                            {
                                fileLabel: "buildColorPrompt.sh",
                                code: buildColorPromptBash.default.toString(),
                                usageCode: buildColorPromptUsageBash.default.toString(),
                                language: "bash",
                            },
                        ]}
                        pdfMode={pdfMode}
                    />
                    <SnippetToggler
                        snippetLabel="sendSlackMessage()"
                        snippetDescription="Util function to send a Slack message from bash."
                        seenInPosts={[{
                            title: "The Last Bitbucket Pipelines Tutorial You'll Ever Need: Mastering CI and CD",
                            slug: "/blog/mastering-bitbucket-pipelines-for-ci-and-cd"
                        }]}
                        snippetInfos={[
                            {
                                fileLabel: "sendSlackMessage.sh",
                                code: sendSlackMessageBash.default.toString(),
                                usageCode: sendSlackMessageUsageBash.default.toString(),
                                language: "bash",
                            },
                        ]}
                        pdfMode={pdfMode}
                    />
                    <h3>zsh</h3>
                    <SnippetToggler
                        snippetLabel="buildColorPrompt()"
                        snippetDescription="Letter-level color changes for your zsh prompt!"
                        seenInPosts={[{
                            title: "Awesome Colors for Shell Prompts!",
                            slug: "/blog/awesome-colors-for-shell-prompts"
                        }]}
                        snippetInfos={[
                            {
                                fileLabel: "buildColorPrompt.sh",
                                code: buildColorPromptZsh.default.toString(),
                                usageCode: buildColorPromptUsageZsh.default.toString(),
                                language: "bash",
                            },
                        ]}
                        pdfMode={pdfMode}
                    />
                </>
            )}
        </>
    )
}
