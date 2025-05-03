// Simplified imports
'use client';
import { useState, useEffect } from 'react';
import AddToCartButton from '@/components/store/AddToCartButton';
import { formatPrice } from '@/lib/utils';

export function ClientProductPage({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6">
      <AddToCartButton 
        productId={product.id} 
        quantity={quantity}
        className="w-full"
      />
    </div>
  );
}