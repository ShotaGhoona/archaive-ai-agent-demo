import { ComparisonConfig } from '@/features/comparison-modal';
import { CommonExtractors } from '@/features/comparison-modal';

export const REVISION_COMPARISON_CONFIG: ComparisonConfig = {
  tabs: [
    {
      key: 'estimate',
      label: '見積もり情報比較',
      fields: [
        { key: 'materialCost', label: '材料費' },
        { key: 'processingCost', label: '加工費' },
        { key: 'laborCost', label: '人件費' },
        { key: 'equipmentCost', label: '設備費' },
        { key: 'overheadCost', label: '間接費' },
        { key: 'profitMargin', label: '利益率(%)' },
        { key: 'totalCost', label: '総コスト' },
        { key: 'unitPrice', label: '単価' },
        { key: 'totalPrice', label: '総価格' },
        { key: 'deliveryDays', label: '納期(日)' },
        { key: 'setupCost', label: '段取費' },
        { key: 'transportCost', label: '輸送費' },
        { key: 'packagingCost', label: '梱包費' },
        { key: 'qualityAssuranceCost', label: '品質保証費' },
        { key: 'remarks', label: '備考' },
      ],
    },
    {
      key: 'basic',
      label: '基本情報比較',
      fields: [
        { key: 'fileName', label: 'ファイル名', readOnly: true },
        { key: 'pageNumber', label: 'ページ番号' },
        { key: 'customerName', label: '顧客名' },
        { key: 'productName', label: '製品名' },
        { key: 'internalProductNumber', label: '社内製番' },
        { key: 'customerProductNumber', label: '客先製番' },
        { key: 'cadName', label: 'CAD名' },
        { key: 'camName', label: 'CAM名' },
        { key: 'orderQuantity', label: '受注個数' },
        { key: 'orderDate', label: '受注日' },
        { key: 'deliveryDate', label: '納品日' },
        { key: 'maxLength', label: '最大寸法(長さ)' },
        { key: 'maxWidth', label: '最大寸法(幅)' },
        { key: 'maxHeight', label: '最大寸法(高さ)' },
        { key: 'test', label: 'テスト' },
        { key: 'companyItem', label: '全社項目' },
        { key: 'itemG', label: '項目G' },
        { key: 'itemI', label: '項目I' },
        { key: 'remarks', label: '備考' },
      ],
    },
  ],
  // 保存ハンドラー
  saveHandlers: {
    estimate: (data) => {
      console.log('見積もり情報保存:', data);
    },
    basic: (data) => {
      console.log('基本情報保存:', data);
    },
  },
  // データ抽出方法
  dataExtractors: {
    estimate: CommonExtractors.estimateInformation,
    basic: CommonExtractors.basicInformation,
  },
};