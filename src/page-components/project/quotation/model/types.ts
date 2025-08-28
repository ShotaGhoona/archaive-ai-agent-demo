// 見積書データの型定義
export interface QuotationData {
  // 基本情報
  project_id: string;           // 案件ID
  quote_id: string;             // 見積書ID（主キー）
  quote_number: string;         // 見積番号（自動採番）
  customer_id: string;          // 顧客ID
  quote_details: string;        // 品目・数量・単価（JSON文字列）
  total_amount: number;         // 金額
  image_url: string;            // 見積書画像URL
  
  // システム情報
  created_date: string;         // 作成日時（ISO 8601形式）
  created_user_id: string;      // 作成者
  modified_date: string;        // 更新日時（ISO 8601形式）
  modified_user_id: string;     // 更新者
  remarks: string;              // 備考
}