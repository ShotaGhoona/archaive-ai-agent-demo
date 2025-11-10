import type { Directory } from './types';
import { mockBomData } from './mockData';

// ヘルパー関数: ULID風の文字列生成
const generateUlid = (prefix: string = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}${timestamp}${random}`.padEnd(26, '0');
};

// カスタム項目のサンプル（3個に統一）
const createCustomItemValues = () => {
  return [
    {
      itemId: '1',
      name: '担当部門',
      type: 'STRING' as const,
      value: '生産技術1課',
    },
    {
      itemId: '2',
      name: 'ライフサイクル',
      type: 'SELECT' as const,
      value: '設計承認済',
      options: [
        { value: '設計中', colorCode: '#FFA500' },
        { value: '設計承認済', colorCode: '#4CAF50' },
        { value: '試作', colorCode: '#2196F3' },
        { value: '量産', colorCode: '#9C27B0' },
        { value: '廃止', colorCode: '#F44336' },
      ],
    },
    {
      itemId: '3',
      name: '作成日',
      type: 'DATE' as const,
      value: '2024-01-15',
    },
  ];
};

// 産業用ポンプ PRD-1000（既存のmockDataから取得）
export const industrialPump: Directory = mockBomData.root;

// 産業用コンプレッサー PRD-2000
export const industrialCompressor: Directory = {
  id: 'dir_product_002',
  ulid: generateUlid(),
  type: 'directory',
  seqNumber: 2000,
  directoryTypeId: 'dtype_product',
  directoryTypeName: '製品',
  name: '産業用コンプレッサー PRD-2000',
  customItems: {
    department: '生産技術2課',
    lifecycle: '量産',
    weight: 45.8,
    material: 'アルミニウム合金',
    maxPressure: '1.0 MPa',
    airFlow: '100 L/min',
    certification: 'ISO9001',
    warrantyPeriod: '36ヶ月',
  },
  createdBy: 'user_002',
  updatedBy: 'user_002',
  createdAt: '2024-02-10T09:00:00Z',
  updatedAt: '2024-04-15T14:30:00Z',
  customItemValues: createCustomItemValues(),
  documents: [
    {
      id: generateUlid('dd_'),
      ulid: generateUlid(),
      seqNumber: 1,
      typeId: 'dtype_001',
      typeName: '製品仕様書',
      versions: [
        {
          id: generateUlid('ddv_'),
          ulid: generateUlid(),
          version: 1,
          name: '産業用コンプレッサーPRD-2000_製品仕様書_v1.0',
          s3Url: 's3://bucket/documents/PRD-2000/spec_v1.pdf',
          customItems: { approver: '鈴木一郎', approvalDate: '2024-02-10' },
          createdAt: '2024-02-10T09:00:00Z',
          updatedAt: '2024-02-10T09:00:00Z',
        },
      ],
    },
  ],
  children: mockBomData.root.children, // 同じ子要素構造を使用
};

// 産業用バルブ PRD-3000
export const industrialValve: Directory = {
  id: 'dir_product_003',
  ulid: generateUlid(),
  type: 'directory',
  seqNumber: 3000,
  directoryTypeId: 'dtype_product',
  directoryTypeName: '製品',
  name: '産業用バルブ PRD-3000',
  customItems: {
    department: '生産技術1課',
    lifecycle: '設計中',
    weight: 8.5,
    material: 'SUS316L',
    maxPressure: '2.0 MPa',
    valveType: 'ボールバルブ',
    certification: 'ISO9001',
    warrantyPeriod: '24ヶ月',
  },
  createdBy: 'user_003',
  updatedBy: 'user_003',
  createdAt: '2024-03-05T09:00:00Z',
  updatedAt: '2024-05-20T11:15:00Z',
  customItemValues: createCustomItemValues(),
  documents: [
    {
      id: generateUlid('dd_'),
      ulid: generateUlid(),
      seqNumber: 1,
      typeId: 'dtype_001',
      typeName: '製品仕様書',
      versions: [
        {
          id: generateUlid('ddv_'),
          ulid: generateUlid(),
          version: 1,
          name: '産業用バルブPRD-3000_製品仕様書_v1.0',
          s3Url: 's3://bucket/documents/PRD-3000/spec_v1.pdf',
          customItems: { approver: '高橋花子', approvalDate: '2024-03-05' },
          createdAt: '2024-03-05T09:00:00Z',
          updatedAt: '2024-03-05T09:00:00Z',
        },
      ],
    },
  ],
  children: mockBomData.root.children, // 同じ子要素構造を使用
};

// 産業用熱交換器 PRD-4000
export const industrialHeatExchanger: Directory = {
  id: 'dir_product_004',
  ulid: generateUlid(),
  type: 'directory',
  seqNumber: 4000,
  directoryTypeId: 'dtype_product',
  directoryTypeName: '製品',
  name: '産業用熱交換器 PRD-4000',
  customItems: {
    department: '熱設計課',
    lifecycle: '設計承認済',
    weight: 125.3,
    material: 'SUS304',
    maxPressure: '1.5 MPa',
    heatCapacity: '50 kW',
    certification: 'ISO9001',
    warrantyPeriod: '24ヶ月',
  },
  createdBy: 'user_004',
  updatedBy: 'user_004',
  createdAt: '2024-01-20T09:00:00Z',
  updatedAt: '2024-04-10T16:00:00Z',
  customItemValues: createCustomItemValues(),
  documents: [
    {
      id: generateUlid('dd_'),
      ulid: generateUlid(),
      seqNumber: 1,
      typeId: 'dtype_001',
      typeName: '製品仕様書',
      versions: [
        {
          id: generateUlid('ddv_'),
          ulid: generateUlid(),
          version: 2,
          name: '産業用熱交換器PRD-4000_製品仕様書_v2.0',
          s3Url: 's3://bucket/documents/PRD-4000/spec_v2.pdf',
          customItems: { approver: '佐藤次郎', approvalDate: '2024-04-10' },
          remarks: '熱効率を5%改善',
          createdAt: '2024-04-10T16:00:00Z',
          updatedAt: '2024-04-10T16:00:00Z',
        },
      ],
    },
  ],
  children: mockBomData.root.children, // 同じ子要素構造を使用
};

// 産業用モーター PRD-5000
export const industrialMotor: Directory = {
  id: 'dir_product_005',
  ulid: generateUlid(),
  type: 'directory',
  seqNumber: 5000,
  directoryTypeId: 'dtype_product',
  directoryTypeName: '製品',
  name: '産業用モーター PRD-5000',
  customItems: {
    department: '電気設計課',
    lifecycle: '量産',
    weight: 32.0,
    voltage: '3相400V',
    power: '5.5kW',
    rpm: '1800',
    certification: 'IEC',
    warrantyPeriod: '36ヶ月',
  },
  createdBy: 'user_005',
  updatedBy: 'user_005',
  createdAt: '2024-01-10T09:00:00Z',
  updatedAt: '2024-03-30T10:00:00Z',
  customItemValues: createCustomItemValues(),
  documents: [
    {
      id: generateUlid('dd_'),
      ulid: generateUlid(),
      seqNumber: 1,
      typeId: 'dtype_001',
      typeName: '製品仕様書',
      versions: [
        {
          id: generateUlid('ddv_'),
          ulid: generateUlid(),
          version: 1,
          name: '産業用モーターPRD-5000_製品仕様書_v1.0',
          s3Url: 's3://bucket/documents/PRD-5000/spec_v1.pdf',
          customItems: { approver: '田中三郎', approvalDate: '2024-01-10' },
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-10T09:00:00Z',
        },
      ],
    },
  ],
  children: mockBomData.root.children, // 同じ子要素構造を使用
};

// 全製品リスト
export const allProducts: Directory[] = [
  industrialPump,
  industrialCompressor,
  industrialValve,
  industrialHeatExchanger,
  industrialMotor,
];
