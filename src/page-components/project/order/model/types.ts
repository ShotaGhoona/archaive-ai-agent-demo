// 受注書データの型定義
export interface OrderData {
  // 基本情報
  order_id: string;             // 受注書ID（主キー）
  project_id: string;           // 案件ID
  order_number: string;         // 受注番号
  order_date: string;           // 受注日（ISO 8601形式）
  customer_id: string;          // 顧客ID
  image_url: string;            // 受注書画像URL
  
  // システム情報
  created_date: string;         // 作成日時（ISO 8601形式）
  created_user_id: string;      // 作成者
  modified_date: string;        // 更新日時（ISO 8601形式）
  modified_user_id: string;     // 更新者
  remarks: string;              // 備考
}