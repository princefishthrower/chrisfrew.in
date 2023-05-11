import {Highlight} from "prism-react-renderer"
import * as React from "react"

export interface ISnippetProps {
    code: any
}

export function Snippet(props: ISnippetProps) {
    const { code } = props
    return (
        <Highlight
            code={code.default.toString()}
            language="typescript"
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    )
}
