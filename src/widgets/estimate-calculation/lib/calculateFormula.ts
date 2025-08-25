import { Dimensions } from "../model/types";

// 計算式を安全に実行する関数
export const calculateFormula = (formula: string, dimensions: Dimensions): number => {
  try {
    const { length, width, height, weight } = dimensions;
    const result = Function('"use strict"; return (' + 
      formula
        .replace(/length/g, length.toString())
        .replace(/width/g, width.toString())
        .replace(/height/g, height.toString())
        .replace(/weight/g, weight.toString()) + 
    ')')();
    return Math.round(result);
  } catch (error) {
    console.error('計算エラー:', error);
    return 0;
  }
};