# 11. MVP版ページベースJSON構造

## 概要
MVP（Minimum Viable Product）として、最小限の情報でトラブル・見積もり・仕様書を管理するシンプルなJSON構造です。

## 基本構造

```json
{
  "documents": [
    {
      "document_id": "DOC-1996-CD50N3",
      "document_name": "CD-50-N3電気化学工業株式会社",
      "customer": "電気化学工業千葉工場",
      "pages": [
        {
          "page_number": 1,
          "trouble": {
            "exists": false
          },
          "estimate": {
            "exists": false
          },
          "specification": {
            "exists": true,
            "content": {
              "処理能力": {
                "石灰石": "80 t/h",
                "石炭": "10 t/h"
              },
              "電動機": {
                "主電動機": "1750 kW × 6.6 kV",
                "分級機": "110 kW × 400 V"
              }
            }
          }
        },
        {
          "page_number": 2,
          "trouble": {
            "exists": false
          },
          "estimate": {
            "exists": false
          },
          "specification": {
            "exists": true,
            "content": {
              "粉砕ローラー": {
                "数量": "4個",
                "寸法": "径2300 × 幅1500 mm",
                "重量": "4400 kg/個"
              },
              "粉砕テーブル": {
                "直径": "φ5000 mm",
                "回転数": "17.5 rpm"
              }
            }
          }
        }
      ]
    }
  ]
}
```

## シンプルな型定義（MVP版）

```typescript
interface Document {
  document_id: string;      // ドキュメントID
  document_name: string;    // ドキュメント名
  customer: string;         // 顧客名
  pages: Page[];           // ページ配列
}

interface Page {
  page_number: number;      // ページ番号
  trouble: {
    exists: boolean;        // トラブル情報の有無
    date?: string;          // 発生日（existsがtrueの場合）
    text?: string;          // 説明（existsがtrueの場合）
    detail?: any;           // 詳細（existsがtrueの場合）
  };
  estimate: {
    exists: boolean;        // 見積もり情報の有無
    // 今後拡張予定
  };
  specification: {
    exists: boolean;        // 仕様書情報の有無
    content?: any;          // 仕様内容（existsがtrueの場合）
  };
}

// 画像パスは自動生成
function getImagePath(documentId: string, pageNumber: number): string {
  return `/ai/agent/${documentId}/${pageNumber}`;
}
```

## 検索シナリオ例

### 1. トラブル検索
```javascript
// 全ドキュメントからトラブルが存在するページを検索
const troublePages = documents.flatMap(doc => 
  doc.pages.filter(page => page.trouble.exists)
    .map(page => ({...page, document_name: doc.document_name}))
);

// 特定期間のトラブルを検索
const recentTroubles = documents.flatMap(doc =>
  doc.pages.filter(page => 
    page.trouble.exists && 
    page.trouble.date >= '2024-01-01'
  )
);
```

### 2. 見積もり検索
```javascript
// 見積もりページを検索
const estimatePages = documents.flatMap(doc =>
  doc.pages.filter(page => page.estimate.exists)
);

// 金額範囲で検索
const highValueEstimates = documents.flatMap(doc =>
  doc.pages.filter(page => 
    page.estimate.exists && 
    page.estimate.total_amount > 1000000
  )
);
```

### 3. 仕様書検索
```javascript
// 仕様書ページを検索
const specPages = documents.flatMap(doc =>
  doc.pages.filter(page => page.specification.exists)
);

// キーワード検索
const rollerSpecs = documents.flatMap(doc =>
  doc.pages.filter(page => 
    page.specification.exists &&
    JSON.stringify(page.specification.content).includes('ローラー')
  )
);
```

## AIチャット活用例

### プロンプト構築
```typescript
function buildAIContext(query: string, documents: Document[]) {
  let relevantPages = [];
  
  documents.forEach(doc => {
    const pages = doc.pages.filter(page => {
      if (query.includes('トラブル')) return page.trouble.exists;
      if (query.includes('見積')) return page.estimate.exists;
      if (query.includes('仕様')) return page.specification.exists;
      return false;
    });
    
    relevantPages.push(...pages.map(p => ({
      ...p,
      document_name: doc.document_name,
      customer: doc.customer
    })));
  });
  
  return {
    query: query,
    context: relevantPages,
    images: relevantPages.map(p => p.image.path)
  };
}
```

### レスポンス例
```typescript
// AIからの応答に画像リンクを含める
const aiResponse = {
  text: "粉砕ローラーの仕様は以下の通りです：",
  details: "径2300mm × 幅1500mm、4個、重量4400kg/個",
  reference: {
    document_id: "DOC-1996-CD50N3",
    document_name: "CD-50-N3電気化学工業株式会社",
    page_number: 2,
    image_url: "/ai/agent/DOC-1996-CD50N3/2",
    clickable_link: "[仕様書を見る](/ai/agent/DOC-1996-CD50N3/2)"
  }
};
```

## MVP版のメリット

1. **最小限でシンプル**
   - 必要最小限の情報のみ
   - 理解しやすく実装が簡単

2. **exists フラグで高速検索**
   ```javascript
   // トラブルページをすぐに見つけられる
   const troublePages = doc.pages.filter(p => p.trouble.exists);
   ```

3. **画像パスが規則的**
   - `/ai/agent/{document_id}/{page_number}` で統一
   - JSONに画像パスを保存する必要なし

4. **段階的な拡張が可能**
   - まずは exists フラグのみ実装
   - 後から content を追加

## 実装例（トラブルがあるページ）

```json
{
  "page_number": 15,
  "trouble": {
    "exists": true,
    "date": "2024-01-15",
    "text": "粉砕ローラーベアリング異音",
    "detail": {
      "cause": "潤滑不良",
      "solution": "グリース交換実施"
    }
  },
  "estimate": {
    "exists": false
  },
  "specification": {
    "exists": false
  }
}
```

画像URL: `/ai/agent/DOC-1996-CD50N3/15`

このMVP構造で、デモに必要な機能を最速で実現できます。