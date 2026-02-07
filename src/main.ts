import p5 from "p5"
import hljs from 'highlight.js'
import typescript from 'highlight.js/lib/languages/typescript'
import '@catppuccin/highlightjs/css/catppuccin-latte.css'
import './codePanel.css'
import { initTheme, setRandomTheme, createGetColor, getCurrentThemeName } from './theme'
import type { GetColorFn } from './theme/types'

interface SketchModule {
  setup: (p: p5, getColor: GetColorFn) => void
  draw: (p: p5, getColor: GetColorFn) => void
  keyPressed?: (p: p5, getColor: GetColorFn, event?: KeyboardEvent) => boolean | void
  keyReleased?: (p: p5, getColor: GetColorFn, event?: KeyboardEvent) => boolean | void
  keyTyped?: (p: p5, getColor: GetColorFn, event?: KeyboardEvent) => boolean | void
  doubleClicked?: (p: p5, getColor: GetColorFn, event?: MouseEvent) => boolean | void
  mouseClicked?: (p: p5, getColor: GetColorFn, event?: MouseEvent) => boolean | void
  mouseDragged?: (p: p5, getColor: GetColorFn, event?: MouseEvent) => boolean | void
  mouseMoved?: (p: p5, getColor: GetColorFn, event?: MouseEvent) => boolean | void
  mousePressed?: (p: p5, getColor: GetColorFn, event?: MouseEvent) => boolean | void
  mouseReleased?: (p: p5, getColor: GetColorFn, event?: MouseEvent) => boolean | void
  mouseWheel?: (p: p5, getColor: GetColorFn, event?: WheelEvent) => boolean | void
}

const sketchModules: Record<string, () => Promise<unknown>> = import.meta.glob(
  "./daily/*.ts",
)
const sketchSources: Record<string, () => Promise<unknown>> = import.meta.glob("./daily/*.ts", {
  query: "?raw",
  import: 'default'
})

const sketchContainer = document.getElementById("sketch-container") as HTMLElement
const nextButton = document.getElementById("next-mechanic") as HTMLButtonElement
const themeButton = document.getElementById("change-theme") as HTMLButtonElement
const currentIdDisplay = document.getElementById("current-id") as HTMLElement
const sourceCodeBlock = document.getElementById("source-code") as HTMLElement
const themeNameDisplay = document.getElementById("theme-name") as HTMLElement

hljs.registerLanguage('typescript', typescript)
hljs.highlightElement(sourceCodeBlock)

let currentSketchInstance: p5 | null = null
let currentSketchPath: string | null = null

interface SketchInfo {
  path: string
  id: string
  name: string
  title: string
}

function getAllSketches(): SketchInfo[] {
  const sketches: SketchInfo[] = []
  
  for (const path in sketchModules) {
    const fileNameWithExtension = path.split("/").pop()
    if (fileNameWithExtension) {
      const sketchName = fileNameWithExtension.split(".")[0]
      const match = sketchName.match(/^(\d+)/)
      if (match) {
        const id = match[1]
        const title = sketchName.substring(id.length + 1) // Remove "${id}_" prefix
        sketches.push({
          path,
          id,
          name: sketchName,
          title
        })
      }
    }
  }
  
  return sketches.sort((a, b) => parseInt(a.id) - parseInt(b.id))
}

function getSketchById(id: string): SketchInfo | undefined {
  return getAllSketches().find(s => s.id === id)
}

function getRandomSketch(excludeId?: string): SketchInfo | null {
  const sketches = getAllSketches()
  if (sketches.length === 0) return null
  
  const available = excludeId 
    ? sketches.filter(s => s.id !== excludeId)
    : sketches
    
  if (available.length === 0) return sketches[0]
  
  return available[Math.floor(Math.random() * available.length)]
}

function updateUrl(id: string) {
  const url = `/sketches/${id}`
  window.history.pushState({ id }, '', url)
}

function getIdFromUrl(): string | null {
  const pathname = window.location.pathname
  const match = pathname.match(/\/sketches\/(\d+)/)
  return match ? match[1] : null
}

async function loadSketch(sketchInfo: SketchInfo) {
  // 既存のスケッチを完全に削除
  if (currentSketchInstance) {
    currentSketchInstance.remove()
    currentSketchInstance = null
  }
  
  // コンテナをクリアして再作成
  sketchContainer.innerHTML = ''
  
  currentSketchPath = sketchInfo.path
  currentIdDisplay.textContent = `#${sketchInfo.id} "${sketchInfo.title}"`
  updateUrl(sketchInfo.id)
  
  try {
    const moduleLoader = sketchModules[sketchInfo.path]
    const sketch = (await moduleLoader()) as SketchModule
    
    if (sketch && typeof sketch.setup === "function" && typeof sketch.draw === "function") {
      const getColor = createGetColor()
      currentSketchInstance = new p5((p: p5) => {
        p.setup = () => {
          sketch.setup(p, getColor)
        }
        p.draw = () => sketch.draw(p, getColor)
        
        // Register optional event handlers if they exist
        if (typeof sketch.keyPressed === "function") {
          p.keyPressed = (event?: KeyboardEvent) => sketch.keyPressed!(p, getColor, event)
        }
        if (typeof sketch.keyReleased === "function") {
          p.keyReleased = (event?: KeyboardEvent) => sketch.keyReleased!(p, getColor, event)
        }
        if (typeof sketch.keyTyped === "function") {
          p.keyTyped = (event?: KeyboardEvent) => sketch.keyTyped!(p, getColor, event)
        }
        if (typeof sketch.doubleClicked === "function") {
          p.doubleClicked = (event?: MouseEvent) => sketch.doubleClicked!(p, getColor, event)
        }
        if (typeof sketch.mouseClicked === "function") {
          p.mouseClicked = (event?: MouseEvent) => sketch.mouseClicked!(p, getColor, event)
        }
        if (typeof sketch.mouseDragged === "function") {
          p.mouseDragged = (event?: MouseEvent) => sketch.mouseDragged!(p, getColor, event)
        }
        if (typeof sketch.mouseMoved === "function") {
          p.mouseMoved = (event?: MouseEvent) => sketch.mouseMoved!(p, getColor, event)
        }
        if (typeof sketch.mousePressed === "function") {
          p.mousePressed = (event?: MouseEvent) => sketch.mousePressed!(p, getColor, event)
        }
        if (typeof sketch.mouseReleased === "function") {
          p.mouseReleased = (event?: MouseEvent) => sketch.mouseReleased!(p, getColor, event)
        }
        if (typeof sketch.mouseWheel === "function") {
          p.mouseWheel = (event?: WheelEvent) => sketch.mouseWheel!(p, getColor, event)
        }
      }, sketchContainer)
    } else {
      console.error("選択されたファイルにsetupまたはdraw関数が含まれていません:", sketchInfo.path)
      sketchContainer.innerHTML = '<p style="color:red">スケッチの読み込みに失敗しました。コンソールを確認してください。</p>'
    }
  } catch (error) {
    console.error("スケッチの読み込み中にエラーが発生しました:", error)
    sketchContainer.innerHTML = '<p style="color:red">スケッチの読み込みエラー。コンソールを確認してください。</p>'
  }
  
  // ソースコード表示
  if (sketchInfo.path in sketchSources) {
    try {
      const rawLoader = sketchSources[sketchInfo.path] as () => Promise<any>
      const rawCodeModule = await rawLoader()
      const rawCode = typeof rawCodeModule === "string" ? rawCodeModule : rawCodeModule.default
      const highlighted = hljs.highlight(rawCode, { language: 'typescript' })
      sourceCodeBlock.innerHTML = highlighted.value
    } catch (e) {
      console.warn("コードの読み込みに失敗しました:", e)
      sourceCodeBlock.innerHTML = "<p style='color:red'>コードの読み込みに失敗しました。</p>"
    }
  }
}

function loadRandomSketch() {
  const currentId = getIdFromUrl()
  const nextSketch = getRandomSketch(currentId || undefined)
  if (nextSketch) {
    loadSketch(nextSketch)
  }
}

function updateThemeDisplay() {
  if (themeNameDisplay) {
    themeNameDisplay.textContent = `theme: ${getCurrentThemeName()}`
  }
}

// イベントリスナー
document.addEventListener("DOMContentLoaded", () => {
  const sketches = getAllSketches()
  
  if (sketches.length === 0) {
    sketchContainer.innerHTML = '<p style="color:red">スケッチが見つかりません。</p>'
    return
  }
  
  // URLからIDを取得、なければ最新のスケッチを表示
  const urlId = getIdFromUrl()
  const initialSketch = urlId ? getSketchById(urlId) : sketches[sketches.length - 1]
  
  if (initialSketch) {
    loadSketch(initialSketch)
  }
  
  // テーマ初期化
  initTheme()
  updateThemeDisplay()
  
  // ランダムボタンのイベント
  nextButton.addEventListener("click", loadRandomSketch)
  
  // テーマ切り替えボタンのイベント
  themeButton.addEventListener("click", () => {
    setRandomTheme()
    updateThemeDisplay()
    // 現在のスケッチをリロードして新しいテーマを適用
    const currentId = getIdFromUrl()
    if (currentId) {
      const sketch = getSketchById(currentId)
      if (sketch) {
        loadSketch(sketch)
      }
    }
  })
  
  // URL変更を監視（ブラウザバック/フォワード対応）
  window.addEventListener("popstate", () => {
    const id = getIdFromUrl()
    if (id) {
      const sketch = getSketchById(id)
      if (sketch && sketch.path !== currentSketchPath) {
        loadSketch(sketch)
      }
    } else {
      // ルートURLの場合は最新のスケッチにリダイレクト
      const latestSketch = sketches[sketches.length - 1]
      if (latestSketch) {
        loadSketch(latestSketch)
      }
    }
  })
})
