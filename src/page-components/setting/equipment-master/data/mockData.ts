export interface EquipmentMaster {
  id: string;
  category: string;
  equipmentName: string;
  specification: string;
  manufacturer: string;
  hourlyRate: number;
  energyCost: number;
  maintenanceCost: number;
  notes: string;
  updatedAt: string;
}

export const mockData: EquipmentMaster[] = [
  {
    id: "1",
    category: "加工機械",
    equipmentName: "NC旋盤",
    specification: "最大加工径φ200mm",
    manufacturer: "ヤマザキマザック",
    hourlyRate: 2500,
    energyCost: 300,
    maintenanceCost: 150,
    notes: "高精度加工対応、自動工具交換装置付き",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    category: "加工機械",
    equipmentName: "マシニングセンタ",
    specification: "加工範囲 800×600×500mm",
    manufacturer: "オークマ",
    hourlyRate: 3200,
    energyCost: 450,
    maintenanceCost: 200,
    notes: "5軸制御、高速加工対応",
    updatedAt: "2024-01-14"
  },
  {
    id: "3",
    category: "溶接機械",
    equipmentName: "TIG溶接機",
    specification: "出力300A、アルゴンガス仕様",
    manufacturer: "パナソニック",
    hourlyRate: 1800,
    energyCost: 250,
    maintenanceCost: 100,
    notes: "ステンレス・アルミ溶接対応",
    updatedAt: "2024-01-13"
  },
  {
    id: "4",
    category: "測定機器",
    equipmentName: "三次元測定機",
    specification: "測定範囲 1000×800×600mm",
    manufacturer: "ミツトヨ",
    hourlyRate: 1500,
    energyCost: 150,
    maintenanceCost: 300,
    notes: "精度±2μm、温度補正機能付き",
    updatedAt: "2024-01-12"
  },
  {
    id: "5",
    category: "搬送機械",
    equipmentName: "クレーン",
    specification: "吊上荷重2.8t、スパン12m",
    manufacturer: "キトー",
    hourlyRate: 800,
    energyCost: 200,
    maintenanceCost: 80,
    notes: "インバータ制御、無線リモコン付き",
    updatedAt: "2024-01-11"
  },
  {
    id: "6",
    category: "熱処理",
    equipmentName: "熱処理炉",
    specification: "最高温度1200℃、容積0.5m³",
    manufacturer: "中外炉工業",
    hourlyRate: 2200,
    energyCost: 800,
    maintenanceCost: 250,
    notes: "プログラム制御、均熱性±5℃",
    updatedAt: "2024-01-10"
  }
];

export const columns = [
  {
    key: "category",
    label: "設備カテゴリ",
    type: "string" as const,
    width: 120,
    editable: true
  },
  {
    key: "equipmentName",
    label: "設備名",
    type: "string" as const,
    width: 140,
    editable: true
  },
  {
    key: "specification",
    label: "仕様・規格",
    type: "string" as const,
    width: 180,
    editable: true
  },
  {
    key: "manufacturer",
    label: "メーカー",
    type: "string" as const,
    width: 120,
    editable: true
  },
  {
    key: "hourlyRate",
    label: "時間単価(円)",
    type: "number" as const,
    width: 110,
    editable: true,
    format: (value: number) => `¥${value.toLocaleString()}/h`
  },
  {
    key: "energyCost",
    label: "電力費(円/h)",
    type: "number" as const,
    width: 100,
    editable: true,
    format: (value: number) => `¥${value.toLocaleString()}`
  },
  {
    key: "maintenanceCost",
    label: "保守費(円/h)",
    type: "number" as const,
    width: 100,
    editable: true,
    format: (value: number) => `¥${value.toLocaleString()}`
  },
  {
    key: "notes",
    label: "備考",
    type: "string" as const,
    width: 200,
    editable: true
  },
  {
    key: "updatedAt",
    label: "更新日",
    type: "date" as const,
    width: 100,
    editable: false
  }
];