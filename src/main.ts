import p5 from "p5"
import hljs from 'highlight.js'
import typescript from 'highlight.js/lib/languages/typescript'

interface SketchModule {
  setup: (p: p5) => void
  draw: (p: p5) => void
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
const currentIdDisplay = document.getElementById("current-id") as HTMLElement
const sourceCodeBlock = document.getElementById("source-code") as HTMLElement

hljs.registerLanguage('typescript', typescript)
hljs.highlightElement(sourceCodeBlock)

let currentSketchInstance: p5 | null = null
let currentSketchPath: string | null = null

interface SketchInfo {
  path: string
  id: string
  name: string
}

function getAllSketches(): SketchInfo[] {
  const sketches: SketchInfo[] = []
  
  for (const path in sketchModules) {
    const fileNameWithExtension = path.split("/").pop()
    if (fileNameWithExtension) {
      const sketchName = fileNameWithExtension.split(".")[0]
      const match = sketchName.match(/^(\d+)/)
      if (match) {
        sketches.push({
          path,
          id: match[1],
          name: sketchName
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
  currentIdDisplay.textContent = `#${sketchInfo.id}`
  updateUrl(sketchInfo.id)
  
  try {
    const moduleLoader = sketchModules[sketchInfo.path]
    const sketch = (await moduleLoader()) as SketchModule
    
    if (sketch && typeof sketch.setup === "function" && typeof sketch.draw === "function") {
      currentSketchInstance = new p5((p: p5) => {
        p.setup = () => {
          sketch.setup(p)
        }
        p.draw = () => sketch.draw(p)
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
  
  // ランダムボタンのイベント
  nextButton.addEventListener("click", loadRandomSketch)
  
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
