import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dailyDir = path.join(__dirname, '..', 'src', 'daily')

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(dailyDir)) {
  fs.mkdirSync(dailyDir, { recursive: true })
  console.log(`📁 ディレクトリを作成しました: ${dailyDir}`)
}

function getNextId() {
  const files = fs.readdirSync(dailyDir)
  let maxId = 0
  
  for (const file of files) {
    const match = file.match(/^(\d+)/)
    if (match) {
      const id = parseInt(match[1], 10)
      if (id > maxId) {
        maxId = id
      }
    }
  }
  
  return maxId + 1
}

function generateSketchTemplate(name) {
  return `import type p5 from 'p5'

export const setup = (p: p5) => {
  // キャンバスサイズは自由に設定できます
  // 例: p.createCanvas(800, 600)
  p.createCanvas(p.windowWidth, p.windowHeight)
  
  p.background(240)
}

export const draw = (p: p5) => {
  // ここに描画コードを書きます
  p.background(240)
  
  p.fill(100)
  p.noStroke()
  p.ellipse(p.width / 2, p.height / 2, 100, 100)
}
`
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('使用方法: npm run new-sketch <スケッチ名>')
    console.error('例: npm run new-sketch spring')
    process.exit(1)
  }
  
  const sketchName = args[0]
  const nextId = getNextId()
  const idStr = String(nextId).padStart(2, '0')
  const fileName = `${idStr}_${sketchName}.ts`
  const filePath = path.join(dailyDir, fileName)
  
  if (fs.existsSync(filePath)) {
    console.error(`エラー: ファイルが既に存在します: ${fileName}`)
    process.exit(1)
  }
  
  const template = generateSketchTemplate(sketchName)
  fs.writeFileSync(filePath, template)
  
  console.log(`✅ 新しいスケッチを作成しました: ${fileName}`)
  console.log(`   ID: ${nextId}`)
  console.log(`   URL: /sketches/${nextId}`)
}

main()
