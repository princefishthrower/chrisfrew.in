import * as React from "react"
import { SnippetToggler } from "../components/pages/snippets/SnippetToggler"

const ExampleComponent = () => {
    return (
        <div style={{margin: '3rem'}}>
            <SnippetToggler
    snippetLabel="useDidMount()"
    fileLabels={["useDidMount.ts", "useDidMount.js"]}
    typeScriptCode={`import { useState, useEffect } from 'react'

export const useDidMount = (): boolean => {
  const [didMount, setDidMount] = useState<boolean>(false)

  useEffect(() => {
    setDidMount(true)
  }, [])

  return didMount
}`
    }
    javaScriptCode={`import { useState, useEffect } from 'react'

export const useDidMount = () => {
  const [didMount, setDidMount] = useState(false)

  useEffect(() => {
    setDidMount(true)
  }, [])

  return didMount
}
`}
    pdfMode={false}
/>

        </div>
    )
}

export default ExampleComponent