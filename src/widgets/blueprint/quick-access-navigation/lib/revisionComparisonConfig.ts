import { ComparisonConfig } from '@/features';

export const REVISION_COMPARISON_CONFIG: ComparisonConfig = {
  tabs: [
    {
      id: 'estimate',
      label: '見積',
      fields: [
        {
          key: 'basicInformation.productName',
          label: '製品名',
          type: 'text'
        },
        {
          key: 'basicInformation.customerName', 
          label: '顧客名',
          type: 'text'
        },
        {
          key: 'basicInformation.orderDate',
          label: '注文日',
          type: 'date'
        },
        {
          key: 'estimateInformation.totalCost',
          label: '総コスト',
          type: 'currency'
        },
        {
          key: 'estimateInformation.materialCost',
          label: '材料費',
          type: 'currency'
        },
        {
          key: 'estimateInformation.processingCost',
          label: '加工費',
          type: 'currency'
        },
      ]
    },
    {
      id: 'specifications',
      label: '仕様',
      fields: [
        {
          key: 'basicInformation.maxDimensionL',
          label: '長さ (mm)',
          type: 'number'
        },
        {
          key: 'basicInformation.maxDimensionW',
          label: '幅 (mm)',
          type: 'number'
        },
        {
          key: 'basicInformation.maxDimensionH',
          label: '高さ (mm)',
          type: 'number'
        },
        {
          key: 'basicInformation.weight',
          label: '重量 (kg)',
          type: 'number'
        },
        {
          key: 'basicInformation.material',
          label: '材質',
          type: 'text'
        },
        {
          key: 'basicInformation.surfaceTreatment',
          label: '表面処理',
          type: 'text'
        }
      ]
    }
  ]
};