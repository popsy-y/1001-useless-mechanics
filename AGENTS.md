# 1001 Useless Mechanics

p5.jsを使ったインタラクティブな仕掛け（メカニクス）のギャラリーサイト

## 技術スタック

- **p5.js** (v2.0.2) - クリエイティブコーディング
- **Vite** (v6.3.5) - ビルドツール
- **TypeScript** (~5.8.3) - 型付きJavaScript
- **TailwindCSS** (v4.1.8) - CSSフレームワーク
- **highlight.js** (v11.11.1) - シンタックスハイライト

## ディレクトリ構造

```
.
├── index.html              # メインHTML
├── src/
│   ├── main.ts            # アプリケーションのエントリーポイント
│   ├── daily/             # スケッチファイルを配置
│   │   └── 02_cake.ts     # スケッチ例（ID_名前.tsの形式）
│   └── resize/            # リサイズ関連ユーティリティ
├── scripts/
│   └── new-sketch.js      # 新規スケッチ生成スクリプト
├── style.css              # グローバルスタイル
└── package.json
```

## スケッチの作成方法

### 1. 自動生成（推奨）

```bash
npm run new-sketch <スケッチ名>
# 例: npm run new-sketch spring
```

これにより以下が自動生成されます：
- `src/daily/{次のID}_{スケッチ名}.ts`
- 既存の最大ID + 1 が自動付与
- setup/drawの基本構造付き

### 2. 手動作成

`src/daily/{ID}_{名前}.ts` の形式で作成：

```typescript
import type p5 from 'p5'

export const setup = (p: p5) => {
  // キャンバスサイズは自由に設定可能
  p.createCanvas(800, 600)  // 固定サイズ
  // または
  // p.createCanvas(p.windowWidth, p.windowHeight)  // フルスクリーン
}

export const draw = (p: p5) => {
  // 描画コード
}
```

## URLルーティング

- **一覧表示**: 最新のスケッチを自動表示
- **直接アクセス**: `/sketches/{ID}`
  - 例: `/sketches/02`
- **ランダム表示**: 「Next Mechanic (??)」ボタンでランダム遷移

## 開発コマンド

```bash
npm run dev              # 開発サーバー起動 (http://localhost:5173)
npm run build            # 本番ビルド
npm run preview          # ビルド結果のプレビュー
npm run new-sketch <name> # 新規スケッチ作成
```

## スケッチ切り替え時の仕様

- スケッチを切り替える際、前回の状態は**保持されません**
- 毎回新しいp5インスタンスが作成されます
- コンテナ要素が完全にクリアされます

## スケッチIDについて

- ファイル名の先頭数字をIDとして使用
- 例: `02_cake.ts` → ID: `02`
- IDは重複不可（重複時は最初に見つかったものが使用される）
- 連番である必要はありませんが、推奨されます

## 注意事項

- スケッチ内でグローバル変数を使用する場合は注意（前回の状態が残る可能性）
- キャンバスサイズは各スケッチのsetup内で自由に設定可能
- リサイズ処理が必要な場合は、p5の`windowResized`関数を使用
