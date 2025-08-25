# Step Indicator

マルチステップフォームやワークフローで使用するステップ表示コンポーネントです。現在のステップ、完了ステップ、未完了ステップを視覚的に表示し、レスポンシブデザインに対応しています。

## 使用場面

- **マルチステップフォーム**: 会員登録、見積作成、注文プロセスなど
- **ワークフロー表示**: タスクの進捗状況、承認フローなど
- **プロセス可視化**: 手続きの段階表示、設定ウィザードなど

## 基本的な使い方

### 1. 型定義のインポート

```typescript
import { Step, StepIndicatorProps } from "@/shared/step-indicator/model/types";
```

### 2. コンポーネントの使用

```tsx
import { StepIndicator } from "@/shared/step-indicator/ui/StepIndicator";
import { useState } from "react";

function MyComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { id: 1, title: "基本情報入力" },
    { id: 2, title: "詳細設定" },
    { id: 3, title: "確認・完了" }
  ];

  return (
    <div className="p-4">
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep} 
        className="mb-6"
      />
      {/* フォームコンテンツ */}
    </div>
  );
}
```

## Props

### StepIndicatorProps

| プロパティ | 型 | 説明 | 必須 |
|-----------|---|------|------|
| `steps` | `Step[]` | ステップの配列 | ✓ |
| `currentStep` | `number` | 現在のステップID | ✓ |
| `className` | `string?` | 追加のCSSクラス | - |

### Step

| プロパティ | 型 | 説明 | 必須 |
|-----------|---|------|------|
| `id` | `number` | ステップの一意のID | ✓ |
| `title` | `string` | ステップのタイトル | ✓ |

## 使用例

### 見積作成フォーム

```tsx
const quotationSteps = [
  { id: 1, title: "案件情報入力" },
  { id: 2, title: "図面情報入力" },
  { id: 3, title: "自社情報入力" }
];

function QuotationForm() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <StepIndicator 
          steps={quotationSteps} 
          currentStep={currentStep} 
          className="mb-4"
        />
      </div>
      <div className="flex-1">
        {/* ステップごとのフォームコンテンツ */}
      </div>
    </div>
  );
}
```

### ユーザー登録ワークフロー

```tsx
const registrationSteps = [
  { id: 1, title: "アカウント作成" },
  { id: 2, title: "プロフィール設定" },
  { id: 3, title: "メール認証" },
  { id: 4, title: "完了" }
];

function UserRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < registrationSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <StepIndicator 
        steps={registrationSteps} 
        currentStep={currentStep}
      />
      {/* ステップコンテンツ */}
      <button onClick={nextStep} className="mt-4">
        次へ
      </button>
    </div>
  );
}
```

## デザイン仕様

### ステップ状態

- **完了ステップ**: 緑色の背景、白色のチェックアイコン
- **現在ステップ**: プライマリ色の背景、白色のステップ番号
- **未完了ステップ**: 白色の背景、グレーのステップ番号

### レスポンシブ対応

- **デスクトップ**: ステップタイトルを横並びで表示
- **モバイル**: ステップタイトルを非表示にし、現在のステップタイトルを下部に表示

## 技術的特徴

- **Lucide React**: チェックアイコンにLucide Reactを使用
- **TailwindCSS**: レスポンシブスタイリング、カスタマイズ可能
- **型安全**: TypeScriptによる型定義で開発時のエラーを防止
- **アクセシビリティ**: 視覚的な状態表示で進捗を明確に伝達

## 注意事項

- ステップIDは1から始まる連番で設定してください
- `currentStep`は存在するステップIDと一致させてください
- モバイルでのタイトル表示は現在のステップのみです
- カスタムスタイリングは`className`プロパティで追加してください