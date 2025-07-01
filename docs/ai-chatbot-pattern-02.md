# AIチャットボット実装戦略 - パターン02（浮遊ドラッグ可能モーダル）

## 要件概要
- 浮遊チャットボタンをクリックでモーダル表示
- モーダルサイズ: 横400px × 縦700px
- 初期位置: 右下付近に浮遊
- マウスでドラッグして自由に移動可能
- 右下コーナーをドラッグしてリサイズ可能

## 技術的実装戦略

### 1. アーキテクチャ設計

#### コンポーネント構成
```
src/components/feature/blueprint-detail/02/
├── ChatButton.tsx              # 浮動チャットボタン（01と同じ）
├── FloatingChatModal.tsx       # ドラッグ＆リサイズ可能なモーダル
├── ChatContent.tsx             # チャット本体（メッセージ+入力）
├── ChatMessage.tsx             # 個別メッセージ（01から流用）
├── ChatInput.tsx               # 入力エリア（01から流用）
├── hooks/
│   ├── useDraggable.ts         # ドラッグ機能フック
│   └── useResizable.ts         # リサイズ機能フック
├── types.ts                    # TypeScript型定義
└── index.tsx                   # メインコンポーネント
```

### 2. ドラッグ機能実装

#### useDraggableフック設計
```typescript
interface DraggableState {
  position: { x: number; y: number };
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

const useDraggable = (initialPosition: { x: number; y: number }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = (e: MouseEvent) => { /* ドラッグ開始 */ };
  const handleMouseMove = (e: MouseEvent) => { /* ドラッグ中 */ };
  const handleMouseUp = () => { /* ドラッグ終了 */ };
  
  return { position, isDragging, dragHandlers };
};
```

#### 実装詳細
- **マウスイベント**: mousedown → mousemove → mouseup
- **タッチ対応**: touchstart → touchmove → touchend
- **境界制限**: 画面外に出ないよう制限
- **パフォーマンス**: requestAnimationFrame使用

### 3. リサイズ機能実装

#### useResizableフック設計
```typescript
interface ResizableState {
  size: { width: number; height: number };
  isResizing: boolean;
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
}

const useResizable = (initialSize: { width: number; height: number }) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  
  return { size, isResizing, resizeHandlers };
};
```

#### リサイズハンドル配置
- **右下コーナー**: メインリサイズハンドル
- **視覚的フィードバック**: ホバー時にカーソル変更
- **最小・最大サイズ制限**: 300x400 ～ 800x900px

### 4. モーダル設計

#### FloatingChatModal仕様
```typescript
interface FloatingChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}
```

#### レイアウト構成
```
┌─ Modal Container (ドラッグ可能) ──────────┐
│ ┌─ Header (ドラッグハンドル) ──────────┐ │
│ │ [AI アシスタント]           [×] │ │
│ └─────────────────────────────────────┘ │
│ ┌─ Messages Area ─────────────────────┐ │
│ │                                   │ │
│ │  メッセージリスト                    │ │
│ │                                   │ │
│ └─────────────────────────────────────┘ │
│ ┌─ Input Area ────────────────────────┐ │
│ │ [+] [入力欄............] [送信]    │ │
│ └─────────────────────────────────────┘ │
│                              [□] リサイズ │
└─────────────────────────────────────────┘
```

### 5. 状態管理

#### モーダル状態
```typescript
interface ChatModalState {
  isOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isDragging: boolean;
  isResizing: boolean;
  zIndex: number;
}
```

#### 初期設定
- **初期位置**: `{ x: window.innerWidth - 450, y: 100 }`
- **初期サイズ**: `{ width: 400, height: 700 }`
- **zIndex**: 1000（他要素より前面）

### 6. CSS実装

#### 位置制御
```css
.floating-chat-modal {
  position: fixed;
  transform: translate(var(--x), var(--y));
  width: var(--width);
  height: var(--height);
  z-index: var(--z-index);
  transition: none; /* ドラッグ中はtransition無効 */
}
```

#### ドラッグ中スタイル
```css
.dragging {
  user-select: none;
  cursor: grabbing;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
}
```

#### リサイズハンドル
```css
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nw-resize;
  background: linear-gradient(-45deg, transparent 0%, transparent 40%, #ccc 40%, #ccc 60%, transparent 60%);
}
```

### 7. パフォーマンス最適化

#### ドラッグ最適化
- `requestAnimationFrame`でスムーズな移動
- デバウンス処理で過度な再描画防止
- GPU加速（transform使用）

#### メモリ最適化
- イベントリスナーの適切なクリーンアップ
- useCallback/useMemoでレンダリング最適化

### 8. アクセシビリティ

#### キーボード操作
- `Escape`キーでモーダルを閉じる
- `Tab`キーでフォーカス移動
- `Enter`キーでドラッグ開始/終了

#### スクリーンリーダー対応
- `role="dialog"`属性
- `aria-labelledby`でタイトル関連付け
- フォーカストラップ実装

### 9. レスポンシブ対応

#### モバイルデバイス
- タッチイベント対応
- 画面サイズに応じたモーダルサイズ調整
- 小画面では全画面表示オプション

#### タブレット
- タッチドラッグ対応
- 適切なタッチターゲットサイズ

### 10. 境界制御

#### ドラッグ制限
```typescript
const constrainPosition = (pos: { x: number; y: number }, size: { width: number; height: number }) => {
  const maxX = window.innerWidth - size.width;
  const maxY = window.innerHeight - size.height;
  
  return {
    x: Math.max(0, Math.min(pos.x, maxX)),
    y: Math.max(0, Math.min(pos.y, maxY))
  };
};
```

#### リサイズ制限
- 最小サイズ: 300x400px
- 最大サイズ: 画面サイズの80%
- アスペクト比保持オプション

### 11. 実装優先度

#### Phase 1: 基本機能
1. 基本モーダル表示
2. ドラッグ機能実装
3. リサイズ機能実装

#### Phase 2: UX向上
1. アニメーション追加
2. 境界制御強化
3. パフォーマンス最適化

#### Phase 3: 高度機能
1. 最小化/最大化機能
2. 複数ウィンドウ対応
3. 位置記憶機能

### 12. 技術的課題と解決策

#### 課題1: パフォーマンス
- **解決策**: transform + requestAnimationFrame

#### 課題2: イベント競合
- **解決策**: イベント委譲とpreventDefault適切使用

#### 課題3: ブラウザ互換性
- **解決策**: PointerEvents API使用とfallback実装

この戦略により、直感的で使いやすい浮遊ドラッグ可能チャットモーダルを実現できます。