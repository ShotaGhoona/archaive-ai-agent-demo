

## APIエンドポイント設計（改善版）

### 共通事項

- **認証:** `Authorization: Bearer <token>` ヘッダー必須
- **形式:** JSON
- **共通クエリパラメータ:** `limit`, `offset`, `sort`, `q`

---

## 1. 認証 (Auth)

ユーザーのログイン・ログアウト、自身の情報取得を担当します。

- `POST /v1/auth/login`
    - **説明:** ログインし、認証トークンを発行します。
- `POST /v1/auth/logout`
    - **説明:** ログアウト処理を行います。
- `GET /v1/auth/me`
    - **説明:** 現在認証中のユーザー（自分）の詳細情報を取得します。

---

## 2. 企業・従業員・顧客 (Companies, Employees, Customers)

組織構造と取引先を管理します。

### 企業 (`/companies`)

- `GET /v1/companies/{companyId}`
    - **説明:** 企業情報を取得します。
- `PATCH /v1/companies/{companyId}`
    - **説明:** 企業情報を更新します。
- `GET /v1/companies/{companyId}/departments`
    - **説明:** 企業に紐づく部署の一覧を取得します。
- `POST /v1/companies/{companyId}/departments`
    - **説明:** 企業に新しい部署を作成します。
- `GET /v1/companies/{companyId}/employees`
    - **説明:** 企業に所属する従業員の一覧を取得します。
- `GET /v1/employees/{employeeId}`
    - **説明:** 特定の従業員の詳細情報を取得します。
- `GET /v1/companies/{companyId}/roles`
    - **説明:** 企業に紐づく役割（カスタムロール）の一覧を取得します。
- `GET /v1/companies/{companyId}/customers`
    - **説明:** 企業に紐づく顧客の一覧を取得します。
- `POST /v1/companies/{companyId}/customers`
    - **説明:** 企業に新しい顧客を作成します。
- *(追加開発)*
    - `GET /v1/companies` (企業一覧の取得)
    - `POST /v1/companies` (新規企業の作成)

### 従業員 (`/employees`) & 部署 (`/departments`)

- `GET /v1/departments/{departmentId}/employees`
    - **説明:** 特定の部署に所属する従業員一覧を取得します。
- `GET /v1/employees/{employeeId}`
    - **説明:** 特定の従業員の詳細情報を取得します。
- `POST /v1/employees/{employeeId}/roles`
    - **説明:** 従業員に役割を割り当てます。
- `DELETE /employees/{employeeId}/roles/{roleId}`
    - **説明:** 従業員からカスタムロールの割り当てを解除します。
- *(追加開発)*
    - `GET /v1/employees` (全従業員一覧の取得)

### 顧客 (`/customers`) & 担当者 (`/contacts`)

- `PATCH /v1/customers/{customerId}`
    - **説明:** 顧客情報を更新します。
- `DELETE /v1/customers/{customerId}`
    - **説明:** 顧客を削除します。
- `GET /v1/customers/{customerId}/contacts`
    - **説明:** 顧客の担当者一覧を取得します。
- `POST /v1/customers/{customerId}/contacts`
    - **説明:** 顧客に新しい担当者を追加します。
- `DELETE /v1/contacts/{contactId}`
    - **説明:** 顧客の担当者を削除します。

---

## 3. ディレクトリとファイル (Directories & Files)

プロジェクトや案件の階層構造と、それに含まれる書類や図面を管理します。

### ディレクトリ (`/directories`)

- `GET /v1/directory-types/{directoryTypeId}/directories`
    - **説明:** 指定したタイプのルートディレクトリ一覧を取得します。
- `GET /v1/directories/{directoryId}`
    - **説明:** ディレクトリの詳細と、その直下の子要素一覧を取得します。
- `GET /v1/directories/{directoryId}/directory-path`
    - **説明:** ディレクトリの階層パス（パンくずリスト用）を表示します。
- `POST /v1/companies/{companyId}/directories`
    - **説明:** 新しいディレクトリを作成します。
- `PATCH /v1/directories/{directoryId}`
    - **説明:** ディレクトリ名を更新します。
- `POST /v1/directories/{directoryId}/move`
    - **説明:** ディレクトリを別の場所へ移動します。
- `DELETE /v1/directories/{directoryId}`
    - **説明:** ディレクトリを再帰的に削除します。

### ディレクトリ内のコンテンツ (`/directories/{id}/...`)

- `GET /v1/directories/{directoryId}/document-types`
    - **説明:** ディレクトリに紐づくドキュメントのタイプ一覧を取得します。
- `GET /v1/directories/{directoryId}/documents`
    - **説明:** ディレクトリ内の書類一覧を取得します。
- `POST /v1/directories/{directoryId}/documents`
    - **説明:** ディレクトリに新しい書類をアップロードします。
- `GET /v1/directories/{directoryId}/drawings`
    - **説明:** ディレクトリ内の図面一覧を取得します。
- `POST /v1/directories/{directoryId}/drawings`
    - **説明:** ディレクトリに新しい図面をアップロードします。

---

## 4. 図面 (Drawings)

システム内の全図面に対する横断的な操作や、リビジョン管理を行います。

- `GET /v1/drawings`
    - **説明:** 全ての図面を横断検索・一覧取得します。ここでcsvの取得も行えるようにする。
- `GET /v1/drawings/{drawingId}`
    - **説明:** 特定の図面リビジョンの詳細情報を取得します。
- `PATCH /v1/drawings/{drawingId}`
    - **説明:** 図面リビジョンの情報（備考やカスタム項目）を更新します。
- `DELETE /v1/drawings/{drawingId}`
    - **説明:** 特定のリビジョンの図面を削除します。
- `GET /v1/drawings/{drawingId}/revisions/{version}/download`
    - **説明:** 図面ファイルをダウンロードします。
- `GET /v1/revision_sets/{revisionSetId}`
    - **説明:** 同じリビジョン集合に属する図面を全て取得します。

### 図面に紐づく書類

- `GET /v1/drawings/{drawingId}/documents`
    - **説明:** 図面に紐づく書類の一覧を取得します。
- `POST /v1/drawings/{drawingId}/documents`
    - **説明:** 図面に新しい書類をアップロードします。
- `PATCH /v1/drawings/{drawingId}/documents/{documentId}`
    - **説明:** 図面に紐づく書類のメタデータを更新します。
- `DELETE /v1/drawings/{drawingId}/documents/{documentId}`
    - **説明:** 図面に紐づく書類を削除します。

---

## 5. 見積もり (Quotes)

- *TODO: このセクションのAPIを設計*

---

## 6. 管理・設定 (Admin / Settings)

システム動作の裏側を支えるマスターデータやカスタム項目を管理します。

### 種別マスター (`/directory-types`, etc.)

- `GET /v1/companies/{companyId}/directory-types`
    - **説明:** ディレクトリ種別の一覧を取得します。
- `POST /v1/companies/{companyId}/directory-types`
    - **説明:** ディレクトリ種別を新規作成します。
- `GET /v1/directory-types/{typeId}/drawing-document-types`
    - **説明:** 図面添付用の書類種別一覧を取得します。
- `POST /v1/directory-types/{typeId}/drawing-document-types`
    - **説明:** 図面添付用の書類種別を新規作成します。
- `GET /v1/directory-types/{typeId}/directory-document-types`
    - **説明:** ディレクトリ直下の書類種別一覧を取得します。
- `POST /v1/directory-types/{typeId}/directory-document-types`
    - **説明:** ディレクトリ直下の書類種別を新規作成します。

### カスタム項目マスター (`/custom-fields`, etc.)

- `GET /v1/custom-item-types`
    - **説明:** カスタム項目で利用できるデータ型の一覧（`STRING`, `NUMBER`等）を取得します。
- **ディレクトリ用カスタム項目**
    - `GET /v1/directory-types/{typeId}/custom-fields` (一覧)
    - `POST /v1/directory-types/{typeId}/custom-fields` (作成)
    - `PATCH /v1/directory-types/{typeId}/custom-fields/{fieldId}` (変更)
    - `GET /v1/directory-custom-fields/{fieldId}/options` (選択肢一覧)
    - `POST /v1/directory-custom-fields/{fieldId}/options` (選択肢作成)
- **図面用カスタム項目**
    - `GET /v1/departments/{departmentId}/drawing-custom-fields` (一覧)
    - `POST /v1/departments/{departmentId}/drawing-custom-fields` (作成)
    - ... (他、選択肢系も同様)
- **ディレクトリ書類用カスタム項目**
    - `GET /v1/directory-document-types/{typeId}/custom-fields` (一覧)
    - ... (他も同様)
- **図面書類用カスタム項目**
    - `GET /v1/drawing-document-types/{typeId}/custom-fields` (一覧)
    - ... (他も同様)

---

## 7. ユーティリティ (Utilities)

特定のリソースに属さない、純粋な機能を提供します。

- `POST /v1/utils/convert/tiff-to-png`
    - **説明:** TIFFファイルをPNGに変換します。
- `POST /v1/utils/convert/dxf-to-png`
    - **説明:** DXFファイルをPNGに変換します。
- `POST /v1/utils/images/orientation`
    - **説明:** 画像の向きを判定し、回転角度を返します。
- `POST /v1/utils/ai/search-similar-drawings`
    - **説明:** AIを用いて類似図面を検索します。
- `POST /v1/utils/ai/search-drawing-diffs`
    - **説明:** AIを用いて2つの図面の差分を検出します。