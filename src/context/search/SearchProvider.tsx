import React, { useState, PropsWithChildren } from "react"
import { SearchContext } from "./SearchContext";

export default function SearchProvider(props: PropsWithChildren<{}>) {
    const { children } = props;
    const [query, setQuery] = useState<string>('')
    const value = { query, setQuery }

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}