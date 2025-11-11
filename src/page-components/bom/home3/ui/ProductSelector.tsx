'use client';

import { Directory } from '../../shared/data/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared';

interface ProductSelectorProps {
  products: Directory[];
  selectedProduct: Directory;
  onSelectProduct: (product: Directory) => void;
}

export default function ProductSelector({
  products,
  selectedProduct,
  onSelectProduct,
}: ProductSelectorProps) {
  return (
    <div className="absolute left-4 top-4 z-10">
      <Select
        value={selectedProduct.id}
        onValueChange={(value) => {
          const product = products.find((p) => p.id === value);
          if (product) {
            onSelectProduct(product);
          }
        }}
      >
        <SelectTrigger className="w-[300px] bg-white shadow-lg">
          <SelectValue>{selectedProduct.name}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
