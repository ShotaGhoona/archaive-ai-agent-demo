# 05plus-ユーザージャーニー図（Mermaid）

## 見積もりエージェントの種類について

コード分析の結果、見積もりエージェントには **3つの見積もりタイプ** が設定されていることがわかりました：

### 見積もりタイプ（EstimateType）

1. **`quick`** - 概算見積もり（±30%精度、速度重視）
2. **`detailed`** - 詳細見積もり（±10%精度、全工程積算）
3. **`final`** - 最終見積もり（±5%精度、契約レベル）

これらの設定は `src/app/api/ai-agents/shared/types.ts:83` および `validation.ts:43` で定義されており、APIリクエスト時のメタデータで指定可能です。

## 全体ユーザージャーニー

```mermaid
graph TD
    A[ARCHAIVEアプリ起動] --> B{エージェント選択}

    B -->|一般相談| C[General Agent]
    B -->|見積もり| D[Estimate Agent]

    %% General Agent Journey
    C --> C1[ウェルカムメッセージ表示]
    C1 --> C2{クイックアクション or 直接入力}
    C2 -->|クイックアクション| C3[6種類から選択]
    C2 -->|直接入力| C4[テキスト入力]
    C3 --> C5[製造コンサルタントAI応答]
    C4 --> C5
    C5 --> C6{追加質問?}
    C6 -->|Yes| C2
    C6 -->|No| C7[セッション終了]

    %% Estimate Agent Journey
    D --> D1[見積もりAI画面表示]
    D1 --> D2{ファイルアップロード or クイックアクション}

    %% ファイルアップロードフロー
    D2 -->|ファイルアップロード| E[FileUploadArea表示]
    E --> E1[図面ファイル選択/D&D]
    E1 --> E2{ファイル検証}
    E2 -->|エラー| E3[エラー表示: 形式/サイズ]
    E2 -->|成功| E4[ファイルアップロード完了]
    E4 --> E5[デフォルトメッセージ設定:<br/>この図面の見積もりを開始してください]
    E5 --> F[Vision API処理開始]

    %% クイックアクションフロー
    D2 -->|クイックアクション| D3[6種類の見積もりアクション]
    D3 --> D4[概算見積もり/詳細見積もり/材料費分析/<br/>加工費算出/納期見積もり/コスト最適化]
    D4 --> G[テキストベースAI処理]

    %% AI処理フロー
    F --> F1[図面解析 + プロンプト処理]
    G --> G1[プロンプト処理のみ]
    F1 --> H[見積もり結果生成]
    G1 --> H

    H --> H1[詳細見積もり表示:<br/>📋図面分析/💰見積もり詳細/<br/>📅納期/📝条件/💡最適化提案]
    H1 --> H2{追加質問?}
    H2 -->|Yes| D2
    H2 -->|No| H3[見積もりセッション終了]

    %% エラーハンドリング
    E3 --> E

    %% スタイリング
    classDef agentBox fill:#e1f5fe
    classDef processBox fill:#f3e5f5
    classDef resultBox fill:#e8f5e8
    classDef errorBox fill:#ffebee

    class C,D agentBox
    class F,F1,G,G1,H processBox
    class C5,H1 resultBox
    class E3 errorBox
```

## General Agent 詳細ジャーニー

```mermaid
graph TD
    A[General Agent起動] --> B[ウェルカムメッセージ表示]
    B --> C{ユーザーアクション}

    %% クイックアクション分岐
    C -->|➕ボタンクリック| D[QuickActionポップオーバー表示]
    D --> E[6つのアクション選択肢]
    E --> E1[📖設計の基本を教えて]
    E --> E2[⚙️材料の選び方]
    E --> E3[🧮公差設定のガイド]
    E --> E4[📄加工方法について]
    E --> E5[🔍品質管理のポイント]
    E --> E6[❓安全ガイドライン]

    %% 直接入力分岐
    C -->|テキスト入力| F[メッセージ入力]

    %% 処理統合
    E1 --> G[製造コンサルタントプロンプト処理]
    E2 --> G
    E3 --> G
    E4 --> G
    E5 --> G
    E6 --> G
    F --> G

    G --> H[OpenAI API呼び出し<br/>gpt-4o-mini, temperature: 0.7]
    H --> I[マークダウンレンダリング応答]
    I --> J{満足度}
    J -->|追加質問| C
    J -->|完了| K[セッション終了]

    %% ユーザーレベル対応
    G --> G1{experienceLevel設定}
    G1 -->|beginner| G2[基本概念から丁寧説明<br/>専門用語解説付き]
    G1 -->|intermediate| G3[適度な専門性<br/>実践的情報重視]
    G1 -->|expert| G4[高度技術情報<br/>最新動向含む]
    G2 --> H
    G3 --> H
    G4 --> H

    classDef actionBox fill:#e3f2fd
    classDef processBox fill:#f1f8e9
    classDef responseBox fill:#fff3e0

    class E1,E2,E3,E4,E5,E6 actionBox
    class G,G1,G2,G3,G4,H processBox
    class I responseBox
```

## Estimate Agent 詳細ジャーニー

```mermaid
graph TD
    A[Estimate Agent起動] --> B[ウェルカムメッセージ表示]
    B --> C{アクションタイプ選択}

    %% ファイルアップロードフロー
    C -->|図面アップロード| D[FileUploadArea表示]
    D --> D1[ドラッグ&ドロップ/ファイル選択]
    D1 --> D2{ファイル検証}
    D2 -->|形式エラー| D3[エラー: JPG/PNG/WEBP のみ]
    D2 -->|サイズエラー| D4[エラー: 20MB以下]
    D2 -->|検証OK| D5[ファイルアップロード成功]
    D5 --> D6[デフォルトメッセージ自動設定]
    D6 --> E[FormData作成]

    %% クイックアクションフロー
    C -->|クイックアクション| F[6種類の見積もりアクション]
    F --> F1[🧮概算見積もり]
    F --> F2[📄詳細見積もり]
    F --> F3[📦材料費分析]
    F --> F4[💲加工費算出]
    F --> F5[⏰納期見積もり]
    F --> F6[📈コスト最適化]

    %% 処理分岐
    E --> G{添付ファイル有無}
    F1 --> H[テキストのみ処理]
    F2 --> H
    F3 --> H
    F4 --> H
    F5 --> H
    F6 --> H

    %% Vision API処理
    G -->|ファイル有り| I[Base64変換]
    I --> J[Vision API呼び出し]
    J --> K[図面解析プロンプト処理]

    %% Chat API処理
    G -->|ファイル無し| H
    H --> L[Chat API呼び出し]

    %% 見積もりタイプ処理
    K --> M{estimateType指定}
    L --> M
    M -->|quick| M1[概算見積もりプロンプト<br/>±30%精度, 類似案件比較]
    M -->|detailed| M2[詳細見積もりプロンプト<br/>±10%精度, 全工程積算]
    M -->|final| M3[最終見積もりプロンプト<br/>±5%精度, 契約レベル]
    M -->|未指定| M2

    %% 共通処理設定
    M1 --> N[temperature: 0.3<br/>maxTokens: 3000]
    M2 --> N
    M3 --> N

    N --> O[見積もり生成処理]
    O --> P[構造化出力生成]

    %% 結果表示
    P --> P1[📋 図面分析結果<br/>基本情報・加工工程設計]
    P --> P2[💰 見積もり詳細<br/>表形式の詳細内訳]
    P --> P3[📅 納期<br/>標準・急納対応]
    P --> P4[📝 見積もり条件・注意事項]
    P --> P5[💡 コスト最適化提案]

    P1 --> Q[マークダウンレンダリング表示]
    P2 --> Q
    P3 --> Q
    P4 --> Q
    P5 --> Q

    Q --> R{ユーザー満足度}
    R -->|追加質問| C
    R -->|見積もり確定| S[見積もりセッション終了]

    %% エラーハンドリング
    D3 --> D
    D4 --> D

    %% スタイリング
    classDef uploadBox fill:#e8f5e8
    classDef actionBox fill:#e3f2fd
    classDef processBox fill:#fff3e0
    classDef errorBox fill:#ffebee
    classDef resultBox fill:#f3e5f5

    class D,D1,D5,D6 uploadBox
    class F1,F2,F3,F4,F5,F6 actionBox
    class I,J,K,L,M1,M2,M3,N,O processBox
    class D3,D4 errorBox
    class P1,P2,P3,P4,P5,Q resultBox
```

## メタデータフロー詳細

```mermaid
graph TD
    A[API Request] --> B{Agent Type}

    %% General Agent Metadata
    B -->|general| C[GeneralMetadata]
    C --> C1[sessionId: string?]
    C --> C2[userId: string?]
    C --> C3[preferences]
    C3 --> C3a[experienceLevel: beginner/intermediate/expert]
    C3 --> C3b[preferredUnits: metric/imperial]
    C3 --> C3c[industryFocus: string[]]

    %% Estimate Agent Metadata
    B -->|estimate| D[EstimateMetadata]
    D --> D1[blueprintInfo]
    D1 --> D1a[id, name, material]
    D1 --> D1b[customerName, productName]

    D --> D2[estimateType: quick/detailed/final]
    D --> D3[quantity: number]
    D --> D4[deliveryRequirement]
    D4 --> D4a[deadline: Date]
    D4 --> D4b[priority: normal/urgent/flexible]

    D --> D5[qualityRequirements]
    D5 --> D5a[tolerance: string]
    D5 --> D5b[surfaceFinish: string]
    D5 --> D5c[inspection: string[]]

    %% Processing
    C --> E[JSON Request Body]
    D --> F[FormData Request]
    F --> F1[message: string]
    F --> F2[metadata: JSON string]
    F --> F3[image: File?]

    E --> G[validateGeneralRequest]
    F --> H[validateEstimateRequest]

    G --> I[General Agent Processing]
    H --> J[Estimate Agent Processing]

    classDef metaBox fill:#e1f5fe
    classDef processBox fill:#e8f5e8

    class C,C1,C2,C3,D,D1,D2,D3,D4,D5 metaBox
    class G,H,I,J processBox
```

## レイアウト遷移ジャーニー

```mermaid
graph TD
    A[AI Agent起動] --> B[初期レイアウト選択]
    B --> B1[🪟 Floating Layout<br/>ドラッグ可能ウィンドウ]
    B --> B2[📱 Sidebar Layout<br/>固定サイドバー]
    B --> B3[🖥️ Fullpage Layout<br/>フルスクリーンモーダル]

    %% Floating Layout
    B1 --> F1[位置・サイズ調整可能]
    F1 --> F2[localStorage保存]
    F2 --> F3{レイアウト変更?}
    F3 -->|Yes| C[useLayoutTransition]
    F3 -->|No| F4[Floating継続]

    %% Sidebar Layout
    B2 --> S1[固定サイドバー表示]
    S1 --> S2[レスポンシブ対応]
    S2 --> S3{レイアウト変更?}
    S3 -->|Yes| C
    S3 -->|No| S4[Sidebar継続]

    %% Fullpage Layout
    B3 --> P1[フルスクリーンモーダル]
    P1 --> P2[チャット履歴サイドバー]
    P2 --> P3{レイアウト変更?}
    P3 -->|Yes| C
    P3 -->|No| P4[Fullpage継続]

    %% Layout Transition
    C --> C1[スムーズアニメーション]
    C1 --> C2[状態保存]
    C2 --> C3[新レイアウト適用]
    C3 --> D{遷移先}
    D -->|Floating| B1
    D -->|Sidebar| B2
    D -->|Fullpage| B3

    classDef layoutBox fill:#f1f8e9
    classDef transitionBox fill:#fff3e0

    class B1,B2,B3,F1,S1,P1 layoutBox
    class C,C1,C2,C3 transitionBox
```

## まとめ

このユーザージャーニー図から分かる重要なポイント：

1. **見積もりタイプは3段階** - quick/detailed/final で精度と用途が異なる
2. **ファイルアップロード機能** - Vision APIによる図面解析が核心機能
3. **クイックアクション** - 各エージェント6つずつの専門アクション
4. **レイアウト柔軟性** - 3つのレイアウトでユーザー環境に適応
5. **メタデータ活用** - ユーザー設定やプロジェクト情報で回答をカスタマイズ

これらの機能により、製造業の多様なニーズに対応できる包括的なAIエージェントシステムを実現しています。
