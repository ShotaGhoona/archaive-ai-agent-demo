# tab-navigation

タブナビゲーション用の再利用可能なコンポーネント

## ディレクトリ構成

```
tab-navigation/
├── model/
│   └── types.ts               # TabItem、LinkTabItem等の型定義
└── ui/
    ├── LinkTabNavigation.tsx  # リンク付きタブナビゲーション
    └── TabNavigation.tsx      # 基本タブナビゲーション
```

## 概要

2種類のタブナビゲーションを提供：
- **TabNavigation**: コールバック式のタブ切り替え
- **LinkTabNavigation**: Next.js Link を使ったページ遷移タブ
EOF < /dev/null