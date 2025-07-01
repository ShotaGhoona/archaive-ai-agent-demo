# AIチャットボット実装戦略 - パターン05（マルチステートシームレスチャット）

## プロジェクト概要

パターン05は、既存の01（サイドバー）、02（浮遊モーダル）、04（大型モーダル）の3つのチャットUIを**単一のシステム内でシームレスに切り替え可能**な最終形態として設計します。ユーザーの作業状況や好みに応じて最適なUI状態を選択でき、状態間の移行も滑らかなアニメーションで実現する革新的なアダプティブUIシステムです。

## 詳細要件定義

### 1. 機能要件

#### 1.1 基本機能
- **チャット機能**: 全ての状態で共通のメッセージ送受信機能
- **状態切り替え**: 3つのレイアウト状態間の瞬時切り替え
- **データ永続化**: 状態変更時もチャット履歴・設定を保持
- **アニメーション**: 状態遷移時の滑らかなトランジション効果

#### 1.2 状態定義
```typescript
enum ChatLayoutState {
  FLOATING = 'floating',    // 02: 浮遊ドラッグ可能モーダル
  SIDEBAR = 'sidebar',      // 01: 右側固定サイドパネル  
  FULLPAGE = 'fullpage'     // 04: 大型フルページモーダル
}
```

#### 1.3 初期状態
- **デフォルト**: `FLOATING`状態で開始
- **記憶機能**: 前回使用した状態を記憶（localStorage）
- **レスポンシブ**: デバイスサイズに応じた最適状態の自動選択

### 2. UI/UX要件

#### 2.1 チャットボタン
- **位置**: 右下固定（全パターン共通）
- **状態**: 開閉状態に応じたフェードイン/アウト
- **アニメーション**: ホバー時の拡大、クリック時のパルス効果

#### 2.2 状態切り替えUI
```
┌─ Chat Header ────────────────────────────┐
│ [🤖 AI Assistant]    [⚡][📄][🔲][✕]     │
│                       ↑  ↑  ↑  ↑        │
│                      Float Side Full Close │
└──────────────────────────────────────────┘
```

**アイコン定義**:
- **⚡ (Zap)**: 浮遊モード - 自由度・機動性を表現
- **📄 (Sidebar)**: サイドバーモード - 固定・安定性を表現  
- **🔲 (Maximize2)**: フルページモード - 最大化・集中を表現
- **✕ (X)**: 閉じる

#### 2.3 状態別レイアウト仕様

##### 2.3.1 FLOATING状態（初期状態）
```
サイズ: 400px × 700px（デフォルト）
位置: 右下付近（ドラッグ可能）
特徴: 
- ドラッグ&リサイズ対応
- 他の作業の邪魔にならない
- 自由な配置が可能
```

##### 2.3.2 SIDEBAR状態
```
サイズ: 画面右側1/4（320px〜400px）
位置: 右端固定
特徴:
- 図面作業と並行利用
- 安定した表示位置
- メイン画面を圧迫しない
```

##### 2.3.3 FULLPAGE状態
```
サイズ: 95vw × 95vh
位置: 画面中央
特徴:
- 最大作業領域
- 詳細相談・複雑な操作向け
- 集中的な対話環境
```

### 3. 技術要件

#### 3.1 アーキテクチャ設計

```typescript
// 状態管理の中核インターフェース
interface ChatUIState {
  layoutState: ChatLayoutState;
  isOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  messages: Message[];
  isLoading: boolean;
  preferences: UserPreferences;
}

interface UserPreferences {
  defaultLayout: ChatLayoutState;
  rememberLayout: boolean;
  animations: boolean;
  autoResize: boolean;
}
```

#### 3.2 コンポーネント構成
```
src/components/feature/blueprint-detail/05/
├── core/
│   ├── ChatUIManager.tsx           # 中央制御コンポーネント
│   ├── StateTransitionManager.tsx  # 状態遷移制御
│   └── LayoutRenderer.tsx          # 状態別レンダリング
├── layouts/
│   ├── FloatingLayout.tsx          # 浮遊レイアウト（02ベース）
│   ├── SidebarLayout.tsx           # サイドバーレイアウト（01ベース）
│   └── FullpageLayout.tsx          # フルページレイアウト（04ベース）
├── shared/
│   ├── ChatButton.tsx              # 共通チャットボタン
│   ├── ChatHeader.tsx              # 共通ヘッダー（状態切り替えUI）
│   ├── ChatContent.tsx             # 共通チャット内容
│   ├── ChatMessage.tsx             # メッセージコンポーネント
│   └── ChatInput.tsx               # 入力コンポーネント
├── hooks/
│   ├── useChatUIState.ts           # 状態管理フック
│   ├── useLayoutTransition.ts      # レイアウト遷移フック
│   ├── useStatePreferences.ts      # 設定管理フック
│   └── useKeyboardShortcuts.ts     # キーボードショートカット
├── utils/
│   ├── animationUtils.ts           # アニメーション処理
│   ├── layoutCalculations.ts       # レイアウト計算
│   └── storageUtils.ts             # ローカルストレージ管理
├── types.ts                        # 型定義
└── index.tsx                       # メインエントリポイント
```

### 4. 状態遷移仕様

#### 4.1 遷移パターン
```
FLOATING ←→ SIDEBAR ←→ FULLPAGE
    ↓           ↓           ↓
   [自由]     [安定]     [集中]
```

#### 4.2 アニメーション仕様

##### 4.2.1 FLOATING → SIDEBAR
```css
/* フェーズ1: 位置移動 (300ms) */
transform: translate(新位置) scale(1);

/* フェーズ2: サイズ調整 (200ms, delay: 100ms) */
width: 400px → 320px;
height: 700px → 100vh;

/* フェーズ3: レイアウト調整 (200ms, delay: 200ms) */
border-radius: 12px → 0px;
position: fixed → fixed;
```

##### 4.2.2 FLOATING → FULLPAGE  
```css
/* フェーズ1: 中央移動 (400ms) */
transform: translate(画面中央) scale(1.1);

/* フェーズ2: サイズ拡大 (300ms, delay: 100ms) */
width: 400px → 95vw;
height: 700px → 95vh;

/* フェーズ3: 背景オーバーレイ (200ms, delay: 200ms) */
backdrop: blur(0px) → blur(4px);
```

##### 4.2.3 共通アニメーション原則
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` - Material Design準拠
- **Duration**: 状態の複雑さに応じて200ms〜500ms
- **Stagger**: 複数要素の段階的アニメーション
- **GPU加速**: `transform`, `opacity`を優先使用

### 5. ユーザビリティ要件

#### 5.1 キーボードショートカット
```
Ctrl + 1: FLOATING状態に切り替え
Ctrl + 2: SIDEBAR状態に切り替え  
Ctrl + 3: FULLPAGE状態に切り替え
Ctrl + /: ショートカットヘルプ表示
Esc: チャット閉じる（全状態共通）
Tab: フォーカス移動（状態内）
```

#### 5.2 レスポンシブ動作
```typescript
// デバイス別の状態制限・推奨
const deviceConstraints = {
  mobile: {
    available: [ChatLayoutState.FULLPAGE],
    default: ChatLayoutState.FULLPAGE,
    reason: "小画面では全画面が最適"
  },
  tablet: {
    available: [ChatLayoutState.FLOATING, ChatLayoutState.FULLPAGE],
    default: ChatLayoutState.FLOATING,
    reason: "中画面では浮遊・全画面が実用的"
  },
  desktop: {
    available: [ChatLayoutState.FLOATING, ChatLayoutState.SIDEBAR, ChatLayoutState.FULLPAGE],
    default: ChatLayoutState.FLOATING,
    reason: "大画面では全状態が利用可能"
  }
};
```

#### 5.3 アクセシビリティ要件
- **ARIA属性**: 各状態に適切なrole、aria-label設定
- **フォーカス管理**: 状態切り替え時のフォーカス保持・移動
- **色覚対応**: 状態アイコンに色以外の識別要素追加
- **スクリーンリーダー**: 状態変更時の音声アナウンス

### 6. データ管理要件

#### 6.1 状態永続化
```typescript
interface PersistedChatState {
  layoutState: ChatLayoutState;
  position: { x: number; y: number };
  size: { width: number; height: number };
  preferences: UserPreferences;
  sessionData: {
    messages: Message[];
    lastActive: Date;
    blueprintId: string;
  };
}
```

#### 6.2 データ同期
- **リアルタイム**: 状態変更時の即座なデータ同期
- **永続化**: LocalStorage/SessionStorageを活用
- **復元**: ページリロード時の状態・データ復元
- **クリーンアップ**: セッション終了時の適切なデータ削除

### 7. パフォーマンス要件

#### 7.1 レンダリング最適化
```typescript
// 状態別コンポーネントの遅延ロード
const FloatingLayout = lazy(() => import('./layouts/FloatingLayout'));
const SidebarLayout = lazy(() => import('./layouts/SidebarLayout'));  
const FullpageLayout = lazy(() => import('./layouts/FullpageLayout'));

// メモ化による再レンダリング防止
const MemoizedChatContent = memo(ChatContent);
const MemoizedChatMessage = memo(ChatMessage);
```

#### 7.2 アニメーション最適化
- **GPU加速**: transform3d、will-changeの活用
- **requestAnimationFrame**: スムーズなアニメーション制御
- **Intersection Observer**: 表示領域外の処理停止
- **メモリ管理**: アニメーション完了時のクリーンアップ

### 8. エラーハンドリング要件

#### 8.1 状態遷移エラー
```typescript
interface StateTransitionError {
  fromState: ChatLayoutState;
  toState: ChatLayoutState;
  error: Error;
  fallbackState: ChatLayoutState;
  userMessage: string;
}

// エラー時のフォールバック戦略
const fallbackStrategy = {
  [ChatLayoutState.FLOATING]: ChatLayoutState.SIDEBAR,
  [ChatLayoutState.SIDEBAR]: ChatLayoutState.FLOATING,
  [ChatLayoutState.FULLPAGE]: ChatLayoutState.FLOATING
};
```

#### 8.2 レスポンシブエラー
- **画面サイズ変更**: 不適切なサイズでの状態自動調整
- **デバイス制限**: 非対応状態への遷移時の適切な代替提示
- **ネットワークエラー**: オフライン時の機能制限表示

### 9. テスト要件

#### 9.1 単体テスト
- **状態管理**: 各フックの正常動作確認
- **アニメーション**: 遷移の開始・完了検証
- **データ永続化**: 保存・復元の整合性確認

#### 9.2 統合テスト  
- **状態遷移**: 全ての遷移パターンの動作確認
- **レスポンシブ**: デバイスサイズ変更時の適切な動作
- **パフォーマンス**: 遷移時のフレームレート測定

#### 9.3 E2Eテスト
- **ユーザーシナリオ**: 実際の使用パターンでの動作確認
- **クロスブラウザ**: 主要ブラウザでの互換性確認
- **アクセシビリティ**: 支援技術での操作性確認

### 10. 実装優先度・フェーズ

#### Phase 1: 基盤構築（2週間）
1. ✅ 中央状態管理システム構築
2. ✅ 基本的な状態切り替え機能
3. ✅ 3つのレイアウト実装（既存コード流用）
4. ✅ データ永続化機能

#### Phase 2: 体験向上（1週間）
1. ✅ スムーズなアニメーション実装
2. ✅ キーボードショートカット
3. ✅ レスポンシブ対応
4. ✅ エラーハンドリング

#### Phase 3: 最適化（1週間）
1. ✅ パフォーマンス最適化
2. ✅ アクセシビリティ強化
3. ✅ 包括的テスト実装
4. ✅ ドキュメント整備

### 11. 成功指標

#### 11.1 技術指標
- **状態遷移時間**: 平均500ms以下
- **フレームレート**: 60fps維持
- **メモリ使用量**: 50MB以下
- **初期ロード時間**: 2秒以下

#### 11.2 UX指標  
- **状態切り替え成功率**: 99.9%以上
- **ユーザー満足度**: アンケート4.5/5以上
- **学習コスト**: 初回使用から5分以内で習得
- **エラー発生率**: 0.1%以下

### 12. 将来拡張性

#### 12.1 新状態追加
- **Picture-in-Picture**: 小窓表示モード
- **Split-Screen**: 画面分割モード  
- **Presentation**: プレゼンテーション特化モード

#### 12.2 高度機能
- **マルチセッション**: 複数チャット同時管理
- **テーマカスタマイズ**: ユーザー独自のレイアウト
- **AI学習**: 使用パターンに基づく最適状態提案

この包括的な要件定義により、ユーザーのあらゆる作業シーンに適応できる究極のアダプティブチャットUIシステムを実現します。3つの既存パターンの長所を統合し、シームレスな状態遷移により、従来のチャットUIの概念を根本から革新する次世代インターフェースとなります。