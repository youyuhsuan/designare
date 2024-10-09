import "styled-components";

export type ThemeColors = (typeof colors)[keyof typeof colors];

declare module "styled-components" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    colors: ThemeColors;
    button: {
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        danger: string;
        success: string;
        warning: string;
        info: string;
        light: string;
        dark: string;
      };
      background: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        danger: string;
        success: string;
        warning: string;
        info: string;
        light: string;
        dark: string;
      };
      hover: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        danger: string;
        success: string;
        warning: string;
        info: string;
        light: string;
        dark: string;
      };
      outlined: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        danger: string;
        success: string;
        warning: string;
        info: string;
        light: string;
        dark: string;
      };
    };
    borderRadius: {
      xs: string;
      sm: string;
      md: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
    transition: string;
    transform: string;
  }
}
