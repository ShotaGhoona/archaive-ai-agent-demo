# loading

ローディング表示用のUIコンポーネント集
http://localhost:3001/test/loadingで確認できる
欲しいのを好きにどうぞ方式

## ディレクトリ構成

```
loading/
└── ui/
    ├── Loading.tsx             # 基本ローディング（スピナー＋テキスト）
    ├── LoadingScreen.tsx       # 全画面ローディング
    ├── LoadingSkeleton.tsx     # スケルトン表示
    ├── LoadingSpinner.tsx      # スピナーのみ
    └── PageLoading.tsx         # ページローディング
```

## 概要

**5種類のローディングコンポーネントを提供：**
- **LoadingSpinner**: 基本的な回転スピナー（sm/md/lg）
- **Loading**: スピナー＋タイトル＋説明文の組み合わせ
- **LoadingScreen**: 全画面オーバーレイ表示
- **PageLoading**: ページ遷移用ローディング
- **LoadingSkeleton**: データロード中のプレースホルダー表示

用途に応じてサイズとスタイルをカスタマイズ可能。
EOF < /dev/null