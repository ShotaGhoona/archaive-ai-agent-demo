"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/page-components/customer/lib/customerColumns";
import customersData from "@/page-components/customer/data/customer.json";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Globe,
  Edit,
  Plus
} from "lucide-react";

interface CustomerContactContainerProps {
  customerId: string;
}

export default function CustomerContactContainer({ customerId }: CustomerContactContainerProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCustomer = (customersData as Customer[]).find(
      c => c.customerCode === customerId
    );
    
    setCustomer(foundCustomer || null);
    setLoading(false);
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">顧客が見つかりません</h2>
          <p className="text-gray-600">顧客ID「{customerId}」が見つかりませんでした。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* ページヘッダー */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">連絡先情報</h1>
            <p className="text-sm text-gray-600 mt-1">
              {customer.customerName} の連絡先詳細
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Edit className="h-4 w-4" />
            編集
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* 主要連絡先 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">主要連絡先</h2>
              <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                <Plus className="h-4 w-4" />
                追加
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">メイン電話</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 font-mono mt-1">{customer.phoneNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">営業時間: 9:00-18:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">FAX</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 font-mono mt-1">{customer.faxNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">24時間受信可能</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">メールアドレス</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 mt-1">info@{customer.customerName.toLowerCase().replace(/[^\w]/g, '')}.co.jp</p>
                    <p className="text-xs text-gray-500 mt-1">※例：実装時には実際のデータを使用</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Globe className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">ウェブサイト</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <a 
                      href="#" 
                      className="text-blue-600 hover:text-blue-700 mt-1 inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.{customer.customerName.toLowerCase().replace(/[^\w]/g, '')}.co.jp
                    </a>
                    <p className="text-xs text-gray-500 mt-1">※例：実装時には実際のデータを使用</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 担当者情報 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">担当者情報</h2>
              <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                <Plus className="h-4 w-4" />
                担当者を追加
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {customer.contactPerson.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{customer.contactPerson}</h3>
                  <p className="text-sm text-gray-600">代表取締役社長</p>
                  <p className="text-sm text-gray-500">※役職は例です</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 営業担当者 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">営業担当者</h2>
            
            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {customer.salesRepresentative.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{customer.salesRepresentative}</h3>
                <p className="text-sm text-gray-600">営業部</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}