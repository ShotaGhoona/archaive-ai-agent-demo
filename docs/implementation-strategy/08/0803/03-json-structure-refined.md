# 03. JSON構造の改善案 - セクション単位での管理

## 現状の問題点

実際にデータを作成してみて以下の課題が見えてきました：

1. **ページ単位の管理の限界**
   - 1つのPDFが64ページもある場合、ページごとに分けると煩雑
   - 関連するページがバラバラになり、文脈が失われる
   - 同じ資料内でも異なるセクションが混在（例：5ページ目から別資料）

2. **情報の断片化**
   - 確定仕様書の「主要仕様」と「振動ミル仕様」が別々のページとして管理される
   - 本来一体として理解すべき情報が分断される

## 改善案：フラットなセクション管理

### 新しいJSON構造

```json
{
  "sections": [
    {
      "section_id": "SEC-001",
      "section_name": "確定仕様書_主要仕様",
      "document_id": "DOC-1996-CD50N3",
      "page_numbers": [1],
      "tags": ["仕様書", "確定仕様", "粉砕機", "主要仕様"],
      "content_type": "specification",
      "format": "structured",
      "content": {
        "機器名称": "竪型ローラミル",
        "処理能力": {
          "石灰石": {
            "raw_capacity": "80 t/h",
            "product_fineness": "3000 cm²/g"
          },
          "石炭": {
            "raw_capacity": "10 t/h",
            "product_fineness": "3200 cm²/g"
          }
        },
        "motor_specs": {
          "main_motor": "1750 kW × 6.6 kV × 50 Hz",
          "classifier_motor": "110 kW × 400 V × 50 Hz"
        }
      }
    },
    {
      "section_id": "SEC-002", 
      "section_name": "確定仕様書_主要機器仕様",
      "document_id": "DOC-1996-CD50N3",
      "page_numbers": [2],
      "tags": ["仕様書", "設備仕様", "粉砕機", "機器詳細"],
      "content_type": "specification",
      "format": "structured",
      "content": {
        "粉砕機": {
          "型式": "CD-50 竪型ローラミル",
          "粉砕ローラ": {
            "数量": "4個",
            "径": "2300 mm",
            "幅": "1500 mm",
            "材質": "TMT-4仕様"
          },
          "粉砕テーブル": {
            "寸法": "φ5000",
            "回転数": "17.5 rpm",
            "材質": "SEハード盤と同等品"
          }
        }
      }
    },
    {
      "section_id": "SEC-003",
      "section_name": "トラブル報告_ベアリング損傷",
      "document_id": "DOC-1996-CD50N3",
      "page_numbers": [5, 6],
      "tags": ["トラブル", "ベアリング", "潤滑不良", "メンテナンス"],
      "content_type": "trouble_report",
      "format": "structured",
      "content": {
        "date": "1996-03-15",
        "issue": "粉砕ローラーベアリング損傷",
        "cause": "潤滑不良",
        "action": "ベアリング交換、給油システム改善",
        "downtime": "48時間",
        "cost": "150万円",
        "lessons_learned": "定期的な給油点検の重要性"
      }
    }
  ],
  "document_definitions": {
    "DOC-1996-CD50N3": {
      "document_name": "【社外秘】CD-50-N3電気化学工業株式会社",
      "total_pages": 64,
      "created_date": "1996-01-01",
      "customer": "電気化学工業株式会社",
      "project_id": "CD-50-N3",
      "equipment_type": "竪型ローラミル",
      "confidentiality": "社外秘",
      "file_path": "path/to/original/pdf"
    },
    "DOC-2017-08-001": {
      "document_name": "クマガイ特殊鋼見積依頼資料",
      "total_pages": 4,
      "created_date": "2017-08-22",
      "customer": "中央化工機株式会社",
      "project_id": "683033",
      "file_path": "path/to/original/pdf"
    }
  },
  "section_type_definitions": {
    "specification": {
      "description": "仕様書セクション",
      "typical_structure": ["主要仕様", "機器仕様", "性能保証"],
      "ai_weight": 1.2
    },
    "trouble_history": {
      "description": "トラブル履歴セクション",
      "typical_structure": ["発生日", "事象", "原因", "対策"],
      "ai_weight": 1.5
    },
    "maintenance_record": {
      "description": "メンテナンス記録",
      "typical_structure": ["実施日", "作業内容", "交換部品"],
      "ai_weight": 1.1
    },
    "drawing": {
      "description": "図面セクション",
      "typical_structure": ["全体図", "詳細図", "部品リスト"],
      "ai_weight": 1.0
    }
  }
}
```

## メリット

### 1. シンプルでフラットな構造
- 階層が深くならず、データ構造が明確
- document_idでドキュメント情報を参照
- page_numbersは配列として柔軟に管理

### 2. タグベースの柔軟な検索
- ドキュメント名やページ番号もタグ的に扱える
- 複数の観点から検索可能
- AIが文脈に応じて適切なセクションを選択

### 3. 独立したセクション管理
- 各セクションが独立して存在
- 必要に応じてセクションを追加・削除が容易
- サブセクションという概念を排除してシンプルに

### 4. ドキュメント定義の分離
- ドキュメントのメタ情報を別管理
- セクションデータの重複を防ぐ
- ドキュメント全体の情報を一元管理

## 実装上の工夫

### 1. ハイブリッドアプローチ
```json
{
  "content": {
    "structured_data": {
      // きれいに整理されたデータ
    },
    "raw_text": "OCRや手書きメモのテキスト",
    "page_references": [
      {
        "page": 5,
        "content": "このページ特有の情報"
      }
    ]
  }
}
```

### 2. AIプロンプトでの活用
```typescript
const buildContextForAI = (query: string, sections: Section[]) => {
  // トラブル関連の質問の場合
  if (query.includes("トラブル") || query.includes("不具合")) {
    // トラブルタグを持つセクションを優先的に抽出
    const troubleSections = sections
      .filter(section => section.tags.includes("トラブル"));
    
    // 関連するドキュメント情報も含める
    const documentIds = [...new Set(troubleSections.map(s => s.document_id))];
    const documentInfo = documentIds.map(id => document_definitions[id]);
    
    return {
      primary_sections: troubleSections,
      document_context: documentInfo
    };
  }
};
```

### 3. 段階的なデータ投入
1. 最初は主要セクションのみ構造化
2. 必要に応じて詳細データを追加
3. OCRが必要なページは後から追加

## 移行方法

既存のページ単位の構造からセクション単位への移行：

```javascript
// 移行スクリプトの例
const migrateToSections = (oldData) => {
  const sections = [];
  let currentSection = null;
  
  oldData.pages.forEach((page, index) => {
    // タグや内容から自動的にセクションを判定
    if (isNewSection(page)) {
      if (currentSection) sections.push(currentSection);
      currentSection = createNewSection(page);
    } else {
      currentSection.pages.push(page);
    }
  });
  
  return sections;
};
```

## 使用例

### データ追加時
```json
{
  "section_id": "SEC-004",
  "section_name": "見積もり遅延メモ",
  "document_id": "DOC-2017-08-001",
  "page_numbers": [3],
  "tags": ["トラブル", "見積もり遅延", "メモ", "顧客対応"],
  "content_type": "memo",
  "format": "unstructured",
  "content": {
    "text": "見積もり依頼\n返事遅い\n顧客から催促の電話\n至急対応要",
    "date": "2017-08-25",
    "author": "山田"
  }
}
```

### 検索例
```javascript
// トラブル関連のセクションを検索
const troubleSections = sections.filter(s => s.tags.includes("トラブル"));

// 特定のドキュメントのセクションを検索
const docSections = sections.filter(s => s.document_id === "DOC-1996-CD50N3");

// ページ番号で検索
const page5Sections = sections.filter(s => s.page_numbers.includes(5));
```

## まとめ

この改善されたフラット構造により：
- **シンプルで理解しやすい**データ構造
- **柔軟なタグベース検索**で必要な情報に素早くアクセス
- **ドキュメント情報の一元管理**で重複を排除
- **セクション単位の独立性**で追加・更新が容易

64ページのような大きな文書でも、各セクションを独立して管理することで、カコトラAIがより効率的に適切な情報を引き出せるようになります。