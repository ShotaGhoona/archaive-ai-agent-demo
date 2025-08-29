# Blueprint View Widget - 30秒キャッチアップ

## 概要
図面ビューアと管理システム。複数の図面視点の切り替えとファイル管理機能を提供。

## ディレクトリ構成
```
widgets/blueprint/blueprint-view/
├── ui/
│   ├── BlueprintViewContainer.tsx     # メインコンテナ
│   └── BlueprintDetailSidebar.tsx     # サイドバー
├── model/
│   └── types.ts                       # 型定義
└── data/
    └── blueprints.json               # サンプルデータ
```

## 主要機能
- **多視点対応**: 正面図、側面図、上面図、断面図、詳細図、組立図
- **ファイル管理**: ドラッグ&ドロップアップロード（.dwg, .step, .igs, .png, .jpg, .pdf対応）
- **インタラクティブサイドバー**: サムネイル表示、ギャラリーモード切り替え
- **操作ツールバー**: ダウンロード、印刷、編集モード

## 使用場所
- 図面基本情報ページ（左パネル）
- 図面見積ページ（左パネル）  
- 類似図面比較ページ（左パネル）

リサイズ可能レイアウトと組み合わせて使用

## 技術詳細
- **状態管理**: React hooks（useState, useEffect）
- **ファイル処理**: URL.createObjectURL()でプレビュー生成
- **UI コンポーネント**: shared library活用
- **レスポンシブ**: サイドバー/ギャラリーモード対応