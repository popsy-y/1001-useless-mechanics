# 1001 Useless Mechanics

p5.jsを使ったインタラクティブな仕掛け（メカニクス）のギャラリーサイト

## 技術スタック

- **p5.js** (v2.0.2) - クリエイティブコーディング
- **Vite** (v6.3.5) - ビルドツール
- **TypeScript** (~5.8.3) - 型付きJavaScript
- **TailwindCSS** (v4.1.8) - CSSフレームワーク
- **highlight.js** (v11.11.1) - シンタックスハイライト

## 開発コマンド

```bash
npm run dev              # 開発サーバー起動 (http://localhost:5173)
npm run build            # 本番ビルド
npm run preview          # ビルド結果のプレビュー
npm run new-sketch <name> # 新規スケッチ作成
npx tsc --noEmit         # 型チェック
```

## ディレクトリ構造

```
.
├── index.html              # メインHTML
├── src/
│   ├── main.ts            # アプリケーションのエントリーポイント
│   ├── daily/             # スケッチファイルを配置
│   │   └── 1_spring.ts    # スケッチ例（ID_名前.tsの形式）
│   ├── resize/            # リサイズ関連ユーティリティ
│   └── theme/             # テーマシステム
│       ├── types.ts       # テーマ型定義
│       ├── config.ts      # テーマ設定
│       └── index.ts       # テーマ管理
├── scripts/
│   └── new-sketch.js      # 新規スケッチ生成スクリプト
├── style.css              # グローバルスタイル
└── package.json
```

## コードスタイル

### TypeScript

- **型**: 厳格な型付けを使用。`any`は避ける
- **インポート**: 型インポートには`import type`を使用
- **命名**: 
  - 変数・関数: camelCase (`getColor`, `themeName`)
  - 型・インターフェース: PascalCase (`ThemeColors`, `GetColorFn`)
  - 定数: UPPER_SNAKE_CASE or camelCase
- **エラー処理**: try-catchで適切に処理、console.errorでログ出力

### スケッチの作成方法

自動生成（推奨）:
```bash
npm run new-sketch <スケッチ名>
# 例: npm run new-sketch spring
```

これにより以下が自動生成されます：
- `src/daily/{次のID}_{スケッチ名}.ts`
- 既存の最大ID + 1 が自動付与
- setup/drawの基本構造付き（getColor対応済み）

手動作成時のテンプレート:
```typescript
import type p5 from 'p5'
import type { GetColorFn } from '../theme/types'
import { createFitCanvas } from '../resize/canvas'
import { resizer } from '../resize/resize'

export const setup = (p: p5, getColor: GetColorFn) => {
  createFitCanvas(600, 600, p)
  resizer.p5(p)
  p.background(getColor('s_bg'))
}

export const draw = (p: p5, getColor: GetColorFn) => {
  p.background(getColor('s_bg'))
  p.fill(getColor('s_fill'))
  p.noStroke()
  p.ellipse(p.width / 2, p.height / 2, 100, 100)
}
```

## テーマシステム

### テーマの定義

`src/theme/config.ts`でテーマを定義:

```typescript
export const themeConfig: ThemeConfig = {
  useDefaultTheme: false,
  defaultTheme: 'frappe-light',
  themes: {
    'theme-name': {
      bg: '#f2f4f8',           // ページ背景
      panelOpacity: 0.85,      // ソースパネル透明度(0-1)
      text: '#4c4f69',         // メインテキスト
      textMuted: '#6c6f85',    // サブテキスト
      border: '#9ca0b0',       // 枠線
      s_bg: '#e6e9ef',         // p5 背景
      s_stroke: '#4c4f69',     // 線
      s_fill: '#7287fd',       // 塗りつぶし
      s_accent: '#e78284',     // アクセント
    },
  },
}
```

### スケッチで色を使用

```typescript
export const draw = (p: p5, getColor: GetColorFn) => {
  p.background(getColor('s_bg'))      // サジェストが出ます
  p.fill(getColor('s_fill'))          // s_stroke, s_accentも使用可能
  p.stroke(getColor('s_stroke'))
  // ...
}
```

利用可能なスケッチ用色キー:
- `s_bg` - 背景色
- `s_stroke` - 線・輪郭
- `s_fill` - オブジェクト塗り
- `s_accent` - ハイライト・反応色

## URLルーティング

- **一覧表示**: 最新のスケッチを自動表示
- **直接アクセス**: `/sketches/{ID}`
  - 例: `/sketches/1`
- **ランダム表示**: 「BORED!」ボタンでランダム遷移
- **テーマ切り替え**: 「CHANGE THEME」ボタンでランダムテーマ

## スケッチ仕様

- スケッチ切り替え時、前回の状態は**保持されません**
- 毎回新しいp5インスタンスが作成されます
- コンテナ要素が完全にクリアされます

## スケッチID

- ファイル名の先頭数字をIDとして使用
- 例: `1_spring.ts` → ID: `1`
- IDは重複不可（重複時は最初に見つかったものが使用される）

## 注意事項

- スケッチ内でグローバル変数を使用する場合は注意（前回の状態が残る可能性）
- キャンバスサイズは各スケッチのsetup内で自由に設定可能
- リサイズ処理が必要な場合は、p5の`windowResized`関数を使用
- 型チェックを必ず実行: `npx tsc --noEmit`
