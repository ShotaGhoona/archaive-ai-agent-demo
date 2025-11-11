```mermaid
erDiagram
    COMPANIES {
        int id PK "NN, auto_increment"
        varchar(255) name "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on current_timestamp"
    }

    COMPANY_INFO {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        int invoice_number "インボイス番号"
        varchar(255) postal_code "郵便番号"
        varchar(255) company_address1 "NN"
        varchar(255) company_address2
        varchar(255) company_phone "NN"
        varchar(255) website "webサイト"
        varchar(255) company_logo_url "NN, {company_id}/company_assets/company_logo.[extension], ロゴ画像"
        varchar(255) company_seal_url "NN, {company_id}/company_assets/company_seal.[extension], 印影画像"
        varchar(255) ceo "代表者の名前"
        varchar(255) ceo_role "代表者役割"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    COMPANY_PLANS {
        int id PK "NN auto_increment"
        int company_id FK "NN"
        int plan_id FK "NN"
        datetime start_date "NN default_generated on current_timestamp"
        datetime end_date "NN"
        boolean is_active "NN"
        int included_editors "NN"
        int included_viewers "NN"
        int drawing_limit "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    PLANS {
        int id PK "NN auto_increment"
        varchar(255) name "NN"
        int default_drawing_limit "NN"
        int default_included_editors "NN"
        int default_included_viewers "NN"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    COMPANY_DOCUMENT_TYPES {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) type_name "NN, company_idとUNIQUE"
        int display_order "NN, company_idとUNIQUE"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    COMPANY_DOCUMENTS {
        int id PK "NN, auto_increment"
        int seq_number "NN, company_document_type_id, company_idとUNIQUE"
        int company_id FK "NN"
        int company_document_type_id FK "NN"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    COMPANY_DOCUMENT_VERSIONS {
        int id PK "NN, auto_increment"
        char(26) ulid "NN"
        int company_document_id FK "NN"
        int version "NN, default = 1"
        jsonb company_document_custom_items "company_document_custom_itemsを参照。自由項目をJSONで"
        varchar(255) name "NN"
        varchar(2083) s3_url "NN"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    COMPANY_DOCUMENT_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int company_document_type_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        boolean is_required	"NN, defautl = true (ユーザーからして必須項目かどうか)"
        int display_order "NN, company_document_type_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    COMPANY_DOCUMENT_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int company_document_custom_item_id FK "NN, option_valueとUNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    DEPARTMENTS {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) name "NN"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    EMPLOYEES {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        int authority_id FK "NN"
        varchar(255) name "NN"
        varchar(255) email  "UK1"
        int initial_login "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    LOGIN_INFOS {
        int id PK "NN, auto_increment"
        int employee_id FK "NN"
        varchar(255) login_id "NN"
        varchar(255) password "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
        varchar(1024) token
    }

    AUTHORITIES {
        int id PK "NN, auto_increment"
        varchar(255) name "NN, viewer または editor"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    POLICIES {
        int id PK "NN, auto_increment"
        jsonb policy "NN"
        boolean is_active "NN, default = true"
        int created_by FK
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    EMPLOYEE_DEPARTMENT {
        int id PK "NN, auto_increment"
        int department_id FK "NN, UK1"
        int employee_id FK "NN, UK1"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    CUSTOM_ROLES {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) name "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    EMPLOYEE_ROLE {
        int id PK "NN, auto_increment"
        int employee_id FK "NN"
        int custom_role_id FK "NN"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    CUSTOMERS {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        int seq_number "NN, 会社ごとの取引先の連番, DB側の設定で自動で入るようにする"
        varchar(255) name "NN"
        varchar(255) name_kana "名前のカナ"
        jsonb customer_custom_items "customer_custom_items テーブルを参照"
        int customer_status_id FK "customer_statusテーブルの外部キー。取引先の種別"
        float annual_revenue "年間売り上げ高"
        varchar(255) customer_address
        int head_count "従業員数"
        varchar(255) website "Webサイト"
        text remarks "備考欄"
        int in_charge FK "自社での営業担当者"
        int created_by FK "NN, 作成者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    CUSTOMER_STATUS {
        int id PK "NN, auto_increment"
        varchar(255) name "ステータスの名前。ユーザが自由に決めれる"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    CUSTOMER_CUSTOMER_TYPE {
        int id PK "NN, auto_increment"
        int customer_id FK "NN"
        int customer_type_id FK "NN"
    }

    CUSTOMER_TYPES {
        int id PK "NN, auto_increment"
        varchar(255) name "顧客タイプの名前"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    CUSTOMER_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        int display_order "NN, company_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    CUSTOMER_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int customer_custom_item_id FK "NN, option_valueとUNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    CUSTOMER_CONTACTS {
        int id PK "NN, auto_increment"
        int customer_id FK "NN"
        varchar(255) last_name "NN, 苗字"
        varchar(255) first_name "NN, 名前"
        varchar(255) last_name_kana ""
        varchar(255) first_name_kana ""
        jsonb customer_contact_custom_items "customer_contact_custom_itemsテーブル参照。自由項目をJSONで"
        varchar(50) phone_number "個人電話番号"
        varchar(50) office_phone_number "固定電話番号"
        varchar(255) email_primary "主メールアドレス"
        varchar(255) email_secondary "副メールアドレス"
        varchar(50) fax "fax番号"
        text remarks "備考欄"
        boolean is_active "NN, default = true, 有効かどうか"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    CUSTOMER_CONTACT_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        int display_order "NN, company_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    CUSTOMER_CONTACT_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int customer_contact_custom_item_id FK "NN, option_valueとUNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    DIRECTORY_CONTACTS {
        int id PK "NN, auto_increment"
        int customer_contact_id FK "NN"
        int directory_id FK "NN"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    DIRECTORIES {
        int id PK "NN, auto_increment"
        char(26) ulid "NN, UK1"
        int seq_number "NN, company_idとdirectory_type_idとUNIQUE"
        int company_id FK "NN"
        int directory_type_id "NN"
        int customer_id FK "NN"
        varchar(255) name
        jsonb directory_custom_item "自由項目をJSON形式で"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    DIRECTORY_PATH {
        int id PK "NN, auto_increment"
        int ancestor FK "NN"
        int descendant FK "NN"
        int depth "NN"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    DIRECTORY_TYPES {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) directory_type "NN"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    DIRECTORY_DOCUMENTS {
        int id PK "NN, auto_increment"
        char(26) ulid "NN, UK1"
        int seq_number "NN, directory_document_type_id, company_idとUNIQUE"
        int directory_id FK
        int company_id FK "NN"
        int directory_document_type_id FK "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    DIRECTORY_DOCUMENT_VERSIONS {
        int id PK "NN, auto_increment"
        char(26) ulid "NN"
        int directory_document_id FK "NN"
        int version "NN, default = 1"
        jsonb directory_document_custom_items "directory_document_custom_itemsテーブル自由項目をjSONで"
        varchar(255) name "NN"
        varchar(2083) s3_url "NN"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    SUPPLIER_QUOTATIONS {
        int id PK "NN, auto_increment"
        int directory_id FK "NN"
        int customer_id FK "NN"
        int company_id FK "NN"
        int seq_number "NN, company_idと連番"
        varchar(255) quotation_number "NN, 見積もり番号"
        date expiration_date "NN, 有効期限"
        int version "NN, default = 1"
        varchar(2083) s3_url
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    REVISION_SETS {
        int id PK "NN, auto_increment"
        char(26) ulid "NN"
        int company_id FK "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    LEAF_PRODUCTS {
        int id PK "NN, auto_increment"
        char(26) ulid "NN, UK1"
        int revision_set_id FK "NN, UK2"
        int directory_id FK "UK2"
        int customer_id FK "顧客ID"
        int revision_number "NN, default=1, UK2"
        jsonb leaf_product_custom_item "leaf_products参照。自由項目をjSONで"
        boolean is_latest "NN"
        tsvector search_text "全文検索用のカラム"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    DRAWING_FILES {
        int id PK "NN, auto_increment"
        char(26) ulid "NN"
        int leaf_product_id FK "NN"
        varchar(255) name "NN, ファイル名"
        varchar(255) file_extension "NN"
        varchar(2083) s3_url "実際の画像のS3パス"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    DRAWING_PAGES {
        int id PK "NN, auto_increment"
        char(26) ulid "NN"
        int seq_number "NN, 会社での連番, company_idとUNIQUE"
        int drawing_file_id FK "NN"
        varchar(255) drawing_number "NN, 図面番号"
        varchar(255) external_drawing_number "社外図面番号"
        varchar(255) drawing_category_id "NN"
        int page_number "NN, drawing_file_idとUNIQUE"
        boolean is_shown_similar_search "NN, default = true"
        varchar(2083) s3_url "実際の画像のS3パス"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    DRAWING_CATEGORIES {
        int id PK "NN auto_increment"
        varchar(255) name "NN, 図面のカテゴリ名、本図面、見積図面、検査図面、製作図面、その他などの文字列が入る"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    DRAWING_CATEGORY_RENAMES {
        int id PK "NN auto_increment"
        int company_id FK "NN"
        int drawing_category_id FK "NN company_id とUNIQUE"
        varchar(255) custom_name "NN"
        created_at datetime "NN"
        updated_at datetime "NN"
    }

    OCR {
        int id PK "NN, auto_increment"
        int drawing_page_id FK "NN"
        text text "NN"
        int x_min "NN"
        int y_min "NN"
        int x_max "NN"
        int y_max "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    SUPPLIER_QUOTES {
        int id PK "NN, auto_increment"
        char(26) ulid UK "NN"
        int supplier_quotation_id FK "NN"
        int leaf_product_id FK "NN"
        int version "NN, default = 1"
        int total_cost "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    QUOTE_ITEMS {
        int id PK "NN, auto_increment"
        int supplier_quote_id FK "NN"
        int quote_type_id FK "NN"
        varchar(255) name "NN"
        int unit_cost "NN, 単価"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    QUOTE_TYPE_QUANTITIES {
        int id PK "NN, auto_increment"
        int supplier_quote_id FK "NN"
        int quote_type_id FK "NN"
        int quantity "NN"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    QUOTE_TYPES {
        int id PK "NN, auto_increment"
        varchar(255) name "NN, 材料, 作業工程, 段取り工程, その他"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    LEAF_PRODUCT_DOCUMENTS {
        int id PK "NN, auto_increment"
        int leaf_product_id FK
        int seq_number "NN, leaf_product_document_type_id, company_idとUNIQUE"
        int company_id FK "NN"
        int leaf_product_document_type_id FK "NN"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    LEAF_PRODUCT_DOCUMENT_VERSIONS {
        int id PK "NN, auto_increment"
        char(26) ulid "NN"
        int leaf_product_document_id "NN, leaf_product_document_idとUNIQUE"
        int version "NN, default = 1"
        jsonb leaf_product_document_custom_items "leaf_product_document_custom_items テーブル参照。自由項目をJSONで"
        varchar(255) name "NN"
        varchar(2083) s3_url "NN"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    LEAF_PRODUCT_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        boolean is_required	"NN, defautl = true (ユーザーからして必須項目かどうか)"
        int display_order "NN, company_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    LEAF_PRODUCT_DOCUMENT_CUSTOM_ITEMS{
        int id PK "NN, auto_increment"
        int leaf_product_document_type_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        boolean is_required	"NN, defautl = true (ユーザーからして必須項目かどうか)"
        int display_order "NN, leaf_product_document_type_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    DIRECTORY_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int directory_type_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        boolean is_required	"NN, defautl = true (ユーザーからして必須項目かどうか)"
        int display_order "NN, directory_type_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    DIRECTORY_DOCUMENT_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int directory_document_type_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        boolean is_required	"NN, defautl = true (ユーザーからして必須項目かどうか)"
        int display_order "NN, directory_document_type_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }

    LEAF_PRODUCT_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int leaf_product_custom_item_id FK "NN, option_valueとUNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    LEAF_PRODUCT_DOCUMENT_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int leaf_product_document_custom_item_id FK "NN, option_valueとUNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    DIRECTORY_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int directory_custom_item_id FK "NN, option_valueとUNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    DIRECTORY_DOCUMENT_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int directory_document_custom_item_id FK "NN, option_valueとUNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    LEAF_PRODUCT_DOCUMENT_TYPES {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) type_name "NN, company_idとUNIQUE"
        int display_order "NN, company_idとUNIQUE"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    DIRECTORY_DOCUMENT_TYPES {
        int id PK "NN, auto_increment"
        int directory_type_id FK "NN"
        varchar(255) type_name "NN, directory_type_idとUNIQUE"
        int display_order "NN, directory_type_idとUNIQUE"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }

    CUSTOM_ITEM_TYPES {
        int id PK "NN, auto_increment"
        varchar(255) type "NN, ('NUMBER', 'STRING', 'SELECT', 'USER', 'DATE', 'BOOLEAN')"
        datetime created_at "default_generated"
        datetime updated_at "default_generated on update current_timestamp"
    }

    COMPANIES ||--|| COMPANY_INFO : "has"
    COMPANIES ||--o{ DEPARTMENTS : "has"
    COMPANIES ||--o{ CUSTOM_ROLES : "has"
    COMPANIES ||--o{ CUSTOMERS : "has"
    COMPANIES ||--o{ COMPANY_PLANS : ""
    COMPANIES ||--o{ LEAF_PRODUCT_CUSTOM_ITEMS : ""
    COMPANIES ||--o{ DIRECTORY_TYPES : ""
    COMPANIES ||--o{ DIRECTORIES : ""
    COMPANIES ||--o{ REVISION_SETS : ""
    COMPANIES ||--o{ DIRECTORY_DOCUMENTS : ""
    COMPANIES ||--o{ LEAF_PRODUCT_DOCUMENTS : ""
    COMPANIES ||--o{ SUPPLIER_QUOTATIONS : ""
    COMPANIES ||--o{ LEAF_PRODUCT_DOCUMENT_TYPES: ""
    COMPANIES ||--o{ COMPANY_DOCUMENT_TYPES : ""
    COMPANIES ||--o{ COMPANY_DOCUMENTS : ""
    COMPANIES ||--o{ COMPANY_DOCUMENT_CUSTOM_ITEMS : ""
    COMPANIES ||--o{ CUSTOMER_CUSTOM_ITEMS : ""
    COMPANIES ||--o{ CUSTOMER_CONTACT_CUSTOM_ITEMS : ""
    COMPANIES ||--o{ DRAWING_CATEGORY_RENAMES : ""

    COMPANY_DOCUMENT_CUSTOM_ITEMS ||--o{ COMPANY_DOCUMENT_CUSTOM_ITEM_OPTIONS : ""

    COMPANY_DOCUMENT_TYPES ||--o{ COMPANY_DOCUMENTS : ""
    COMPANY_DOCUMENT_TYPES ||--o{ COMPANY_DOCUMENT_CUSTOM_ITEMS : ""

    COMPANY_DOCUMENTS ||--o{ COMPANY_DOCUMENT_VERSIONS : "has"

    PLANS ||--o{ COMPANY_PLANS : ""

    DEPARTMENTS ||--o{ EMPLOYEE_DEPARTMENT : ""

    EMPLOYEES ||--o{ EMPLOYEE_DEPARTMENT : "maps"
    EMPLOYEES ||--o{ EMPLOYEE_ROLE : "has"
    EMPLOYEES ||--o{ POLICIES : "created by"
    EMPLOYEES ||--|| LOGIN_INFOS : ""

    AUTHORITIES ||--o{ EMPLOYEES: ""

    CUSTOM_ROLES ||--o{ EMPLOYEE_ROLE : "maps"

    CUSTOMERS ||--o{ CUSTOMER_CONTACTS : "has"
    CUSTOMERS ||--o{ CUSTOMER_CUSTOMER_TYPE : ""
    CUSTOMERS ||--o{ DIRECTORIES : ""
    CUSTOMERS ||--o{ LEAF_PRODUCTS : ""

    CUSTOMER_TYPES ||--o{ CUSTOMER_CUSTOMER_TYPE : ""
    CUSTOMER_STATUS ||--o{ CUSTOMERS : ""

    CUSTOMER_CONTACTS ||--o{ DIRECTORY_CONTACTS : ""

    DIRECTORIES ||--o{ DIRECTORY_PATH : "is ancestor of"
    DIRECTORIES ||--o{ DIRECTORY_PATH : "is descendant of"
    DIRECTORIES o|--o{ DIRECTORY_DOCUMENTS : "contains"
    DIRECTORIES o|--o{ LEAF_PRODUCTS : ""
    DIRECTORIES o|--o{ DIRECTORY_CONTACTS : ""
    DIRECTORIES o|--o{ SUPPLIER_QUOTATIONS : ""

    DIRECTORY_TYPES ||--o{ DIRECTORIES : "categorizes"
    DIRECTORY_TYPES ||--o{ DIRECTORY_CUSTOM_ITEMS : "applies to"
    DIRECTORY_TYPES ||--o{ DIRECTORY_DOCUMENT_TYPES : "has"
    COMPANIES ||--o{ LEAF_PRODUCT_DOCUMENT_TYPES : "has"

    DIRECTORY_DOCUMENTS ||--o{ DIRECTORY_DOCUMENT_VERSIONS : "has"

    SUPPLIER_QUOTATIONS ||--o{ SUPPLIER_QUOTES : ""

    REVISION_SETS ||--o{ LEAF_PRODUCTS : ""

    LEAF_PRODUCTS ||--o{ DRAWING_FILES : ""
    LEAF_PRODUCTS ||--o{ LEAF_PRODUCT_DOCUMENTS : "has"
    LEAF_PRODUCTS ||--o{ SUPPLIER_QUOTES : ""

    SUPPLIER_QUOTES ||--o{ QUOTE_ITEMS : "has"
    SUPPLIER_QUOTES ||--o{ QUOTE_TYPE_QUANTITIES : "defines quantities for"
    QUOTE_TYPES ||--o{ QUOTE_ITEMS : "categorizes"
    QUOTE_TYPES ||--o{ QUOTE_TYPE_QUANTITIES : "applies to"

    DRAWING_FILES ||--o{ DRAWING_PAGES : ""
    DRAWING_PAGES ||--o{ OCR: ""
    DRAWING_CATEGORIES ||--o{ DRAWING_PAGES : ""
    DRAWING_CATEGORIES ||--o{ DRAWING_CATEGORY_RENAMES : ""

    LEAF_PRODUCT_DOCUMENTS ||--o{ LEAF_PRODUCT_DOCUMENT_VERSIONS : "has"

    LEAF_PRODUCT_DOCUMENT_TYPES ||--o{ LEAF_PRODUCT_DOCUMENTS : ""
    LEAF_PRODUCT_DOCUMENT_TYPES ||--o{ LEAF_PRODUCT_DOCUMENT_CUSTOM_ITEMS : ""

    DIRECTORY_DOCUMENT_TYPES ||--o{ DIRECTORY_DOCUMENT_CUSTOM_ITEMS : ""
    DIRECTORY_DOCUMENT_TYPES ||--o{ DIRECTORY_DOCUMENTS : ""

    CUSTOM_ITEM_TYPES ||--o{ LEAF_PRODUCT_CUSTOM_ITEMS : "defines type of"
    CUSTOM_ITEM_TYPES ||--o{ DIRECTORY_CUSTOM_ITEMS : "defines type of"
    CUSTOM_ITEM_TYPES ||--o{ LEAF_PRODUCT_DOCUMENT_CUSTOM_ITEMS : "defines type of"
    CUSTOM_ITEM_TYPES ||--o{ DIRECTORY_DOCUMENT_CUSTOM_ITEMS : "defines type of"
    CUSTOM_ITEM_TYPES ||--o{ CUSTOMER_CUSTOM_ITEMS : "defines type of"
    CUSTOM_ITEM_TYPES ||--o{ CUSTOMER_CONTACT_CUSTOM_ITEMS : "defines type of"
    CUSTOM_ITEM_TYPES ||--o{ COMPANY_DOCUMENT_CUSTOM_ITEMS : "defines type of"

    LEAF_PRODUCT_CUSTOM_ITEMS ||--o{ LEAF_PRODUCT_CUSTOM_ITEM_OPTIONS : "has"
    DIRECTORY_CUSTOM_ITEMS ||--o{ DIRECTORY_CUSTOM_ITEM_OPTIONS : "has"
    LEAF_PRODUCT_DOCUMENT_CUSTOM_ITEMS ||--o{ LEAF_PRODUCT_DOCUMENT_CUSTOM_ITEM_OPTIONS : "has"
    DIRECTORY_DOCUMENT_CUSTOM_ITEMS ||--o{ DIRECTORY_DOCUMENT_CUSTOM_ITEM_OPTIONS : "has"
    CUSTOMER_CUSTOM_ITEMS ||--o{ CUSTOMER_CUSTOM_ITEM_OPTIONS : "has"
    CUSTOMER_CONTACT_CUSTOM_ITEMS ||--o{ CUSTOMER_CONTACT_CUSTOM_ITEM_OPTIONS : "has"
```
