# 02. カコトラAI用JSONデータ構造のアイディア

## 概要
トラブル情報だけでなく、図面や見積書など様々な資料を統合的に管理できるJSON構造を設計する。タグシステムにより、AIが文脈に応じて適切な資料を参照できるようにする。

## 提案するJSON構造

### 1. 基本構造
```json
{
  "documents": [
    {
      "document_id": "DOC-2017-08-001",
      "document_name": "クマガイ特殊鋼見積依頼資料",
      "total_pages": 4,
      "created_date": "2017-08-22",
      "pages": [
        {
          "page_number": 1,
          "tags": ["図面", "部品情報"],
          "content_type": "technical_drawing",
          "format": "structured",
          "content": {
            // content_typeに応じた詳細情報
          }
        },
        {
          "page_number": 3,
          "tags": ["トラブル", "見積もり遅延"],
          "content_type": "memo",
          "format": "unstructured",
          "content": {
            "text": "見積もり遅延について\n顧客から催促あり\n至急対応必要\n担当者不在が原因\n引き継ぎ改善要"
          }
        }
      ],
      "metadata": {
        "customer": "中央化工機株式会社",
        "project_id": "683033",
        "status": "resolved"
      }
    }
  ],
  "tag_definitions": {
    "トラブル": {
      "description": "製造・加工・納期等の問題事例",
      "priority": "high",
      "ai_weight": 1.5
    },
    "図面": {
      "description": "技術図面・設計図",
      "priority": "medium",
      "ai_weight": 1.0
    },
    "見積もり": {
      "description": "価格見積もり・コスト関連",
      "priority": "medium",
      "ai_weight": 0.8
    }
  },
  "content_type_definitions": {
    "technical_drawing": {
      "description": "技術図面データ",
      "expected_format": "structured"
    },
    "quotation_form": {
      "description": "見積書フォーム",
      "expected_format": "structured"
    },
    "trouble_report": {
      "description": "トラブル報告書",
      "expected_format": "structured"
    },
    "memo": {
      "description": "メモ・走り書き",
      "expected_format": "unstructured"
    },
    "communication_log": {
      "description": "FAX・メール等の通信記録",
      "expected_format": "semi-structured"
    }
  }
}
```

### 2. コンテンツタイプ別の詳細構造の例

#### 構造化データ (format: "structured")

##### 技術図面 (content_type: "technical_drawing")
```json
{
  "page_number": 1,
  "tags": ["図面", "部品情報", "高張力鋼板"],
  "content_type": "technical_drawing",
  "format": "structured",
  "content": {
    "drawing_number": "683033DN0041936",
    "part_name": "特殊鋼部品",
    "material": "高張力鋼板",
    "dimensions": {
      "length": 1357,
      "width": 933,
      "thickness": 19,
      "unit": "mm"
    },
    "tolerances": {
      "general": "±0.5",
      "critical": "±0.1"
    },
    "revision": "A",
    "notes": ["表面処理：黒染め", "硬度：HRC45-50"]
  }
}
```

##### トラブル報告書 (content_type: "trouble_report")
```json
{
  "page_number": 3,
  "tags": ["トラブル", "見積もり遅延", "プロセス改善"],
  "content_type": "trouble_report",
  "format": "structured",
  "content": {
    "trouble_id": "TR-2017-08-001",
    "occurrence_date": "2017-08-25",
    "category": "見積もり遅延",
    "severity": "medium",
    "description": "見積もり依頼への対応が遅れ、顧客から催促のFAXを受信",
    "root_cause": "担当者の休暇中の引き継ぎ不備",
    "immediate_action": "FAX再送信と電話での謝罪・説明",
    "corrective_action": "見積もり依頼管理システムの導入",
    "preventive_measures": [
      "担当者不在時の自動通知システム",
      "見積もり依頼の48時間以内対応ルール"
    ],
    "impact": {
      "customer_satisfaction": "一時的に低下",
      "financial": "影響なし",
      "delivery": "影響なし"
    },
    "related_documents": ["DOC-2017-08-001"],
    "lessons_learned": "顧客対応の迅速性が信頼関係に直結する"
  }
}
```

#### 非構造化データ (format: "unstructured")

##### メモ形式のトラブル記録
```json
{
  "page_number": 5,
  "tags": ["トラブル", "加工不良", "メモ"],
  "content_type": "memo",
  "format": "unstructured",
  "content": {
    "text": "2017/8/30 加工トラブル\n軸径が0.02mm小さい\n原因：工具摩耗？\n対応：再加工で対応\n要確認：工具交換サイクル",
    "author": "山田",
    "date": "2017-08-30"
  }
}
```

##### 手書きメモのOCR結果
```json
{
  "page_number": 6,
  "tags": ["トラブル", "納期遅延", "手書きメモ"],
  "content_type": "memo",
  "format": "unstructured",
  "content": {
    "text": "8/25 鈴木様より\n納期遅れそう\n材料入荷遅延\n→ 9/5までに何とか\n代替材検討要",
    "ocr_confidence": 0.85,
    "original_format": "handwritten"
  }
}
```

#### 半構造化データ (format: "semi-structured")

##### 簡易トラブルリスト
```json
{
  "page_number": 7,
  "tags": ["トラブル", "月次報告", "品質管理"],
  "content_type": "trouble_list",
  "format": "semi-structured",
  "content": {
    "period": "2017年8月",
    "troubles": [
      {
        "date": "8/5",
        "issue": "寸法不良",
        "action": "再加工",
        "status": "完了"
      },
      {
        "date": "8/22",
        "issue": "見積もり遅延",
        "action": "システム改善",
        "status": "対応中"
      },
      {
        "date": "8/30",
        "issue": "材料不足",
        "action": "緊急発注",
        "status": "完了"
      }
    ]
  }
}
```

### 3. タグシステムの活用方法

#### タグの重み付け（ai_weight）
- AIがコンテキストに応じて優先的に参照すべきタグを判断
- トラブル関連の質問時は「トラブル」タグの重みを高く評価

#### 複合タグ検索
```json
{
  "search_example": {
    "tags": ["トラブル", "見積もり"],
    "operator": "AND",
    "description": "見積もりに関連したトラブル事例を検索"
  }
}
```

### 4. 拡張性を考慮した設計

#### 新しいタグの追加例
```json
{
  "tag_definitions": {
    "品質管理": {
      "description": "検査記録・品質保証関連",
      "priority": "high",
      "ai_weight": 1.2
    },
    "材料証明": {
      "description": "ミルシート・材料証明書",
      "priority": "medium",
      "ai_weight": 0.9
    },
    "メンテナンス": {
      "description": "保守・点検記録",
      "priority": "low",
      "ai_weight": 0.7
    }
  }
}
```

### 5. AIプロンプトでの活用例

```typescript
// カコトラAIのシステムプロンプト例
const buildSystemPrompt = (userQuery: string, documents: Document[]) => {
  // トラブル関連の質問を検出
  const isTroubleRelated = userQuery.includes("トラブル") || 
                          userQuery.includes("問題") || 
                          userQuery.includes("不具合");
  
  // タグに基づいてドキュメントをフィルタリング
  const relevantDocs = isTroubleRelated 
    ? documents.filter(doc => doc.tags.includes("トラブル"))
    : documents;
  
  return `
あなたは製造業の技術支援AIです。
以下の資料データベースを参照して回答してください。

${isTroubleRelated ? "【トラブル関連資料を重点的に参照】" : ""}

資料データ：
${JSON.stringify(relevantDocs, null, 2)}

ユーザーの質問に対して、関連する資料を引用しながら具体的に回答してください。
`;
};
```

### 6. メリット

1. **柔軟性**: 様々な種類の資料を統一的に管理
2. **検索性**: タグによる効率的な情報検索
3. **拡張性**: 新しい資料タイプやタグの追加が容易
4. **文脈理解**: AIが質問の文脈に応じて適切な資料を参照
5. **トレーサビリティ**: 資料間の関連性を明確に記録

### 7. 実装時の注意点

1. **データサイズ**: 大量の資料を扱う場合はページネーションやインデックス化を検討
2. **タグの一貫性**: タグ付けルールを明確にして一貫性を保つ
3. **プライバシー**: 顧客情報や機密情報の適切な管理
4. **バージョン管理**: 資料の更新履歴を記録する仕組み

この構造により、カコトラAIは質問の内容に応じて適切な資料を効率的に参照し、より精度の高い回答を提供できるようになります。