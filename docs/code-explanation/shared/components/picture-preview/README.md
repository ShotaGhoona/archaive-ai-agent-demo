# picture-preview

画像プレビュー表示用のインタラクティブコンポーネント

## ディレクトリ構成

```
picture-preview/
├── lib/
│   └── usePicturePreview.ts        # プレビュー操作のカスタムフック
├── model/
│   └── types.ts                    # PictureFile型の定義
└── ui/
    └── PicturePreviewContainer.tsx # メインプレビューコンテナ
```

## 概要

**高機能な画像プレビューコンポーネント:**
- **ズーム操作**: 拡大・縮小機能
- **回転操作**: 時計回り・反時計回りの回転
- **フィット機能**: 画面サイズに合わせた自動調整
- **ロック機能**: アスペクト比固定/解除
- **ドラッグ操作**: 画像の位置移動

`PictureFile`インターフェースで`imageUrl`を受け取り、直感的な画像操作UIを提供。
図面や画像ファイルのプレビュー表示に最適。
EOF < /dev/null