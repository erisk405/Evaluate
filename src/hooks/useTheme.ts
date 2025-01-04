import { useTheme as useNextTheme } from "next-themes"
import { themeClasses } from "@/config/theme.config"
import { ThemeStyles } from "@/types/interface"
// Base theme hook
const useThemeBase = () => {
  const { theme = 'light', ...rest } = useNextTheme()
  return { theme, ...rest }
}

// Custom theme class hook
export const useThemeClass = () => {
  const { theme } = useThemeBase()
  
  const getThemeClass = (styles: ThemeStyles, baseClass: string = "") => {
    const themeClass = theme === "light" ? styles.light : styles.dark
    return `${baseClass} ${themeClass}`.trim()
  }

  return { getThemeClass }
}

// Predefined theme hooks
export const useThemeStyles = () => {
  const { theme } = useThemeBase()
  
  const getStyle = (styleKey: keyof typeof themeClasses) => {
    return theme === 'light' ? themeClasses[styleKey].light : themeClasses[styleKey].dark
  }

  return {
    text: getStyle('text'),
    background: getStyle('background'),
    border: getStyle('border'),
    hover: getStyle('hover'),
    background_secondary: getStyle('background_secondary'),
    background_dark_gradient:getStyle('background_dark_gradient'),
    text_description:getStyle('text_description'),
    background_head_table:getStyle('background_head_table'),
    background_secondary_head_table:getStyle('background_secondary_head_table'),
    background_third_head_table:getStyle('background_third_head_table'),
    background_card:getStyle('background_card'),
    background_icon:getStyle('background_icon'),
  }
}
