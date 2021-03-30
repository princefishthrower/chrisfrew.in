import { createContext } from 'react';
import Constants from '../constants/Constants';

export const ThemeContext = createContext({
    theme: Constants.DARK_MODE,
    setTheme: (theme: string) => {},
});