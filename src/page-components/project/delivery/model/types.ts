// 納品書データの型定義
export interface DeliveryData {
  // 基本情報
  delivery_id: string;          // 納品書ID（主キー）
  project_id: string;           // 案件ID
  delivery_number: string;      // 納品書番号
  delivery_date: string;        // 納品日（ISO 8601形式）
  delivery_address: string;     // 納品先
  delivery_details: string;     // 品目・数量
  image_url: string;            // 納品書画像URL
  
  // システム情報
  created_date: string;         // 作成日時（ISO 8601形式）
  created_user_id: string;      // 作成者
  modified_date: string;        // 更新日時（ISO 8601形式）
  modified_user_id: string;     // 更新者
  remarks: string;              // 備考
}