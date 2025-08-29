// 請求書データの型定義
export interface InvoiceData {
  // 基本情報
  invoice_id: string;           // 請求書ID（主キー）
  project_id: string;           // 案件ID
  image_url: string;            // 請求書画像URL
  
  // システム情報
  created_date: string;         // 作成日時（ISO 8601形式）
  created_user_id: string;      // 作成者
  modified_date: string;        // 更新日時（ISO 8601形式）
  modified_user_id: string;     // 更新者
  remarks: string;              // 備考
}