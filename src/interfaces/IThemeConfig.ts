import ThemeBodyClass from "../enums/ThemeBodyClass";

export default interface IThemeConfig {
    label: string;
    emoji: string;
    themeBodyClass: ThemeBodyClass;
    linearWipeClasses: {
        default: Array<string>;
        alternate: Array<string>;
        love: Array<string>;
    }
    confettiColorClasses: Array<string>;
    confettiColorHexCodes: Array<string>;
}