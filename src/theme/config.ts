import type { ThemeConfig } from './types'

export const themeConfig: ThemeConfig = {
  useDefaultTheme: false,
  defaultTheme: 'frappe-light',
  themes: {
    'frappe-light': {
      // UI部分（HTML側）
      bg: '#f2f4f8',           // 明るいグレー背景
      panelOpacity: 0.85,      // パネルは少し透明
      text: '#4c4f69',         // ダークグレーテキスト
      textMuted: '#6c6f85',    // 薄めのテキスト
      border: '#9ca0b0',       // 枠線
      
      // スケッチ部分（p5側）- UIより少し暗めにしてスケッチを際立たせる
      s_bg: '#e6e9ef',         // スケッチ背景（少し濃いめ）
      s_stroke: '#4c4f69',     // 線の色
      s_fill: '#7287fd',       // 塗りつぶし（ブルー）
      s_accent: '#e78284',     // アクセント（ピンク）
    },
  },
}

export function getThemeNames(): string[] {
  return Object.keys(themeConfig.themes)
}

export function getRandomThemeName(exclude?: string): string {
  const names = getThemeNames()
  const available = exclude ? names.filter(n => n !== exclude) : names
  if (available.length === 0) return names[0]
  return available[Math.floor(Math.random() * available.length)]
}
