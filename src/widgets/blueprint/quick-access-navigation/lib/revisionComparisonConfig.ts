import { ComparisonConfig } from '@/features';

export const REVISION_COMPARISON_CONFIG: ComparisonConfig = {
  tabs: [
    {
      key: 'estimate',
      label: '見積',
      fields: [
        {
          key: 'basicInformation.productName',
          label: '製品名'
        },
        {
          key: 'basicInformation.customerName', 
          label: '顧客名'
        },
        {
          key: 'basicInformation.orderDate',
          label: '注文日'
        },
        {
          key: 'estimateInformation.totalCost',
          label: '総コスト'
        },
        {
          key: 'estimateInformation.materialCost',
          label: '材料費'
        },
        {
          key: 'estimateInformation.processingCost',
          label: '加工費'
        },
      ]
    },
    {
      key: 'specifications',
      label: '仕様',
      fields: [
        {
          key: 'basicInformation.maxDimensionL',
          label: '長さ (mm)'
        },
        {
          key: 'basicInformation.maxDimensionW',
          label: '幅 (mm)'
        },
        {
          key: 'basicInformation.maxDimensionH',
          label: '高さ (mm)'
        },
        {
          key: 'basicInformation.weight',
          label: '重量 (kg)'
        },
        {
          key: 'basicInformation.material',
          label: '材質'
        },
        {
          key: 'basicInformation.surfaceTreatment',
          label: '表面処理'
        }
      ]
    }
  ]
};