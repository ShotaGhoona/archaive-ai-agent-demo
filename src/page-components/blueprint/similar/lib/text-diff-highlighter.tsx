/**
 * テキスト差分ハイライト機能
 * 2つの文字列を比較して、異なる文字を特定しハイライト表示するためのユーティリティ
 */

/**
 * 2つの文字列の差分を文字単位で検出
 * @param text1 比較対象文字列1
 * @param text2 比較対象文字列2
 * @returns 異なる文字位置のインデックス配列
 */
export function detectTextDifferences(text1: string, text2: string): number[] {
  if (!text1 || !text2) return [];
  
  const chars1 = text1.split('');
  const chars2 = text2.split('');
  const maxLength = Math.max(chars1.length, chars2.length);
  
  const differences: number[] = [];
  for (let i = 0; i < maxLength; i++) {
    const char1 = chars1[i] || '';
    const char2 = chars2[i] || '';
    if (char1 !== char2) {
      differences.push(i);
    }
  }
  
  return differences;
}

/**
 * 文字列を差分ハイライト用のスパン要素に変換
 * @param text ハイライト対象文字列
 * @param compareText 比較対象文字列
 * @param highlightClassName ハイライト用CSSクラス名
 * @returns ハイライト付きReactエレメント配列
 */
export function createHighlightedTextElements(
  text: string, 
  compareText: string, 
  highlightClassName = 'text-red-600 bg-red-50'
) {
  if (!text) return null;
  
  const differences = detectTextDifferences(text, compareText);
  
  if (differences.length === 0) {
    return text;
  }
  
  const chars = text.split('');
  return chars.map((char, index) => (
    <span 
      key={index} 
      className={differences.includes(index) ? highlightClassName : ''}
    >
      {char}
    </span>
  ));
}