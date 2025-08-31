/**
 * ネストしたオブジェクトの値取得・設定ユーティリティ
 * 
 * TableViewでネストしたオブジェクト（カスタムアイテム等）を扱うために作成。
 * 'customer_custom_items.業界分類.value' のようなパス形式で値の取得・設定が可能。
 * 
 * 作成理由：
 * - TableViewシステムではカラムキーが文字列のため、ネストしたオブジェクトに標準対応していない
 * - カスタムアイテムのような複雑なデータ構造を扱うため
 * - 複数ドメイン（customer, blueprint, project等）で汎用的に使用可能
 * 
 * 使用例：
 * getValue(data, 'customer_custom_items.業界分類.value') → '精密機械'
 * setValue(data, 'customer_custom_items.業界分類.value', '建設業')
 */

export function getValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function setValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  const target = keys.reduce((current, key) => {
    if (!(key in current)) {
      current[key] = {};
    }
    return current[key] as Record<string, unknown>;
  }, obj);
  
  target[lastKey] = value;
  return obj;
}