import ThemeBodyClass from "../enums/ThemeBodyClass";

export default interface IThemeConfig {
    label: string;
    emoji: string;
    themeBodyClass: ThemeBodyClass;
    defaultHexColor: string;
    linearWipeClasses: {
        default: Array<string>;
        alternate: Array<string>;
        love: Array<string>;
    }
    themeColorClasses: Array<string>;
    themeColorHexCodes: Array<string>;
}