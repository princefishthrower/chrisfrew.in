import { createContext } from 'react';

export const SearchContext = createContext({
    query: "",
    setQuery: (_: string) => {},
});