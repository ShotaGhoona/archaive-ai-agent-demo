export interface MaterialCostMaster {
  id: string;
  category: string;
  materialName: string;
  specification: string;
  unit: string;
  unitPrice: number;
  supplier: string;
  notes: string;
  updatedAt: string;
}

export const mockData: MaterialCostMaster[] = [
  {
    id: "1",
    category: "鋼材",
    materialName: "SS400",
    specification: "板厚6mm",
    unit: "kg",
    unitPrice: 120,
    supplier: "山田鋼材",
    notes: "一般構造用圧延鋼材",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    category: "鋼材",
    materialName: "S45C",
    specification: "丸棒φ30mm",
    unit: "m",
    unitPrice: 450,
    supplier: "田中商事",
    notes: "機械構造用炭素鋼",
    updatedAt: "2024-01-14"
  },
  {
    id: "3",
    category: "アルミ材",
    materialName: "A5052",
    specification: "板厚3mm",
    unit: "kg",
    unitPrice: 380,
    supplier: "アルミ工業",
    notes: "非熱処理合金",
    updatedAt: "2024-01-13"
  },
  {
    id: "4",
    category: "樹脂材",
    materialName: "ABS樹脂",
    specification: "板厚5mm",
    unit: "枚",
    unitPrice: 850,
    supplier: "プラスチック商会",
    notes: "汎用エンジニアリングプラスチック",
    updatedAt: "2024-01-12"
  },
  {
    id: "5",
    category: "銅材",
    materialName: "C1020",
    specification: "パイプφ25mm",
    unit: "m",
    unitPrice: 650,
    supplier: "銅管販売",
    notes: "無酸素銅",
    updatedAt: "2024-01-11"
  },
  {
    id: "6",
    category: "ステンレス",
    materialName: "SUS304",
    specification: "板厚2mm",
    unit: "kg",
    unitPrice: 520,
    supplier: "ステンレス商社",
    notes: "オーステナイト系ステンレス鋼",
    updatedAt: "2024-01-10"
  }
];

export const columns = [
  {
    key: "category",
    label: "材料カテゴリ",
    type: "string" as const,
    width: 120,
    editable: true
  },
  {
    key: "materialName",
    label: "材料名",
    type: "string" as const,
    width: 120,
    editable: true
  },
  {
    key: "specification",
    label: "規格・仕様",
    type: "string" as const,
    width: 150,
    editable: true
  },
  {
    key: "unit",
    label: "単位",
    type: "string" as const,
    width: 80,
    editable: true
  },
  {
    key: "unitPrice",
    label: "単価(円)",
    type: "number" as const,
    width: 100,
    editable: true,
    format: (value: number) => `¥${value.toLocaleString()}`
  },
  {
    key: "supplier",
    label: "仕入先",
    type: "string" as const,
    width: 120,
    editable: true
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