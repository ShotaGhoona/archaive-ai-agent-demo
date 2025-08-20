import React from 'react';

/**
 * テキストの差分をハイライト表示するヘルパー関数
 */
export function createHighlightedTextElements(text: string, compareText: string): React.ReactNode {
  if (!text || !compareText || text === compareText) {
    return text;
  }

  // 簡単な差分検出: 文字単位で比較
  const textChars = text.split('');
  const compareChars = compareText.split('');
  const maxLength = Math.max(textChars.length, compareChars.length);
  
  const elements: React.ReactNode[] = [];
  let currentSegment = '';
  let isDifferent = false;
  
  for (let i = 0; i < maxLength; i++) {
    const char = textChars[i] || '';
    const compareChar = compareChars[i] || '';
    const charIsDifferent = char !== compareChar;
    
    if (charIsDifferent !== isDifferent) {
      // 状態が変わった場合、現在のセグメントを追加
      if (currentSegment) {
        elements.push(
          isDifferent ? (
            <span key={elements.length} className="bg-blue-100 text-blue-900 px-1 rounded">
              {currentSegment}
            </span>
          ) : (
            <span key={elements.length}>{currentSegment}</span>
          )
        );
      }
      currentSegment = char;
      isDifferent = charIsDifferent;
    } else {
      currentSegment += char;
    }
  }
  
  // 最後のセグメントを追加
  if (currentSegment) {
    elements.push(
      isDifferent ? (
        <span key={elements.length} className="bg-blue-100 text-blue-900 px-1 rounded">
          {currentSegment}
        </span>
      ) : (
        <span key={elements.length}>{currentSegment}</span>
      )
    );
  }
  
  return <span>{elements}</span>;
}