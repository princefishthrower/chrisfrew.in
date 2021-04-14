import React from "react"
import { MDXProvider } from "@mdx-js/react"
import { Pre } from "./src/components/CodeCopyButton/Pre"
import { preToCodeBlock } from "mdx-utils"
import ThemeProvider from "./src/context/theme/ThemeProvider"
import SearchProvider from "./src/context/search/SearchProvider"

// components is its own object outside of render so that the references to
// components are stable
const components = {
    pre: preProps => {
        const props = preToCodeBlock(preProps)
        // if there's a codeString and some props, we passed the test
        if (props) {
            return <Pre {...props} />
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
