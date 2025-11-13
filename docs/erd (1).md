# Database Schema Documentation

Generated on: 2025-11-02 16:55:08

## 📊 ER図

![Database ER Diagram](./database_erd.png)

### その他の形式
- [SVG形式で表示](./database_erd.svg)
- [DBML形式をコピー](./database_erd_full.dbml) → [dbdiagram.io](https://dbdiagram.io/d) でペースト

## 📋 テーブル一覧

- [public.authorities](#public.authorities) (4カラム)
- [public.companies](#public.companies) (4カラム)
- [public.company_document_custom_item_options](#public.company_document_custom_item_options) (6カラム)
- [public.company_document_custom_items](#public.company_document_custom_items) (11カラム)
- [public.company_document_types](#public.company_document_types) (6カラム)
- [public.company_document_versions](#public.company_document_versions) (13カラム)
- [public.company_documents](#public.company_documents) (9カラム)
- [public.company_info](#public.company_info) (15カラム)
- [public.company_plans](#public.company_plans) (11カラム)
- [public.custom_item_types](#public.custom_item_types) (4カラム)
- [public.custom_roles](#public.custom_roles) (5カラム)
- [public.customer_contact_custom_item_options](#public.customer_contact_custom_item_options) (6カラム)
- [public.customer_contact_custom_items](#public.customer_contact_custom_items) (11カラム)
- [public.customer_contacts](#public.customer_contacts) (16カラム)
- [public.customer_custom_item_options](#public.customer_custom_item_options) (6カラム)
- [public.customer_custom_items](#public.customer_custom_items) (11カラム)
- [public.customer_customer_types](#public.customer_customer_types) (2カラム)
- [public.customer_status](#public.customer_status) (4カラム)
- [public.customer_types](#public.customer_types) (4カラム)
- [public.customers](#public.customers) (16カラム)
- [public.departments](#public.departments) (5カラム)
- [public.directories](#public.directories) (13カラム)
- [public.directory_contacts](#public.directory_contacts) (5カラム)
- [public.directory_custom_item_options](#public.directory_custom_item_options) (6カラム)
- [public.directory_custom_items](#public.directory_custom_items) (11カラム)
- [public.directory_document_custom_item_options](#public.directory_document_custom_item_options) (6カラム)
- [public.directory_document_custom_items](#public.directory_document_custom_items) (11カラム)
- [public.directory_document_types](#public.directory_document_types) (6カラム)
- [public.directory_document_versions](#public.directory_document_versions) (13カラム)
- [public.directory_documents](#public.directory_documents) (8カラム)
- [public.directory_path](#public.directory_path) (6カラム)
- [public.directory_types](#public.directory_types) (5カラム)
- [public.drawing_categories](#public.drawing_categories) (4カラム)
- [public.drawing_category_renames](#public.drawing_category_renames) (6カラム)
- [public.drawing_files](#public.drawing_files) (11カラム)
- [public.drawing_pages](#public.drawing_pages) (15カラム)
- [public.employee_department](#public.employee_department) (5カラム)
- [public.employee_role](#public.employee_role) (5カラム)
- [public.employees](#public.employees) (8カラム)
- [public.leaf_product_custom_item_options](#public.leaf_product_custom_item_options) (6カラム)
- [public.leaf_product_custom_items](#public.leaf_product_custom_items) (11カラム)
- [public.leaf_product_document_custom_item_options](#public.leaf_product_document_custom_item_options) (6カラム)
- [public.leaf_product_document_custom_items](#public.leaf_product_document_custom_items) (11カラム)
- [public.leaf_product_document_types](#public.leaf_product_document_types) (6カラム)
- [public.leaf_product_document_versions](#public.leaf_product_document_versions) (13カラム)
- [public.leaf_product_documents](#public.leaf_product_documents) (10カラム)
- [public.leaf_products](#public.leaf_products) (16カラム)
- [public.login_infos](#public.login_infos) (7カラム)
- [public.ocr](#public.ocr) (9カラム)
- [public.plans](#public.plans) (7カラム)
- [public.policies](#public.policies) (13カラム)
- [public.quote_items](#public.quote_items) (7カラム)
- [public.quote_type_quantities](#public.quote_type_quantities) (6カラム)
- [public.quote_types](#public.quote_types) (5カラム)
- [public.revision_sets](#public.revision_sets) (5カラム)
- [public.supplier_quotations](#public.supplier_quotations) (14カラム)
- [public.supplier_quotes](#public.supplier_quotes) (8カラム)

## 🗂️ テーブル詳細

### public.authorities

**テーブル情報:**
- カラム数: 4
- 主キー: id
- ユニークキー: name

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.companies

**テーブル情報:**
- カラム数: 4
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.company_document_custom_item_options

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: company_document_custom_item_id → company_document_custom_items.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_document_custom_item_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `option_value` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `color_code` | `VARCHAR(7)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.company_document_custom_items

**テーブル情報:**
- カラム数: 11
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_document_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `custom_item_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `display_order` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(0) | - |
| `is_enabled_db` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_enabled_page` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_required` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | - |
| `description` | `VARCHAR(50)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.company_document_types

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: company_id → companies.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `type_name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `display_order` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.company_document_versions

**テーブル情報:**
- カラム数: 13
- 主キー: id
- 外部キー: company_document_id → company_documents.id, created_by → employees.id, updated_by → employees.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `company_document_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `version` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `company_document_custom_items` | `JSON` | - | Custom items in JSON format |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | File name |
| `s3_url` | `VARCHAR(2083)` | ❗ NOT NULL | S3 URL |
| `remarks` | `TEXT` | - | Version remarks |
| `is_password_protected` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | PDFがパスワード保護されているか |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | Creator employee ID |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | Updater employee ID |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.company_documents

**テーブル情報:**
- カラム数: 9
- 主キー: id
- 外部キー: company_id → companies.id, company_document_type_id → company_document_types.id, created_by → employees.id, updated_by → employees.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `seq_number` | `INTEGER` | ❗ NOT NULL | Sequential number unique per type and company |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `company_document_type_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `remarks` | `TEXT` | - | Remarks |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | Creator employee ID |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | Updater employee ID |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.company_info

**テーブル情報:**
- カラム数: 15
- 主キー: id
- 外部キー: company_id → companies.id
- ユニークキー: company_id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>⚡ UNIQUE<br>❗ NOT NULL | - |
| `invoice_number` | `INTEGER` | - | - |
| `postal_code` | `VARCHAR(255)` | - | - |
| `company_address1` | `VARCHAR(255)` | - | - |
| `company_address2` | `VARCHAR(255)` | - | - |
| `company_phone` | `VARCHAR(255)` | - | - |
| `website` | `VARCHAR(255)` | - | - |
| `email` | `VARCHAR(255)` | - | - |
| `company_logo_url` | `VARCHAR(255)` | - | - |
| `company_seal_url` | `VARCHAR(255)` | - | - |
| `ceo` | `VARCHAR(255)` | - | - |
| `ceo_role` | `VARCHAR(255)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.company_plans

**テーブル情報:**
- カラム数: 11
- 主キー: id
- 外部キー: company_id → companies.id, plan_id → plans.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `plan_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `start_date` | `DATETIME` | ❗ NOT NULL | - |
| `end_date` | `DATETIME` | - | - |
| `is_active` | `BOOLEAN` | ❗ NOT NULL | - |
| `included_editors` | `INTEGER` | ❗ NOT NULL | - |
| `included_viewers` | `INTEGER` | ❗ NOT NULL | - |
| `drawing_limit` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.custom_item_types

**テーブル情報:**
- カラム数: 4
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `type` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.custom_roles

**テーブル情報:**
- カラム数: 5
- 主キー: id
- 外部キー: company_id → companies.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.customer_contact_custom_item_options

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: customer_contact_custom_item_id → customer_contact_custom_items.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `customer_contact_custom_item_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `option_value` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `color_code` | `VARCHAR(7)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.customer_contact_custom_items

**テーブル情報:**
- カラム数: 11
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `custom_item_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `display_order` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(0) | - |
| `is_enabled_db` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_enabled_page` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_required` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | - |
| `description` | `VARCHAR(50)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.customer_contacts

**テーブル情報:**
- カラム数: 16
- 主キー: id
- 外部キー: customer_id → customers.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `customer_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `last_name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `first_name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `last_name_kana` | `VARCHAR(255)` | - | - |
| `first_name_kana` | `VARCHAR(255)` | - | - |
| `phone_number` | `VARCHAR(50)` | - | - |
| `office_phone_number` | `VARCHAR(50)` | - | - |
| `email_primary` | `VARCHAR(255)` | - | - |
| `email_secondary` | `VARCHAR(255)` | - | - |
| `fax` | `VARCHAR(50)` | - | - |
| `customer_contact_custom_items` | `JSONB` | - | - |
| `remarks` | `TEXT` | - | - |
| `is_active` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.customer_custom_item_options

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: customer_custom_item_id → customer_custom_items.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `customer_custom_item_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `option_value` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `color_code` | `VARCHAR(7)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.customer_custom_items

**テーブル情報:**
- カラム数: 11
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `custom_item_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `display_order` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(0) | - |
| `is_enabled_db` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_enabled_page` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_required` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | - |
| `description` | `VARCHAR(50)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.customer_customer_types

**テーブル情報:**
- カラム数: 2
- 主キー: customer_id, customer_type_id
- 外部キー: customer_id → customers.id, customer_type_id → customer_types.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `customer_id` | `INTEGER` | 🔑 PK<br>🔗 FK<br>❗ NOT NULL | - |
| `customer_type_id` | `INTEGER` | 🔑 PK<br>🔗 FK<br>❗ NOT NULL | - |

---

### public.customer_status

**テーブル情報:**
- カラム数: 4
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.customer_types

**テーブル情報:**
- カラム数: 4
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.customers

**テーブル情報:**
- カラム数: 16
- 主キー: id
- 外部キー: company_id → companies.id, customer_status_id → customer_status.id, in_charge → employees.id, created_by → employees.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `seq_number` | `INTEGER` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `name_kana` | `VARCHAR(255)` | - | - |
| `customer_custom_items` | `JSONB` | - | - |
| `customer_status_id` | `INTEGER` | 🔗 FK | - |
| `annual_revenue` | `INTEGER` | - | - |
| `customer_address` | `VARCHAR(255)` | - | - |
| `head_count` | `INTEGER` | - | - |
| `website` | `VARCHAR(255)` | - | - |
| `remarks` | `TEXT` | - | - |
| `in_charge` | `INTEGER` | 🔗 FK | - |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.departments

**テーブル情報:**
- カラム数: 5
- 主キー: id
- 外部キー: company_id → companies.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directories

**テーブル情報:**
- カラム数: 13
- 主キー: id
- 外部キー: company_id → companies.id, directory_type_id → directory_types.id, customer_id → customers.id, created_by → employees.id, updated_by → employees.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `seq_number` | `INTEGER` | - | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `directory_type_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `customer_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | - | - |
| `directory_custom_item` | `JSON` | - | - |
| `remarks` | `VARCHAR` | - | - |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_contacts

**テーブル情報:**
- カラム数: 5
- 主キー: id
- 外部キー: customer_contact_id → customer_contacts.id, directory_id → directories.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `customer_contact_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `directory_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_custom_item_options

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: directory_custom_item_id → directory_custom_items.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `directory_custom_item_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `option_value` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `color_code` | `VARCHAR(7)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_custom_items

**テーブル情報:**
- カラム数: 11
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `directory_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `custom_item_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `display_order` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(0) | - |
| `is_enabled_db` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_enabled_page` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_required` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | - |
| `description` | `VARCHAR(50)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_document_custom_item_options

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: directory_document_custom_item_id → directory_document_custom_items.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `directory_document_custom_item_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `option_value` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `color_code` | `VARCHAR(7)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_document_custom_items

**テーブル情報:**
- カラム数: 11
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `directory_document_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `custom_item_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `display_order` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(0) | - |
| `is_enabled_db` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_enabled_page` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_required` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | - |
| `description` | `VARCHAR(50)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_document_types

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: directory_type_id → directory_types.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `directory_type_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `type_name` | `VARCHAR(255)` | ❗ NOT NULL | Document type name |
| `display_order` | `INTEGER` | ❗ NOT NULL | Display order |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_document_versions

**テーブル情報:**
- カラム数: 13
- 主キー: id
- 外部キー: directory_document_id → directory_documents.id, created_by → employees.id, updated_by → employees.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `directory_document_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `version` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `directory_document_custom_items` | `JSON` | - | Custom items in JSON format |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | File name |
| `s3_url` | `VARCHAR(2083)` | ❗ NOT NULL | S3 URL |
| `remarks` | `TEXT` | - | Version remarks |
| `is_password_protected` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | PDFがパスワード保護されているか |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | Creator employee ID |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | Updater employee ID |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_documents

**テーブル情報:**
- カラム数: 8
- 主キー: id
- 外部キー: directory_id → directories.id, company_id → companies.id, directory_document_type_id → directory_document_types.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `seq_number` | `INTEGER` | ❗ NOT NULL | Sequential number unique per type and company |
| `directory_id` | `INTEGER` | 🔗 FK | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `directory_document_type_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_path

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: ancestor → directories.id, descendant → directories.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ancestor` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `descendant` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `depth` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.directory_types

**テーブル情報:**
- カラム数: 5
- 主キー: id
- 外部キー: company_id → companies.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `directory_type` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.drawing_categories

**テーブル情報:**
- カラム数: 4
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.drawing_category_renames

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: company_id → companies.id, drawing_category_id → drawing_categories.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `drawing_category_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `custom_name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.drawing_files

**テーブル情報:**
- カラム数: 11
- 主キー: id
- 外部キー: leaf_product_id → leaf_products.id, created_by → employees.id, updated_by → employees.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `leaf_product_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `file_extension` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `s3_url` | `VARCHAR(2083)` | - | - |
| `remarks` | `TEXT` | - | - |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.drawing_pages

**テーブル情報:**
- カラム数: 15
- 主キー: id
- 外部キー: drawing_file_id → drawing_files.id, drawing_category_id → drawing_categories.id, created_by → employees.id, updated_by → employees.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `seq_number` | `INTEGER` | ❗ NOT NULL | - |
| `drawing_file_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `drawing_number` | `VARCHAR(255)` | - | - |
| `external_drawing_number` | `VARCHAR(255)` | - | - |
| `drawing_category_id` | `INTEGER` | 🔗 FK | - |
| `page_number` | `INTEGER` | ❗ NOT NULL | - |
| `is_shown_similar_search` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `s3_url` | `VARCHAR(2083)` | - | - |
| `remarks` | `TEXT` | - | - |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.employee_department

**テーブル情報:**
- カラム数: 5
- 主キー: id
- 外部キー: employee_id → employees.id, department_id → departments.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `employee_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `department_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.employee_role

**テーブル情報:**
- カラム数: 5
- 主キー: id
- 外部キー: employee_id → employees.id, custom_role_id → custom_roles.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `employee_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `custom_role_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.employees

**テーブル情報:**
- カラム数: 8
- 主キー: id
- 外部キー: company_id → companies.id, authority_id → authorities.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `authority_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `email` | `VARCHAR(255)` | - | - |
| `initial_login` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.leaf_product_custom_item_options

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: leaf_product_custom_item_id → leaf_product_custom_items.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `leaf_product_custom_item_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `option_value` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `color_code` | `VARCHAR(7)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.leaf_product_custom_items

**テーブル情報:**
- カラム数: 11
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `custom_item_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `display_order` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(0) | - |
| `is_enabled_db` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_enabled_page` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_required` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | - |
| `description` | `VARCHAR(50)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.leaf_product_document_custom_item_options

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: leaf_product_document_custom_item_id → leaf_product_document_custom_items.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `leaf_product_document_custom_item_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `option_value` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `color_code` | `VARCHAR(7)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.leaf_product_document_custom_items

**テーブル情報:**
- カラム数: 11
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `leaf_product_document_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `custom_item_type_id` | `INTEGER` | ❗ NOT NULL | - |
| `display_order` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(0) | - |
| `is_enabled_db` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_enabled_page` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `is_required` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | - |
| `description` | `VARCHAR(50)` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.leaf_product_document_types

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: company_id → companies.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `type_name` | `VARCHAR(255)` | ❗ NOT NULL | Document type name |
| `display_order` | `INTEGER` | ❗ NOT NULL | Display order |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.leaf_product_document_versions

**テーブル情報:**
- カラム数: 13
- 主キー: id
- 外部キー: leaf_product_document_id → leaf_product_documents.id, created_by → employees.id, updated_by → employees.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `leaf_product_document_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `version` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `leaf_product_document_custom_items` | `JSON` | - | Custom items in JSON format |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | File name |
| `s3_url` | `VARCHAR(2083)` | ❗ NOT NULL | S3 URL |
| `remarks` | `TEXT` | - | Version remarks |
| `is_password_protected` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(False) | PDFがパスワード保護されているか |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | Creator employee ID |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | Updater employee ID |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.leaf_product_documents

**テーブル情報:**
- カラム数: 10
- 主キー: id
- 外部キー: leaf_product_id → leaf_products.id, company_id → companies.id, leaf_product_document_type_id → leaf_product_document_types.id, created_by → employees.id, updated_by → employees.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `seq_number` | `INTEGER` | ❗ NOT NULL | Sequential number unique per type and company |
| `leaf_product_id` | `INTEGER` | 🔗 FK | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `leaf_product_document_type_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `remarks` | `TEXT` | - | 備考欄 |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | 作成者 |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | 最終更新者 |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.leaf_products

**テーブル情報:**
- カラム数: 16
- 主キー: id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `revision_set_id` | `INTEGER` | ❗ NOT NULL | - |
| `revision_number` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `name` | `VARCHAR(255)` | - | - |
| `leaf_product_custom_item` | `JSON` | - | - |
| `is_latest` | `BOOLEAN` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(True) | - |
| `search_text` | `TSVECTOR` | - | - |
| `remarks` | `TEXT` | - | - |
| `quantity` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `created_by` | `INTEGER` | ❗ NOT NULL | - |
| `updated_by` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |
| `directory_id` | `INTEGER` | - | - |
| `customer_id` | `INTEGER` | - | - |

---

### public.login_infos

**テーブル情報:**
- カラム数: 7
- 主キー: id
- 外部キー: employee_id → employees.id
- ユニークキー: employee_id, login_id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `employee_id` | `INTEGER` | 🔗 FK<br>⚡ UNIQUE<br>❗ NOT NULL | - |
| `login_id` | `VARCHAR(255)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `password` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |
| `token` | `VARCHAR(1024)` | - | - |

---

### public.ocr

**テーブル情報:**
- カラム数: 9
- 主キー: id
- 外部キー: drawing_page_id → drawing_pages.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `drawing_page_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `text` | `TEXT` | ❗ NOT NULL | - |
| `x_min` | `INTEGER` | ❗ NOT NULL | - |
| `y_min` | `INTEGER` | ❗ NOT NULL | - |
| `x_max` | `INTEGER` | ❗ NOT NULL | - |
| `y_max` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.plans

**テーブル情報:**
- カラム数: 7
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `default_drawing_limit` | `INTEGER` | ❗ NOT NULL | - |
| `default_included_editors` | `INTEGER` | ❗ NOT NULL | - |
| `default_included_viewers` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.policies

**テーブル情報:**
- カラム数: 13
- 主キー: id
- ユニークキー: name

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `description` | `TEXT` | - | - |
| `resource_type` | `VARCHAR(100)` | ❗ NOT NULL | - |
| `action` | `VARCHAR(100)` | ❗ NOT NULL | - |
| `effect` | `VARCHAR(10)` | ❗ NOT NULL | - |
| `conditions` | `TEXT` | - | - |
| `priority` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(100) | - |
| `is_active` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `created_by` | `INTEGER` | - | - |
| `updated_by` | `INTEGER` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.quote_items

**テーブル情報:**
- カラム数: 7
- 主キー: id
- 外部キー: supplier_quote_id → supplier_quotes.id, quote_type_id → quote_types.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `supplier_quote_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `quote_type_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `unit_cost` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.quote_type_quantities

**テーブル情報:**
- カラム数: 6
- 主キー: id
- 外部キー: supplier_quote_id → supplier_quotes.id, quote_type_id → quote_types.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `supplier_quote_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `quote_type_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `quantity` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.quote_types

**テーブル情報:**
- カラム数: 5
- 主キー: id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `code` | `VARCHAR(50)` | ❗ NOT NULL | - |
| `name` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.revision_sets

**テーブル情報:**
- カラム数: 5
- 主キー: id
- 外部キー: company_id → companies.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.supplier_quotations

**テーブル情報:**
- カラム数: 14
- 主キー: id
- 外部キー: directory_id → directories.id, customer_id → customers.id, company_id → companies.id, created_by → employees.id, updated_by → employees.id

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `directory_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `customer_id` | `INTEGER` | 🔗 FK | - |
| `company_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `created_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `updated_by` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `seq_number` | `INTEGER` | ❗ NOT NULL | - |
| `quotation_number` | `VARCHAR(255)` | ❗ NOT NULL | - |
| `expiration_date` | `DATE` | ❗ NOT NULL | - |
| `version` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `s3_url` | `VARCHAR(2083)` | - | - |
| `remarks` | `TEXT` | - | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

### public.supplier_quotes

**テーブル情報:**
- カラム数: 8
- 主キー: id
- 外部キー: supplier_quotation_id → supplier_quotations.id, leaf_product_id → leaf_products.id
- ユニークキー: ulid

| カラム名 | 型 | 制約 | 説明 |
|----------|----|----- |------|
| `id` | `INTEGER` | 🔑 PK<br>❗ NOT NULL | - |
| `ulid` | `VARCHAR(26)` | ⚡ UNIQUE<br>❗ NOT NULL | - |
| `supplier_quotation_id` | `INTEGER` | 🔗 FK | - |
| `leaf_product_id` | `INTEGER` | 🔗 FK<br>❗ NOT NULL | - |
| `version` | `INTEGER` | ❗ NOT NULL<br>📋 DEFAULT: ScalarElementColumnDefault(1) | - |
| `total_cost` | `INTEGER` | ❗ NOT NULL | - |
| `created_at` | `DATETIME` | ❗ NOT NULL | - |
| `updated_at` | `DATETIME` | ❗ NOT NULL | - |

---

## 📚 補足情報

### アイコン説明
- 🔑 PK: Primary Key（主キー）
- 🔗 FK: Foreign Key（外部キー）
- ⚡ UNIQUE: 一意制約
- ❗ NOT NULL: NULL不許可
- 📋 DEFAULT: デフォルト値

### 更新方法
このドキュメントは SQLAlchemy モデルから自動生成されます。
```bash
uv run python scripts/generate_erd_docs.py
```
