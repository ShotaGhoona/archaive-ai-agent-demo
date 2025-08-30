| カラム | カラム名 | データ型 | 必須 | デフォルト値 | 概要 | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| 受注書ID | order_id | VARCHAR(20) | ○ | - | 受注書の一意識別子 | 主キー |
| 案件ID | project_id | VARCHAR(20) | ○ | - | 案件を一意に識別 | **紐付けID** |
| 受注番号 | order_number | VARCHAR(50) | - | - | 顧客からの注文番号 |  |
| 受注日 | order_date | DATETIME |  | - | 受注日 | これ、必要か？ |
| 顧客名 | customer_id | VARCHAR(20) | ○ | - | 顧客情報 | 紐づいている案件/取引先idから参照 |
| 作成日時 | created_date | DATETIME | ○ | - | レコード作成日時 |  |
| 作成者 | created_user_id | VARCHAR(20) | ○ | - | レコード作成者 |  |
| 更新日時 | modified_date | DATETIME | ○ | - | 最終更新日時 |  |
| 更新者 | modified_user_id | VARCHAR(20) | ○ | - | 最終更新ユーザー |  |
| 備考 | remarks | TEXT |  | - | 帳票に関しての備考 |  |