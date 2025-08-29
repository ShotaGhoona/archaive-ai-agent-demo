// 送り状データの型定義
export interface ShippingData {
  // 基本情報
  shipping_note_id: string;     // 送り状ID（主キー）
  project_id: string;           // 案件ID
  shipping_date: string;        // 出荷日（ISO 8601形式）
  image_url: string;            // 送り状画像URL
  
  // システム情報
  created_date: string;         // 作成日時（ISO 8601形式）
  created_user_id: string;      // 作成者
  modified_date: string;        // 更新日時（ISO 8601形式）
  modified_user_id: string;     // 更新者
  remarks: string;              // 備考
}