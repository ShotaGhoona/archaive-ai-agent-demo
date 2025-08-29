# basic-layout

基本的なレイアウトコンポーネントとナビゲーション設定を提供するモジュール

## ディレクトリ構成

```
basic-layout/
├── constants/                                  # 定数とナビゲーション設定
│   ├── blueprint-navigation.tsx               # 図面ページのタブナビゲーション設定
│   ├── customer-navigation.tsx                # 顧客ページのタブナビゲーション設定  
│   ├── header-navigation.tsx                  # ヘッダーのメインナビゲーション設定
│   ├── project-navigation.tsx                 # 案件ページのタブナビゲーション設定
│   └── settings-sidebar.tsx                   # 設定サイドバーのナビゲーション設定
└── ui/                                        # UIコンポーネント
    ├── BlueprintTabNavigation.tsx             # 図面ページのタブナビゲーション
    ├── CustomerTabNavigation.tsx              # 顧客ページのタブナビゲーション
    ├── Header.tsx                             # アプリケーションヘッダー
    ├── ProjectTabNavigation.tsx               # 案件ページのタブナビゲーション
    └── SettingSidebar.tsx                     # 設定ページのサイドバー
```

## 概要

このモジュールはアプリケーション全体で使用される基本的なレイアウトコンポーネントを提供します。

### constants/
- **header-navigation.tsx**: 図面管理、案件管理、帳票管理、顧客管理へのメインナビゲーション設定
- **各種navigation**: 各ページ固有のタブナビゲーション設定とルーティング情報
- **settings-sidebar.tsx**: プロフィール、通知設定、セキュリティなどの設定項目

### ui/
- **Header.tsx**: ロゴ、メインナビゲーション、ユーザーメニューを含む共通ヘッダー
- **各TabNavigation**: ページごとの詳細なタブナビゲーション機能
- **SettingSidebar.tsx**: 設定ページ用のサイドバーナビゲーション

すべてのナビゲーションコンポーネントは現在のパスに基づいたアクティブ状態の管理と、統一されたデザインシステムを提供します。