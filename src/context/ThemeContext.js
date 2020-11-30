import { createContext } from 'react';
import { DARK_MODE } from "../constants/constants";

export const ThemeContext = createContext({
    theme: DARK_MODE,
    setTheme: (theme) => {},
});