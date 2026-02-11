import type { ThemeColors, ThemeName, GetColorFn } from './types'
import { themeConfig, getRandomThemeName } from './config'

let currentThemeName: ThemeName = themeConfig.useDefaultTheme 
  ? themeConfig.defaultTheme 
  : getRandomThemeName()

export function getCurrentTheme(): ThemeColors {
  return themeConfig.themes[currentThemeName]
}

export function getCurrentThemeName(): ThemeName {
  return currentThemeName
}

export function setTheme(themeName: ThemeName): boolean {
  if (!(themeName in themeConfig.themes)) {
    console.warn(`Theme "${themeName}" not found`)
    return false
  }
  currentThemeName = themeName
  applyThemeToDOM()
  return true
}

export function setRandomTheme(): ThemeName {
  const newTheme = getRandomThemeName(currentThemeName)
  setTheme(newTheme)
  return newTheme
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function applyThemeToDOM(): void {
  const theme = getCurrentTheme()
  const root = document.documentElement
  
  // CSS変数を設定
  root.style.setProperty('--color-bg', theme.bg)
  root.style.setProperty('--color-text', theme.text)
  root.style.setProperty('--color-text-muted', theme.textMuted)
  root.style.setProperty('--color-border', theme.border)
  root.style.setProperty('--color-panel-bg', hexToRgba(theme.bg, theme.panelOpacity))
  root.style.setProperty('--color-panel-opacity', String(theme.panelOpacity))
  root.style.setProperty('--color-s-accent', theme.s_accent)
  root.style.setProperty('--color-s-secondary', theme.s_secondary)
}

export function createGetColor(): GetColorFn {
  const theme = getCurrentTheme()
  return function getColor(key: Parameters<GetColorFn>[0]): string {
    return theme[key]
  }
}

// スケッチ用：現在のテーマからgetColor関数を取得
export function getSketchColorFunction(): GetColorFn {
  return createGetColor()
}

// 初期化時に適用
export function initTheme(): void {
  applyThemeToDOM()
}
