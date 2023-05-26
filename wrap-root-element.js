import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { Pre } from "./src/components/CodeCopyButton/Pre"
import ThemeProvider from "./src/context/theme/ThemeProvider"
import SearchProvider from "./src/context/search/SearchProvider"

// components is its own object outside of render so that the references to
// components are stable
const components = {
    pre: (preProps) => {
        const className = preProps.children.props.className || ""
        const matches = className.match(/language-(?<lang>.*)/)
        // if this pre has a classname with a language in it (go, javascript, etc.), then render the code block
        if (matches && matches.groups && matches.groups.lang) {
            return (
                <Pre
                    codeString={preProps.children.props.children}
                    language={matches.groups.lang}
                    pdfMode={false}
                />
            )
        } else {
            // it's possible to have a pre without a code in it - render as normal pre
            return <pre {...preProps} />
        }
    },
}

export const wrapRootElement = ({ element }) => {
    return (
        <ThemeProvider>
            <SearchProvider>
                <MDXProvider components={components}>{element}</MDXProvider>
            </SearchProvider>
        </ThemeProvider>
    )
}
