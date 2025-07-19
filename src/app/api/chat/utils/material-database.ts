// 材料データベース - 概算価格情報

export interface MaterialInfo {
  name: string;
  category: 'steel' | 'aluminum' | 'copper' | 'plastic' | 'special';
  pricePerKg: number; // 円/kg
  density: number; // g/cm³
  properties: {
    strength: string;
    corrosionResistance: string;
    machinability: string;
    weldability: string;
  };
  applications: string[];
  availability: 'high' | 'medium' | 'low';
}

export const materialDatabase: Record<string, MaterialInfo> = {
  // 鋼材
  'S45C': {
    name: '機械構造用炭素鋼',
    category: 'steel',
    pricePerKg: 180,
    density: 7.85,
    properties: {
      strength: '中程度',
      corrosionResistance: '低',
      machinability: '良好',
      weldability: '良好'
    },
    applications: ['シャフト', 'ギア', '構造部品'],
    availability: 'high'
  },
  'SUS304': {
    name: 'ステンレス鋼',
    category: 'steel',
    pricePerKg: 450,
    density: 8.0,
    properties: {
      strength: '中程度',
      corrosionResistance: '高',
      machinability: '普通',
      weldability: '良好'
    },
    applications: ['食品機械', '化学装置', '建材'],
    availability: 'high'
  },
  'SK3': {
    name: '炭素工具鋼',
    category: 'steel',
    pricePerKg: 280,
    density: 7.85,
    properties: {
      strength: '高',
      corrosionResistance: '低',
      machinability: '普通',
      weldability: '困難'
    },
    applications: ['工具', '刃物', '金型'],
    availability: 'medium'
  },
  
  // アルミニウム
  'A5052': {
    name: 'アルミニウム合金',
    category: 'aluminum',
    pricePerKg: 380,
    density: 2.68,
    properties: {
      strength: '中程度',
      corrosionResistance: '高',
      machinability: '良好',
      weldability: '良好'
    },
    applications: ['板金加工', '建材', '船舶'],
    availability: 'high'
  },
  'A7075': {
    name: '超々ジュラルミン',
    category: 'aluminum',
    pricePerKg: 520,
    density: 2.81,
    properties: {
      strength: '高',
      corrosionResistance: '中',
      machinability: '良好',
      weldability: '困難'
    },
    applications: ['航空機', '精密機器', 'スポーツ用品'],
    availability: 'medium'
  },
  
  // 銅合金
  'C3604': {
    name: '快削黄銅',
    category: 'copper',
    pricePerKg: 850,
    density: 8.5,
    properties: {
      strength: '中程度',
      corrosionResistance: '中',
      machinability: '優秀',
      weldability: '普通'
    },
    applications: ['精密部品', '継手', '電子部品'],
    availability: 'high'
  },
  
  // 樹脂
  'ABS': {
    name: 'ABS樹脂',
    category: 'plastic',
    pricePerKg: 280,
    density: 1.05,
    properties: {
      strength: '中程度',
      corrosionResistance: '高',
      machinability: '良好',
      weldability: '不可'
    },
    applications: ['筐体', '自動車部品', '家電'],
    availability: 'high'
  },
  'POM': {
    name: 'ポリアセタール',
    category: 'plastic',
    pricePerKg: 420,
    density: 1.42,
    properties: {
      strength: '高',
      corrosionResistance: '高',
      machinability: '優秀',
      weldability: '困難'
    },
    applications: ['歯車', '軸受', '精密部品'],
    availability: 'high'
  }
};

export interface ProcessingCost {
  process: string;
  unitCost: number; // 円/時間
  setupCost: number; // 円/回
  efficiency: number; // 0-1
  description: string;
}

export const processingCosts: Record<string, ProcessingCost> = {
  'lathe': {
    process: '旋盤加工',
    unitCost: 3500,
    setupCost: 8000,
    efficiency: 0.85,
    description: '円筒形状の外径・内径加工'
  },
  'milling': {
    process: 'フライス加工',
    unitCost: 4200,
    setupCost: 12000,
    efficiency: 0.80,
    description: '平面・溝・穴あけ加工'
  },
  'machining_center': {
    process: 'マシニングセンタ',
    unitCost: 6500,
    setupCost: 15000,
    efficiency: 0.90,
    description: '複合加工・高精度加工'
  },
  'grinding': {
    process: '研削加工',
    unitCost: 5200,
    setupCost: 10000,
    efficiency: 0.75,
    description: '高精度仕上げ加工'
  },
  'sheet_metal': {
    process: '板金加工',
    unitCost: 2800,
    setupCost: 5000,
    efficiency: 0.90,
    description: '曲げ・プレス・溶接'
  },
  'welding': {
    process: '溶接',
    unitCost: 3200,
    setupCost: 3000,
    efficiency: 0.80,
    description: 'TIG・MIG・アーク溶接'
  }
};

export function getMaterialInfo(materialName: string): MaterialInfo | null {
  return materialDatabase[materialName.toUpperCase()] || null;
}

export function getProcessingCost(processName: string): ProcessingCost | null {
  return processingCosts[processName.toLowerCase()] || null;
}

export function calculateMaterialCost(
  materialName: string,
  dimensions: { length: number; width: number; height: number },
  quantity: number = 1
): { cost: number; weight: number; material: MaterialInfo } | null {
  const material = getMaterialInfo(materialName);
  if (!material) return null;

  const volume = dimensions.length * dimensions.width * dimensions.height; // cm³
  const weight = volume * material.density / 1000; // kg
  const totalWeight = weight * quantity;
  const cost = totalWeight * material.pricePerKg;

  return {
    cost,
    weight: totalWeight,
    material
  };
}

export function estimateProcessingTime(
  processName: string,
  complexity: 'simple' | 'medium' | 'complex' = 'medium',
  quantity: number = 1
): { time: number; cost: number; process: ProcessingCost } | null {
  const process = getProcessingCost(processName);
  if (!process) return null;

  const baseTime = (() => {
    switch (complexity) {
      case 'simple': return 0.5;
      case 'medium': return 1.5;
      case 'complex': return 3.0;
      default: return 1.5;
    }
  })();

  const setupTime = 0.5; // 段取り時間
  const totalTime = (setupTime + baseTime * quantity) / process.efficiency;
  const cost = process.setupCost + (totalTime * process.unitCost);

  return {
    time: totalTime,
    cost,
    process
  };
}