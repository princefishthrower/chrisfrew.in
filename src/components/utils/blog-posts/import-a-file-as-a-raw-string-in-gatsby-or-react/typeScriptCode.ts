// rather special for the snippets blog post as we can't seem to use require() in them
// so we just render the template string here and import it into the post
// this is fine, since it's a one time usage
export const typeScriptCode = `import { useState, useEffect } from 'react'

export const useDidMount = (): boolean => {
  const [didMount, setDidMount] = useState<boolean>(false)

  useEffect(() => {
    setDidMount(true)
  }, [])

  return didMount
}`