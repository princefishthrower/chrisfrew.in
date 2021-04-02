import URLSearchParamKey from "../enums/URLSearchParamKey"
import URLSearchParamValue from "../enums/URLSearchParamValue"

// util function to get the 'from' search param AKA where they navigated from
const getSearchParamByKey = (key: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(key)
}

// examines the page URL for matching values in URLSearchParamValue - returns true if there is a match, false otherwise
export const getSearchParamValue = (key: URLSearchParamKey) => {
  const value = getSearchParamByKey(key)
  if (Object.values(URLSearchParamValue).includes(value as URLSearchParamValue)) {
      return value as URLSearchParamValue
  }
  throw Error("Invalid search param value!");
}
