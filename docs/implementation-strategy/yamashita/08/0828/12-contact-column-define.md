| カラム             | カラム名        | データ型      | 必須 | 例                                                                      |
| ------------------ | --------------- | ------------- | ---- | ----------------------------------------------------------------------- |
| 連絡先ID（主キー） | contact_id      | VARCHAR(20)   | ○    |                                                                         |
| 姓                 | last_name       | VARCHAR(100)  | ○    | 田中                                                                    |
| 名                 | first_name      | VARCHAR(100)  | ○    | 祐希                                                                    |
| 姓（カナ）         | last_name_kana  | VARCHAR(100)  |      | タナカ                                                                  |
| 名（カナ）         | first_name_kana | VARCHAR(100)  |      | ユウキ                                                                  |
| 役職               | title           | VARCHAR(100)  |      | CTO                                                                     |
| 部署名             | department      | VARCHAR(100)  |      | 開発部                                                                  |
| 主要メールアドレス | email_primary   | VARCHAR(255)  |      | yuuki.tanaka@starup01.jp                                                |
| 副メールアドレス   | email_secondary | VARCHAR(255)  |      | [yuki.11.soccer.fukui@gmail.com](mailto:yuki.11.soccer.fukui@gmail.com) |
| 会社電話番号       | phone_office    | VARCHAR(50)   |      | 00000000000                                                             |
| 携帯電話番号       | phone_mobile    | VARCHAR(50)   |      | 08000000000                                                             |
| FAX番号            | fax             | VARCHAR(50)   |      | 00000000000                                                             |
| 担当営業ID         | owner_user_id   | VARCHAR(20)   | ○    |                                                                         |
| 連絡先概要         |                 | VARCHAR(2550) |      |                                                                         |
| ステータス         | status          | BOOLEAN       | ○    | 有効/無効                                                               |
| 作成日時           | created_date    | DATETIME      | ○    |                                                                         |
| 作成者             | created_date    | DATETIME      | ○    |                                                                         |
| 最終更新日時       | modified_date   | DATETIME      | ○    |                                                                         |
| 最終更新者         | modified_date   | DATETIME      | ○    |                                                                         |
