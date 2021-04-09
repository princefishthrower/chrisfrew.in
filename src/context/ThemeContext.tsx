import { createContext } from 'react';
import { themeConfig } from '../config/ThemeConfig';

export const ThemeContext = createContext({
    themeBodyClass: themeConfig[0].themeBodyClass,
    setThemeBodyClass: (themeBodyClass: string) => {},
});