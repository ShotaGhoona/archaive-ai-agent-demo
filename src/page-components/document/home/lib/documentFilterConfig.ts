import { FilterConfig } from '@/shared';
import { Quotation, Order, Delivery, Invoice, Specification, Inspection } from '../model';

export const QUOTATION_FILTER_CONFIG: FilterConfig<Quotation>[] = [
  {
    key: 'name',
    label: '帳票名',
    type: 'text',
    placeholder: '帳票名を入力'
  },
  {
    key: 'project_name',
    label: '案件名',
    type: 'text',
    placeholder: '案件名を入力'
  },
  {
    key: 'customer_name',
    label: '顧客名',
    type: 'text',
    placeholder: '顧客名を入力'
  },
  {
    key: 'amount',
    label: '見積金額',
    type: 'number',
    placeholder: '見積金額を入力'
  },
  {
    key: 'quotation_date',
    label: '見積日',
    type: 'dateRange'
  },
  {
    key: 'expiry_date',
    label: '有効期限',
    type: 'dateRange'
  },
  {
    key: 'approval_status',
    label: '承認状況',
    type: 'select',
    options: [
      '承認済み',
      '未承認',
      '差し戻し',
      '期限切れ'
    ],
    defaultValue: 'all'
  }
];

export const ORDER_FILTER_CONFIG: FilterConfig<Order>[] = [
  {
    key: 'name',
    label: '帳票名',
    type: 'text',
    placeholder: '帳票名を入力'
  },
  {
    key: 'project_name',
    label: '案件名',
    type: 'text',
    placeholder: '案件名を入力'
  },
  {
    key: 'supplier_name',
    label: '発注先',
    type: 'text',
    placeholder: '発注先を入力'
  },
  {
    key: 'order_amount',
    label: '発注金額',
    type: 'number',
    placeholder: '発注金額を入力'
  },
  {
    key: 'order_date',
    label: '発注日',
    type: 'dateRange'
  },
  {
    key: 'delivery_date',
    label: '納期',
    type: 'dateRange'
  },
  {
    key: 'approval_status',
    label: '承認状況',
    type: 'select',
    options: [
      '承認済み',
      '未承認',
      '差し戻し',
      '期限切れ'
    ],
    defaultValue: 'all'
  }
];

export const DELIVERY_FILTER_CONFIG: FilterConfig<Delivery>[] = [
  {
    key: 'name',
    label: '帳票名',
    type: 'text',
    placeholder: '帳票名を入力'
  },
  {
    key: 'project_name',
    label: '案件名',
    type: 'text',
    placeholder: '案件名を入力'
  },
  {
    key: 'delivery_destination',
    label: '納品先',
    type: 'text',
    placeholder: '納品先を入力'
  },
  {
    key: 'delivery_date',
    label: '納品日',
    type: 'dateRange'
  },
  {
    key: 'inspection_scheduled_date',
    label: '検収予定日',
    type: 'dateRange'
  },
  {
    key: 'inspection_status',
    label: '検収状況',
    type: 'select',
    options: [
      '検収完了',
      '検収待ち',
      '未納品'
    ],
    defaultValue: 'all'
  }
];

export const INVOICE_FILTER_CONFIG: FilterConfig<Invoice>[] = [
  {
    key: 'name',
    label: '帳票名',
    type: 'text',
    placeholder: '帳票名を入力'
  },
  {
    key: 'project_name',
    label: '案件名',
    type: 'text',
    placeholder: '案件名を入力'
  },
  {
    key: 'billing_destination',
    label: '請求先',
    type: 'text',
    placeholder: '請求先を入力'
  },
  {
    key: 'billing_amount',
    label: '請求金額',
    type: 'number',
    placeholder: '請求金額を入力'
  },
  {
    key: 'billing_date',
    label: '請求日',
    type: 'dateRange'
  },
  {
    key: 'payment_due_date',
    label: '支払期限',
    type: 'dateRange'
  },
  {
    key: 'payment_status',
    label: '支払状況',
    type: 'select',
    options: [
      '支払済み',
      '未払い'
    ],
    defaultValue: 'all'
  }
];

export const SPECIFICATION_FILTER_CONFIG: FilterConfig<Specification>[] = [
  {
    key: 'name',
    label: '帳票名',
    type: 'text',
    placeholder: '帳票名を入力'
  },
  {
    key: 'project_name',
    label: '案件名',
    type: 'text',
    placeholder: '案件名を入力'
  },
  {
    key: 'blueprint_name',
    label: '図面名',
    type: 'text',
    placeholder: '図面名を入力'
  },
  {
    key: 'version',
    label: 'バージョン',
    type: 'text',
    placeholder: 'バージョンを入力'
  },
  {
    key: 'approval_status',
    label: '承認状況',
    type: 'select',
    options: [
      '承認済み',
      '未承認',
      '差し戻し'
    ],
    defaultValue: 'all'
  }
];

export const INSPECTION_FILTER_CONFIG: FilterConfig<Inspection>[] = [
  {
    key: 'name',
    label: '帳票名',
    type: 'text',
    placeholder: '帳票名を入力'
  },
  {
    key: 'project_name',
    label: '案件名',
    type: 'text',
    placeholder: '案件名を入力'
  },
  {
    key: 'inspection_items_count',
    label: '検査項目数',
    type: 'number',
    placeholder: '検査項目数を入力'
  },
  {
    key: 'inspection_date',
    label: '検査日',
    type: 'dateRange'
  },
  {
    key: 'inspection_result',
    label: '検査結果',
    type: 'select',
    options: [
      '合格',
      '要再検査',
      '検査中',
      '検査待ち'
    ],
    defaultValue: 'all'
  },
  {
    key: 'approval_status',
    label: '承認状況',
    type: 'select',
    options: [
      '承認済み',
      '未承認',
      '差し戻し'
    ],
    defaultValue: 'all'
  }
];