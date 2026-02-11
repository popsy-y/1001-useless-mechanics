import type { ThemeConfig } from "./types"

// shoutout to Huemint
// https://huemint.com/brand-intersection/

export const themeConfig: ThemeConfig = {
  useDefaultTheme: false,
  defaultTheme: "tearoom",
  themes: {
    "neonsurf": {
      // UI部分（HTML側）
      bg: "#3d64b9",
      panelOpacity: 0.85,
      text: "#d1e8f0",
      textMuted: "#a5b7bd",
      border: "#dde128",

      s_bg: "#5e85d8",
      s_stroke: "#60a5f7",
      s_primary: "#d1e8f0",
      s_secondary: "#60a5f7",
      s_accent: "#dde128",
    },
    "bacon": {
      // UI部分（HTML側）
      bg: "#ede8d7",
      panelOpacity: 0.85,
      text: "#242758",
      textMuted: "#4a4c6f",
      border: "#ecabab",

      s_bg: "#eed5b6",
      s_stroke: "#a35d20",
      s_primary: "#ecabab",
      s_secondary: "#242758",
      s_accent: "#f18424",
    },
  },
}

export function getThemeNames(): string[] {
  return Object.keys(themeConfig.themes)
}

export function getRandomThemeName(exclude?: string): string {
  const names = getThemeNames()
  const available = exclude ? names.filter((n) => n !== exclude) : names
  if (available.length === 0) return names[0]
  return available[Math.floor(Math.random() * available.length)]
}
