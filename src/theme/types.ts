export interface ThemeColors {
  bg: string           // ページ背景
  panelOpacity: number // ソースパネル透明度(0-1)
  text: string         // メインテキスト
  textMuted: string    // サブテキスト
  border: string       // 枠線・UI輪郭
  s_bg: string         // p5 背景
  s_stroke: string     // 線・輪郭
  s_primary: string    // メインのオブジェクト塗り
  s_secondary: string  // サブのオブジェクト塗り
  s_accent: string     // ハイライト・反応色
}

export type ThemeName = string
export type SketchColorKey = 's_bg' | 's_stroke' | 's_primary' | 's_secondary' | 's_accent'

export interface ThemeConfig {
  useDefaultTheme: boolean
  defaultTheme: ThemeName
  themes: Record<ThemeName, ThemeColors>
}

export type GetColorFn = (key: SketchColorKey) => string
