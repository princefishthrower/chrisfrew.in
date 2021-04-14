import React, { useState } from "react"
import { SearchContext } from "./SearchContext";

export default function SearchProvider(props) {
    const { children } = props;
    const [query, setQuery] = useState<string>('')
    const value = { query, setQuery }

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}