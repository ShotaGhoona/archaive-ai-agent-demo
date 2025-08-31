| カラム             | カラム名          | データ型      | 必須 | 備考                                       |
| ------------------ | ----------------- | ------------- | ---- | ------------------------------------------ |
| 取引先ID（主キー） | account_id        | VARCHAR(20)   | ○    | システムとしての管理IDとして使用して良い。 |
| 取引先ID(業務)     |                   | VARCHAR(20)   | ○    |                                            |
| 取引先名           | account_name      | VARCHAR(255)  | ○    |                                            |
| 取引先名（カナ）   | account_name_kana | VARCHAR(255)  |      |                                            |
| 取引先種別         | account_type      | VARCHAR(50)   | ○    |                                            |
| ステータス         | status            | VARCHAR(50)   | ○    |                                            |
| 年間売上高         | annual_revenue    | DECIMAL(15,0) |      |                                            |
| 従業員数           | employee_count    | INT           |      |                                            |
| Webサイト          | website           | VARCHAR(255)  |      |                                            |
| 取引先概要         | description       | TEXT          |      |                                            |
| 作成日時           | created_date      | DATETIME      | ○    |                                            |
| 作成者             | created_date      | DATETIME      | ○    |                                            |
| 最終更新日時       | modified_date     | DATETIME      | ○    |                                            |
| 最終更新者         | modified_date     | DATETIME      | ○    |                                            |
