// 仕様書データの型定義
export interface SpecificationData {
  // 基本情報
  specification_id: string;     // 仕様書ID（主キー）
  product_id: string;           // 製品ID（紐付けID）
  image_url: string;            // 仕様書画像URL
  
  // システム情報
  created_date: string;         // 作成日時（ISO 8601形式）
  created_user_id: string;      // 作成者
  modified_date: string;        // 更新日時（ISO 8601形式）
  modified_user_id: string;     // 更新者
  remarks: string;              // 備考
}