import { useState, useEffect } from "react"
import { useDidMount } from "../content/snippets/frontend/typescript/hooks/useDidMount"
import URLSearchParamKey from "../enums/URLSearchParamKey"
import { getSearchParamValue } from "../helpers/UrlSearchParamHelpers"
import { clearSearchParamsFromWindow } from "../helpers/WindowHelpers"

export const useSearchParam = (key: URLSearchParamKey) => {
    const didMount = useDidMount()
    const [searchParamValue, setSearchParamValue] = useState<string>("")

    // use effect after didmount - these functions need to use the window object
    useEffect(() => {
        if (didMount) {
            try {
                const paramValue = getSearchParamValue(key)
                setSearchParamValue(paramValue)
            } catch {
            } finally {
                clearSearchParamsFromWindow()
            }
        }
    }, [didMount])

    return searchParamValue
}
