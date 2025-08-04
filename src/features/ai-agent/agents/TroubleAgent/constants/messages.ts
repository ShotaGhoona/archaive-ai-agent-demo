// 定数メッセージ定義

export const MESSAGES = {
  // ウェルカムメッセージ
  WELCOME: '過去のトラブル事例、見積もり、仕様書を図面から検索できます。',
  
  // ヘルプメッセージ
  HELP: '検索したい情報の種類をお伝えください（例：トラブル、見積もり、仕様書）',
  
  // エラーメッセージ
  NO_KEYWORD: '検索キーワードを含めてください。\n例：\n- 「トラブル情報を教えてください」\n- 「2020年の見積もりを見たい」\n- 「1995-2001年の仕様書」',
  
  // 検索結果メッセージ
  NO_RESULTS: '該当する情報が見つかりませんでした。',
  NO_RESULTS_IN_PERIOD: '指定された期間に該当する情報は見つかりませんでした。',
  
  // 処理中メッセージ
  SEARCHING: '検索中...',
} as const;

// カテゴリ名の定義
export const CATEGORY_NAMES = {
  trouble: 'トラブル',
  estimate: '見積もり',
  specification: '仕様書',
} as const;

// カテゴリアイコンの定義
export const CATEGORY_ICONS = {
  trouble: '🔧',
  estimate: '💰',
  specification: '📄',
} as const;

// キーワードパターン
export const KEYWORD_PATTERNS = {
  trouble: /トラブル|trouble|問題|不具合|故障|エラー|異常/i,
  estimate: /見積|estimate|コスト|費用|価格|金額|料金/i,
  specification: /仕様|spec|スペック|specification|要件|要求/i,
} as const;

// 年代パターン（1900-2099年）
export const YEAR_PATTERN = /\b(19\d{2}|20\d{2})\b/g;

// デモ用の遅延時間（ミリ秒）
export const DEMO_DELAY = {
  MIN: 500,
  MAX: 1000,
} as const;