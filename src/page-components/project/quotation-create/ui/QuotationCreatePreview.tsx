'use client';

import { Separator } from '@/shared';
import { QuotationFormData } from '../model';
interface QuotationCreatePreviewProps {
  formData: QuotationFormData;
}

export function QuotationCreatePreview({
  formData,
}: QuotationCreatePreviewProps) {
  const {
    clientName,
    honorific,
    quotationNumber,
    issueDate,
    validUntil,
    tableRows,
    remarks,
    companyInfo,
  } = formData;

  // 小計、消費税、合計の計算
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    tableRows.forEach((row) => {
      const price = parseFloat(row.unitPrice) || 0;
      const qty = parseFloat(row.quantity) || 0;
      const taxRate = parseFloat(row.taxRate) || 0;

      const itemTotal = price * qty;
      const itemTax = itemTotal * (taxRate / 100);

      subtotal += itemTotal;
      totalTax += itemTax;
    });

    return {
      subtotal,
      totalTax,
      total: subtotal + totalTax,
    };
  };

  const totals = calculateTotals();

  return (
    <div className='h-full overflow-y-auto bg-gray-100 p-12'>
      <div className='relative mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-md'>
        {/* ロゴ - 右上に絶対配置 */}
        {companyInfo.logo && (
          <img
            src={companyInfo.logo}
            alt='ロゴ'
            className='absolute top-4 right-4 z-10 object-contain'
          />
        )}

        {/* 印影 - 左下の会社情報付近に絶対配置 */}
        {companyInfo.stamp && (
          <img
            src={companyInfo.stamp}
            alt='印影'
            className='absolute top-48 left-4 z-10 h-16 w-16 object-contain'
          />
        )}

        {/* 見積書ヘッダー */}
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-800'>見積書</h1>
        </div>

        {/* 取引先情報と会社情報 */}
        <div className='mb-8 flex justify-between'>
          <div className='flex-1'>
            <div className='mb-4'>
              <span className='text-lg font-medium'>
                {clientName || ''} {honorific}
              </span>
            </div>
            <div className='space-y-1 text-sm text-gray-600'>
              <div>{companyInfo.address}</div>
              <div>{companyInfo.phone}</div>
            </div>
          </div>
        </div>
        <Separator />

        {/* 発行日・有効期限・見積書番号 */}
        <div className='my-4 space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span>見積書番号</span>
            <span>{quotationNumber || '-'}</span>
          </div>
          <div className='flex justify-between'>
            <span>発行日</span>
            <span>{issueDate || '-'}</span>
          </div>
          <div className='flex justify-between'>
            <span>有効期限</span>
            <span>{validUntil || '-'}</span>
          </div>
        </div>
        <Separator />
        {/* 件名・御見積金額 */}
        <div className='my-4 space-y-4'>
          <div className='text-lg'>
            <span className='font-medium'>件名：</span>
            <span>{tableRows[0]?.productName || '-'}</span>
          </div>
          <div className='text-lg'>
            <span className='font-medium'>御見積金額：</span>
            <span className='font-bold'>
              {totals.total.toLocaleString()} 円
            </span>
          </div>
        </div>

        {/* 明細テーブル */}
        <div className='mb-8'>
          <table className='w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 p-3 text-left'>品名</th>
                <th className='w-20 border border-gray-300 p-3 text-center'>
                  単価
                </th>
                <th className='w-16 border border-gray-300 p-3 text-center'>
                  数量
                </th>
                <th className='w-16 border border-gray-300 p-3 text-center'>
                  単位
                </th>
                <th className='w-32 border border-gray-300 p-3 text-left'>
                  詳細
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length > 0 ? (
                tableRows.map((row) => (
                  <tr key={row.id}>
                    <td className='border border-gray-300 p-3'>
                      {row.productName || '-'}
                    </td>
                    <td className='border border-gray-300 p-3 text-right'>
                      {row.unitPrice
                        ? parseFloat(row.unitPrice).toLocaleString()
                        : '-'}
                    </td>
                    <td className='border border-gray-300 p-3 text-center'>
                      {row.quantity || '-'}
                    </td>
                    <td className='border border-gray-300 p-3 text-center'>
                      {row.unit || '-'}
                    </td>
                    <td className='border border-gray-300 p-3 text-sm'>
                      {row.detail || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='border border-gray-300 p-3'>xxxxx</td>
                  <td className='border border-gray-300 p-3 text-right'>
                    10,000
                  </td>
                  <td className='border border-gray-300 p-3 text-center'>
                    xxx
                  </td>
                  <td className='border border-gray-300 p-3 text-center'>
                    xxx
                  </td>
                  <td className='border border-gray-300 p-3 text-sm'>xxxxxx</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 合計セクション */}
          <div className='mt-4 ml-auto w-64'>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between border-b pb-1'>
                <span>小計</span>
                <span>{totals.subtotal.toLocaleString()}円</span>
              </div>
              <div className='flex justify-between border-b pb-1'>
                <span>消費税(10%)</span>
                <span>{totals.totalTax.toLocaleString()}円</span>
              </div>
              <div className='flex justify-between border-b-2 border-gray-800 pb-2 text-lg font-bold'>
                <span>合計</span>
                <span>{totals.total.toLocaleString()}円</span>
              </div>
            </div>
          </div>
        </div>

        {/* 内訳 */}
        <div className='mb-8'>
          <h3 className='mb-4 font-medium'>内訳</h3>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span>10%対象</span>
              <span>{totals.subtotal.toLocaleString()}円</span>
            </div>
            <div className='flex justify-between'>
              <span>消費税</span>
              <span>{totals.totalTax.toLocaleString()}円</span>
            </div>
          </div>
        </div>

        {/* 備考 */}
        <div>
          <h3 className='mb-4 font-medium'>備考</h3>
          <div className='text-sm whitespace-pre-line text-gray-600'>
            {remarks || '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
