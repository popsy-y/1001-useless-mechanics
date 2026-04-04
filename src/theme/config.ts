import type { ThemeConfig } from "./types"

// shoutout to Huemint
// https://huemint.com/brand-intersection/

export const themeConfig: ThemeConfig = {
  useDefaultTheme: false,
  defaultTheme: "permafrost",
  themes: {
    "neonsurf": {
      bg: "#3d64b9",
      panelOpacity: 0.6,
      text: "#d1e8f0",
      textMuted: "#a5b7bd",
      border: "#b5b72c",

      s_bg: "#5e85d8",
      s_stroke: "#b5b72c",
      s_primary: "#d1e8f0",
      s_secondary: "#60a5f7",
      s_accent: "#dde128",
    },
    "bacon": {
      bg: "#ede8d7",
      panelOpacity: 0.4,
      text: "#242758",
      textMuted: "#4a4c6f",
      border: "#ecabab",

      s_bg: "#eed5b6",
      s_stroke: "#a35d20",
      s_primary: "#ecabab",
      s_secondary: "#242758",
      s_accent: "#f18424",
    },
    "komorebi": {
      bg: "#f0f7e8",
      panelOpacity: 0.50,
      text: "#1e3322",
      textMuted: "#527a50",
      border: "#8ac87a",
      s_bg: "#d5ecc5",
      s_stroke: "#3a6a2e",
      s_primary: "#5aa046",
      s_secondary: "#1e3322",
      s_accent: "#c8d820",
    },
    "dune": {
      bg: "#f5e8c8",
      panelOpacity: 0.42,
      text: "#2e1a0a",
      textMuted: "#7a5030",
      border: "#d0a060",
      s_bg: "#e8d0a0",
      s_stroke: "#904e1a",
      s_primary: "#c07030",
      s_secondary: "#2e1a0a",
      s_accent: "#e04818",
    },
    "glacier": {
      bg: "#e4f2f8",
      panelOpacity: 0.44,
      text: "#082030",
      textMuted: "#406880",
      border: "#80b8d8",
      s_bg: "#c0ddef",
      s_stroke: "#1870a8",
      s_primary: "#40a0d0",
      s_secondary: "#082030",
      s_accent: "#00c8f0",
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
