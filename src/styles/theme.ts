import { DefaultTheme } from "styled-components";
import { colors } from "@/src/styles/colors";
import { ThemeColors } from "@/src/styles/styled";

const createTheme = (mode: "light" | "dark"): DefaultTheme => {
  const themeColors: ThemeColors = colors[mode];
  return {
    mode,
    colors: themeColors,
    // TODO:button color setting
    button: {
      text: {
        primary: themeColors.primaryText,
        secondary: themeColors.secondaryText,
        tertiary: themeColors.tertiaryText,
        accent: themeColors.accentText,
        danger: themeColors.danger,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
        light: themeColors.light,
        dark: themeColors.dark,
      },
      background: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        tertiary: themeColors.tertiary,
        accent: themeColors.accent,
        danger: themeColors.danger,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
        light: themeColors.light,
        dark: themeColors.dark,
      },
      hover: {
        primary: themeColors.primarySubtle,
        secondary: themeColors.secondarySubtle,
        tertiary: themeColors.tertiarySubtle,
        accent: themeColors.accentSubtle,
        danger: `${themeColors.danger}CC`,
        success: `${themeColors.success}CC`,
        warning: `${themeColors.warning}CC`,
        info: `${themeColors.info}CC`,
        light: themeColors.light,
        dark: themeColors.dark,
      },
      outlined: {
        primary: themeColors.primaryBorder,
        secondary: themeColors.secondaryBorder,
        tertiary: themeColors.tertiary,
        accent: themeColors.accentBorder,
        danger: themeColors.danger,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
        light: themeColors.light,
        dark: themeColors.dark,
      },
    },
    borderRadius: {
      xs: "0.125rem",
      sm: "0.25rem",
      md: "0.375rem",
      xl: "0.75rem",
      xxl: "1rem",
      xxxl: "1.5rem",
    },
    transition: "all 0.3s ease",
    transform: "none",
  };
};

export const lightTheme = createTheme("light");
export const darkTheme = createTheme("dark");
