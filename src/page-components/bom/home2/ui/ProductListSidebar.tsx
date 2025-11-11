'use client';

import { useState } from 'react';
import { Directory } from '../../shared/data/types';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/shared';

interface ProductListSidebarProps {
  products: Directory[];
  selectedProduct: Directory;
  onSelectProduct: (product: Directory) => void;
}

export default function ProductListSidebar({
  products,
  selectedProduct,
  onSelectProduct,
}: ProductListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 検索フィルタリング
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex w-[280px] flex-col border-r border-gray-200 bg-white">
      {/* 検索窓 */}
      <div className="border-b border-gray-200 p-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="製品検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-gray-300 py-1.5 pl-8 pr-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* 製品リスト */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`w-full rounded px-3 py-2.5 text-left text-sm transition-colors ${
                selectedProduct.id === product.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="line-clamp-2 font-medium">{product.name}</div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
