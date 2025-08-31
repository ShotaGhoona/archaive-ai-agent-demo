# **COMPANIES**

**説明**：会社マスタ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK, NN, auto_increment |
| name | varchar(255) | NN |
| created_at | datetime | NN, default_generated |
| updated_at | datetime | NN, default_generated on current_timestamp |

---

# **COMPANY_INFO**

**説明**：会社詳細情報。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| invoice_number | int | インボイス番号 |
| postal_code | varchar(255) | 郵便番号 |
| company_address1 | varchar(255) | NN |
| company_address2 | varchar(255) |  |
| company_phone | varchar(255) | NN |
| website | varchar(255) |  |
| company_logo_url | varchar(255) | NN |
| company_seal_url | varchar(255) | NN |
| ceo | varchar(255) | 代表者 |
| ceo_role | varchar(255) | 役割 |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **COMPANY_PLANS**

**説明**：会社ごとのプラン適用。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| plan_id | int | FK NN |
| start_date | datetime | NN |
| end_date | datetime |  |
| is_active | boolean | NN |
| included_editors | int | NN |
| included_viewers | int | NN |
| drawing_limit | int | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **PLANS**

**説明**：プランマスタ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| name | varchar(255) | NN |
| default_drawing_limit | int | NN |
| default_included_editors | int | NN |
| default_included_viewers | int | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **COMPANY_DOCUMENT_TYPES**

**説明**：会社レベルの文書タイプ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| type_name | varchar(255) | NN, company_idとUNIQUE |
| display_order | int | NN, company_idとUNIQUE |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **COMPANY_DOCUMENTS**

**説明**：会社レベル文書。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| seq_number | int | NN, company_document_type_id, company_idとUNIQUE |
| company_id | int | FK NN |
| company_document_type_id | int | FK NN |
| remarks | text |  |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# COMPANY_DOCUMENT_VERSIONS

```markdown

    COMPANY_DOCUMENT_VERSIONS {
        int id PK "NN, auto_increment"
        char(26) ulid "NN"
        int company_document_id FK "NN"
        int version "NN, default = 1"
        jsonb custom_field_item "company_document_typesを参照"
        varchar(255) name "NN"
        varchar(2083) s3_url "NN"
        text remarks "備考欄"
        int created_by FK "NN, 作成者"
        int updated_by FK "NN, 最終更新者"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }
    
    -- revised --
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
```

# COMPANY_DOCUMENT_CUSTOM_ITEMS

COMPANY_DOCUMENT_CUSTOM_ITEMS {
int id PK "NN, auto_increment"
int company_document_type_id FK "NN"
varchar(255) name "NN"
int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
int display_order "NN, company_document_type_idとUNIQUE"
boolean is_enabled_db "NN, default = true, DBで表示するか"
boolean is_enabled_page "NN, default = true, pageで表示するか"
varchar(50) description "項目の説明"
datetime created_at "NN, default_generated"
datetime updated_at "NN, default_generated on update current_timestamp"
}

```
    COMPANY_DOCUMENT_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int company_document_type_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        int display_order "NN, company_document_type_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }
```

# **DEPARTMENTS**

**説明**：部門。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| name | varchar(255) | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **EMPLOYEES**

**説明**：従業員。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| authority_id | int | FK NN |
| name | varchar(255) | NN |
| email | varchar(255) | UK |
| initial_login | int | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **LOGIN_INFOS**

**説明**：ログイン情報。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| login_id | varchar(255) | NN |
| password | varchar(255) | NN |
| token | varchar(1024) |  |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **AUTHORITIES**

**説明**：権限。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| name | varchar(255) | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **POLICIES**

**説明**：ポリシー。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| policy | jsonb | NN |
| is_active | bool | NN, default=true |
| created_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **CUSTOMERS**

**説明**：顧客。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| seq_num | int | NN, 会社ごとにUNIQUE |
| name | varchar(255) | NN |
| name_kana | varchar(255) |  |
| customer_custom_items | jsonb | customer_custom_items テーブル参照 |
| customer_status_id | int | FK |
| annual_revenue | float | 年間売上高 |
| head_count | int | 従業員数 |
| website | varchar(255) |  |
| remarks | text |  |
| in_charge | int | FK, 自社での営業担当者 |
| created_by | int | FK NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **CUSTOMER_STATUS**

**説明**：顧客ステータスマスタ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| name | varchar(255) | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **CUSTOMER_TYPES**

**説明**：顧客タイプマスタ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| name | varchar(255) | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **CUSTOMER_CUSTOMER_TYPE**

**説明**：顧客と顧客タイプの紐付け。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| customer_id | int | FK NN |
| customer_type_id | int | FK NN |

---

# CUSTOMER_CUSTOM_ITEMS

```markdown
    CUSTOMER_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        int display_order "NN, company_document_type_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }
```

# customer_custom_item_options

```markdown
    CUSTOMER_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int customer_custom_item_id FK "NN, UNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }
```

# **CUSTOMER_CONTACTS**

**説明**：顧客担当者。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| customer_id | int | FK NN |
| last_name | varchar(255) | NN |
| first_name | varchar(255) | NN |
| last_name_kana | varchar(255) |  |
| first_name_kana | varchar(255) |  |
| customer_contact_custom_items | jsonb | customer_contact_custom_itemsテーブル参照 |
| phone_number | varchar(50) |  |
| office_phone_number | varchar(50) |  |
| email_primary | varchar(255) |  |
| email_secondary | varchar(255) |  |
| fax | varchar(50) |  |
| remarks | text |  |
| is_active | boolean | NN, default=true |
| created_at | datetime | NN |
| updated_at | datetime | NN |

# CUSTOMER_CONATCTS_CUSTOM_ITEMS

```markdown
    CUSTOMER_CONTACT_CUSTOM_ITEMS {
        int id PK "NN, auto_increment"
        int company_id FK "NN"
        varchar(255) name "NN"
        int custom_item_type_id FK "NN, custom_item_typesテーブルのキー"
        is_required	boolean	NN, defautl = true (ユーザーからして必須項目かどうか)
        int display_order "NN, company_document_type_idとUNIQUE"
        boolean is_enabled_db "NN, default = true, DBで表示するか"
        boolean is_enabled_page "NN, default = true, pageで表示するか"
        varchar(50) description "項目の説明"
        datetime created_at "NN, default_generated"
        datetime updated_at "NN, default_generated on update current_timestamp"
    }
```

---

# CUSOMER_CONTACTS_CUSTOM_ITEM_OPTIONS

```markdown
    CUSTOMER_CONTACT_CUSTOM_ITEM_OPTIONS {
        int id PK "NN, auto_increment"
        int customer_contact_custom_item_id FK "NN, UNIQUE"
        varchar(255) option_value "NN"
        char(7) color_code "NN, default=#FFFFFF, 選択肢のカラーコード"
        datetime created_at "NN default_generated"
        datetime updated_at "NN default_generated on current_timestamp"
    }
```

# **DIRECTORY_CONTACTS**

**説明**：ディレクトリに紐づく顧客担当者。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| customer_contact_id | int | FK NN |
| directory_id | int | FK NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORIES**

**説明**：ディレクトリ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ulid | char(26) | UK |
| company_id | int | FK NN |
| directory_type_id | int | NN |
| customer_id | int | FK |
| name | varchar(255) | NN |
| directory_custom_items | jsonb | 自由項目 |
| remarks | text |  |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORY_PATH**

**説明**：ディレクトリ階層閉包表。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ancestor | int | FK NN |
| descendant | int | FK NN |
| depth | int | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORY_TYPES**

**説明**：ディレクトリタイプマスタ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| directory_type | varchar(255) | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORY_DOCUMENTS**

**説明**：ディレクトリ配下の文書本体（案件文書など）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK, auto_increment |
| ulid | char(26) | UK1 |
| seq_number | int | NN, (directory_document_type_id, company_id と UNIQUE) |
| directory_id | int | FK |
| company_id | int | FK NN |
| directory_document_type_id | int | FK NN |
| created_at | datetime | NN, default_generated |
| updated_at | datetime | NN, default_generated on update current_timestamp |

---

# **DIRECTORY_DOCUMENT_VERSIONS**

**説明**：ディレクトリ文書の版情報（内容・ファイルURL等）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK, auto_increment |
| ulid | char(26) | NN |
| directory_document_id | int | FK NN |
| version | int | NN, default=1 |
| directory_document_custom_items | jsonb | directory_document_custom_items自由項目 |
| name | varchar(255) | NN |
| s3_url | varchar(2083) | NN |
| remarks | text | 備考 |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **SUPPLIER_QUOTATIONS**

**説明**：見積書（ディレクトリ起点の依頼）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| directory_id | int | FK NN |
| customer_id | int | FK NN |
| company_id | int | FK NN |
| quotation_number | varchar(255) | NN |
| expiration_date | date | NN |
| version | int | NN, default=1 |
| s3_url | varchar(2083) |  |
| remarks | text |  |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **REVISION_SETS**

**説明**：図面（末端プロダクト）用リビジョンの束（セット）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ulid | char(26) | NN |
| company_id | int | FK NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **LEAF_PRODUCTS（末端プロダクト）**

**説明**：末端プロダクト（図面の最小単位、版管理対象）。directory_id の有無でユニーク条件が変わる（部分インデックス）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ulid | char(26) | NN, UK1 |
| revision_set_id | int | FK NN, UK2 |
| directory_id | int | FK, UK2 |
| customer_id | int | FK（顧客ID） |
| revision_number | int | NN, default=1, UK2 |
| leaf_product_custom_items | jsonb | leaf_product_custom_itemsテーブル参照　自由項目 |
| is_latest | boolean | NN |
| search_text | tsvector | 全文検索(スコープ外) |
| remarks | text |  |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DRAWING_FILES（図面ファイル）**

**説明**：図面ファイル（1ファイル＝複数ページを含む）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ulid | char(26) | NN |
| leaf_product_id | int | FK NN |
| name | varchar(255) | NN |
| file_extension | varchar(255) | NN |
| s3_url | varchar(2083) | 実ファイル（S3） |
| remarks | text |  |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DRAWING_PAGES（ページ図面）**

**説明**：図面ページ（ファイル内のページ明細）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ulid | char(26) | NN |
| drawing_file_id | int | FK NN |
| drawing_number | varchar(255) | 図面番号 |
| external_drawing_number | varchar(255) | 社外図面番号 |
| drawing_category_rename_id | varchar(255) | FK NN（カテゴリID） |
| page_number | int | NN, drawing_file_id と UNIQUE |
| is_shown_similar_search | boolean | NN, default=true |
| s3_url | varchar(2083) | ページ画像S3 |
| remarks | text | 備考欄 |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# DRAWING_CATEGORY_RENAMES

**説明**：ユーザーがカスタマイズできる図面カテゴリ

company : drawingingaaaaa = 1 : N

drawing_category : drawinasdlfasf = 1: N

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| drawing_category_id | int | FK NN UNIQUE (drawing_category_id, company_id) |
| custom_name | varchar(255) | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

# **DRAWING_CATEGORIES**

**説明**：図面カテゴリ（本図面/見積図面/検査図面/手配図面/工程図面/その他）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ~~company_id~~ | ~~int~~ | ~~FK NN~~ |
| name | varchar(255) | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **OCR**

**説明**：OCR結果（ページ単位の文字抽出）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| drawing_page_id | int | FK NN |
| text | text | NN |
| x_min | int | NN |
| y_min | int | NN |
| x_max | int | NN |
| y_max | int | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **SUPPLIER_QUOTES**

**説明**：外注見積の回答（末端プロダクト単位）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ulid | char(26) | NN |
| supplier_quotation_id | int | FK NN |
| leaf_product_id | int | FK NN |
| version | int | NN, default=1 |
| total_cost | int | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **QUOTE_ITEMS**

**説明**：外注見積の明細（名称・単価）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| supplier_quote_id | int | FK NN |
| quote_type_id | int | FK NN |
| name | varchar(255) | NN |
| unit_cost | int | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **QUOTE_TYPE_QUANTITIES**

**説明**：見積タイプごとの数量を保持。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| supplier_quote_id | int | FK NN |
| quote_type_id | int | FK NN |
| quantity | int | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **QUOTE_TYPES**

**説明**：見積タイプ（材料・作業工程・段取り工程・その他）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| name | varchar(255) | NN |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **LEAF_PRODUCT_DOCUMENTS**

**説明**：末端プロダクト直下の文書（仕様書・検査表など）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| leaf_product_id | int | FK |
| seq_number | int | NN, (leaf_product_document_type_id, company_id と UNIQUE) |
| company_id | int | FK NN |
| leaf_product_document_type_id | int | FK NN |
| remarks | text |  |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **LEAF_PRODUCT_DOCUMENT_VERSIONS**

**説明**：末端プロダクト文書の版（内容JSON・ファイルURL）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| ulid | char(26) | NN |
| leaf_product_document_id | int | NN（leaf_product_document_id と UNIQUE） |
| version | int | NN, default=1 |
| leaf_product_document_custom_item | jsonb | leaf_product_document_custom_items参照、自由項目 |
| name | varchar(255) | NN |
| s3_url | varchar(2083) | NN |
| remarks | text |  |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **LEAF_PRODUCT_DOCUMENT_TYPES**

**説明**：末端プロダクト文書のタイプマスタ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| type_name | varchar(255) | NN, company_id と UNIQUE |
| display_order | int | NN, company_id と UNIQUE |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORY_DOCUMENT_TYPES**

**説明**：ディレクトリ文書のタイプマスタ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| directory_type_id | int | FK NN |
| type_name | varchar(255) | NN, directory_type_id と UNIQUE |
| display_order | int | NN, directory_type_id と UNIQUE |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **CUSTOM_ITEM_TYPES**

**説明**：自由項目の型マスタ（NUMBER/STRING/SELECT/USER/DATE/BOOLEAN）。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| type | varchar(255) | NN |
| created_at | datetime | default_generated |
| updated_at | datetime | default_generated on update current_timestamp |

---

# **LEAF_PRODUCT_CUSTOM_ITEMS**

**説明**：末端プロダクト向けの自由項目定義。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| name | varchar(255) | NN |
| custom_item_type_id | int | FK NN（CUSTOM_ITEM_TYPES） |
| is_required | boolean | NN, defautl = true (ユーザーからして必須項目かどうか) |
| display_order | int | NN, company_id と UNIQUE |
| is_enabled_db | boolean | NN, default=true（DBで表示） |
| is_enabled_page | boolean | NN, default=true（UIで表示） |
| description | varchar(50) | 項目説明 |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **LEAF_PRODUCT_DOCUMENT_CUSTOM_ITEMS**

**説明**：末端プロダクト文書向けの自由項目定義。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| leaf_product_document_type_id | int | FK NN |
| name | varchar(255) | NN |
| custom_item_type_id | int | FK NN |
| is_required | boolean | NN, defautl = true (ユーザーからして必須項目かどうか) |
| display_order | int | NN, leaf_product_document_type_id と UNIQUE |
| is_enabled_db | boolean | NN, default=true |
| is_enabled_page | boolean | NN, default=true |
| description | varchar(50) | 項目説明 |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORY_CUSTOM_ITEMS**

**説明**：ディレクトリ向けの自由項目定義。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| directory_type_id | int | FK NN |
| name | varchar(255) | NN |
| custom_item_type_id | int | FK NN |
| is_required | boolean | NN, defautl = true (ユーザーからして必須項目かどうか) |
| display_order | int | NN, directory_type_id と UNIQUE |
| is_enabled_db | boolean | NN, default=true |
| is_enabled_page | boolean | NN, default=true |
| description | varchar(50) | 項目説明 |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORY_DOCUMENT_CUSTOM_ITEMS**

**説明**：ディレクトリ文書向けの自由項目定義。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| directory_document_type_id | int | FK NN |
| name | varchar(255) | NN |
| custom_item_type_id | int | FK NN |
| is_required | boolean | NN, defautl = true (ユーザーからして必須項目かどうか) |
| display_order | int | NN, directory_document_type_id と UNIQUE |
| is_enabled_db | boolean | NN, default=true |
| is_enabled_page | boolean | NN, default=true |
| description | varchar(50) | 項目説明 |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **LEAF_PRODUCT_CUSTOM_ITEM_OPTIONS**

**説明**：末端プロダクト自由項目の選択肢。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| leaf_product_custom_item_id | int | FK NN, UNIQUE |
| option_value | varchar(255) | NN |
| color_code | char(7) | NN, default=#FFFFFF |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **LEAF_PRODUCT_DOCUMENT_CUSTOM_ITEM_OPTIONS**

**説明**：末端プロダクト文書自由項目の選択肢。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| leaf_product_document_custom_item_id | int | FK NN, UNIQUE |
| option_value | varchar(255) | NN |
| color_code | char(7) | NN, default=#FFFFFF |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORY_CUSTOM_ITEM_OPTIONS**

**説明**：ディレクトリ自由項目の選択肢。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| directory_custom_item_id | int | FK NN, UNIQUE |
| option_value | varchar(255) | NN |
| color_code | char(7) | NN, default=#FFFFFF |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **DIRECTORY_DOCUMENT_CUSTOM_ITEM_OPTIONS**

**説明**：ディレクトリ文書自由項目の選択肢。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| directory_document_custom_item_id | int | FK NN, UNIQUE |
| option_value | varchar(255) | NN |
| color_code | char(7) | NN, default=#FFFFFF |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **COMPANY_DOCUMENT_TYPES**

**説明**：会社レベルの文書タイプ。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| company_id | int | FK NN |
| type_name | varchar(255) | NN, company_id と UNIQUE |
| display_order | int | NN, company_id と UNIQUE |
| created_at | datetime | NN |
| updated_at | datetime | NN |

---

# **COMPANY_DOCUMENTS**

**説明**：会社レベルの文書。

| **カラム名** | **型** | **制約/説明** |
| --- | --- | --- |
| id | int | PK |
| seq_number | int | NN, company_document_type_id, company_id と UNIQUE |
| company_id | int | FK NN |
| company_document_type_id | int | FK NN |
| remarks | text |  |
| created_by | int | FK |
| updated_by | int | FK |
| created_at | datetime | NN |
| updated_at | datetime | NN |