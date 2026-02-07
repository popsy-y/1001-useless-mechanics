import type { ThemeConfig } from './types'

export const themeConfig: ThemeConfig = {
  useDefaultTheme: false,
  defaultTheme: 'tearoom',
  themes: {
    'tearoom': {
      // UI部分（HTML側）
      bg: '#bf8d69',           
      panelOpacity: 0.85,      
      text: '#1f2832',         
      textMuted: '#606963',    
      border: '#faaeaa',       
      
      s_bg: '#fffbf7',         
      s_stroke: '#a33333',     
      s_primary: '#74b543',    
      s_secondary: '#0e5746',  
      s_accent: '#fc7274',     
    },
    'bacon': {
      // UI部分（HTML側）
      bg: '#ede8d7',           
      panelOpacity: 0.85,      
      text: '#242758',         
      textMuted: '#4a4c6f',    
      border: '#ecabab',       
      
      s_bg: '#eed5b6',         
      s_stroke: '#f18424',     
      s_primary: '#ecabab',    
      s_secondary: '#242758',  
      s_accent: '#f18424',     
    }
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
